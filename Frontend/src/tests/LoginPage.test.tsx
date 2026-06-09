import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../app/components/LoginPage";

// ─── Mocks ────────────────────────────────────────────────────────────────

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../app/context/AuthContext", () => ({
    useAuth: () => ({ login: mockLogin }),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ─── Helper ───────────────────────────────────────────────────────────────

function renderLoginPage() {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe("LoginPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendu initial ───────────────────────────────────────────────────────

    describe("Rendu initial", () => {
        it("affiche le titre Santé & Fit", () => {
            renderLoginPage();
            expect(screen.getByText("Santé & Fit")).toBeInTheDocument();
        });

        it("affiche le sous-titre", () => {
            renderLoginPage();
            expect(
                screen.getByText("Connectez-vous à votre espace santé")
            ).toBeInTheDocument();
        });

        it("affiche le champ email", () => {
            renderLoginPage();
            expect(screen.getByLabelText("Adresse e-mail")).toBeInTheDocument();
        });

        it("affiche le champ mot de passe", () => {
            renderLoginPage();
            expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
        });

        it("affiche le bouton Se connecter", () => {
            renderLoginPage();
            expect(
                screen.getByRole("button", { name: "Se connecter" })
            ).toBeInTheDocument();
        });

        it("affiche le lien vers la page d'inscription", () => {
            renderLoginPage();
            expect(screen.getByText("Créer un compte")).toBeInTheDocument();
        });

        it("n'affiche pas d'erreur au départ", () => {
            renderLoginPage();
            expect(
                screen.queryByText("Veuillez remplir tous les champs.")
            ).not.toBeInTheDocument();
        });
    });

    // ── Validation ──────────────────────────────────────────────────────────

    describe("Validation du formulaire", () => {
        it("affiche une erreur si email et mot de passe sont vides", async () => {
            renderLoginPage();
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
            expect(
                await screen.findByText("Veuillez remplir tous les champs.")
            ).toBeInTheDocument();
        });

        it("affiche une erreur si seulement le mot de passe est vide", async () => {
            renderLoginPage();
            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "test@test.com" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
            expect(
                await screen.findByText("Veuillez remplir tous les champs.")
            ).toBeInTheDocument();
        });

        it("affiche une erreur si seulement l'email est vide", async () => {
            renderLoginPage();
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "password123" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
            expect(
                await screen.findByText("Veuillez remplir tous les champs.")
            ).toBeInTheDocument();
        });

        it("ne appelle pas login() si les champs sont vides", async () => {
            renderLoginPage();
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    // ── Connexion réussie ───────────────────────────────────────────────────

    describe("Connexion réussie", () => {
        it("appelle login() avec email et mot de passe corrects", async () => {
            mockLogin.mockResolvedValueOnce(undefined);
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "password123" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
            });
        });

        it("redirige vers / après connexion réussie", async () => {
            mockLogin.mockResolvedValueOnce(undefined);
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "password123" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
            });
        });

        it("affiche l'état de chargement pendant la connexion", async () => {
            // Login qui ne résout jamais → état loading bloqué
            mockLogin.mockReturnValueOnce(new Promise(() => {}));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "password123" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(screen.getByText("Connexion...")).toBeInTheDocument();
            });
        });

        it("désactive le bouton pendant le chargement", async () => {
            mockLogin.mockReturnValueOnce(new Promise(() => {}));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "password123" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /Connexion/i })
                ).toBeDisabled();
            });
        });
    });

    // ── Connexion échouée ───────────────────────────────────────────────────

    describe("Connexion échouée", () => {
        it("affiche une erreur si login() rejette", async () => {
            mockLogin.mockRejectedValueOnce(new Error("Unauthorized"));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "wrong@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "wrongpassword" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            expect(
                await screen.findByText("Identifiants incorrects. Veuillez réessayer.")
            ).toBeInTheDocument();
        });

        it("réactive le bouton après un échec de connexion", async () => {
            mockLogin.mockRejectedValueOnce(new Error("Unauthorized"));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "wrong@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "wrongpassword" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "Se connecter" })
                ).not.toBeDisabled();
            });
        });

        it("ne redirige pas après un échec de connexion", async () => {
            mockLogin.mockRejectedValueOnce(new Error("Unauthorized"));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "wrong@test.com" },
            });
            fireEvent.change(screen.getByLabelText("Mot de passe"), {
                target: { value: "wrongpassword" },
            });
            fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

            await waitFor(() => {
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });
    });

    // ── Saisie des champs ───────────────────────────────────────────────────

    describe("Saisie des champs", () => {
        it("met à jour la valeur de l'email", () => {
            renderLoginPage();
            const input = screen.getByLabelText("Adresse e-mail");
            fireEvent.change(input, { target: { value: "test@mail.com" } });
            expect(input).toHaveValue("test@mail.com");
        });

        it("met à jour la valeur du mot de passe", () => {
            renderLoginPage();
            const input = screen.getByLabelText("Mot de passe");
            fireEvent.change(input, { target: { value: "secret" } });
            expect(input).toHaveValue("secret");
        });

        it("le champ email a le bon type", () => {
            renderLoginPage();
            expect(screen.getByLabelText("Adresse e-mail")).toHaveAttribute(
                "type",
                "email"
            );
        });

        it("le champ mot de passe a le bon type", () => {
            renderLoginPage();
            expect(screen.getByLabelText("Mot de passe")).toHaveAttribute(
                "type",
                "password"
            );
        });
    });
});
