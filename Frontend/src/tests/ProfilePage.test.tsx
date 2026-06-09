import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfilePage } from "../app/components/ProfilePage";

// ─── Mocks ────────────────────────────────────────────────────────────────

const mockUpdateProfile = vi.fn();
const mockUpdatePassword = vi.fn();

const mockUser = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@test.com",
    name: "Jean Dupont",
    pseudo: "jeandupont",
    role: "user",
    avatarColor: "#10b981",
};

vi.mock("../app/context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
        updateProfile: mockUpdateProfile,
        updatePassword: mockUpdatePassword,
    }),
}));

// ─── Helper ───────────────────────────────────────────────────────────────

function renderProfilePage() {
    return render(<ProfilePage />);
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe("ProfilePage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendu initial ───────────────────────────────────────────────────────

    describe("Rendu initial", () => {
        it("affiche le titre Mon profil", () => {
            renderProfilePage();
            expect(screen.getByText("Mon profil")).toBeInTheDocument();
        });

        it("affiche le nom complet de l'utilisateur", () => {
            renderProfilePage();
            expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
        });

        it("affiche le pseudo", () => {
            renderProfilePage();
            expect(screen.getByText("@jeandupont")).toBeInTheDocument();
        });

        it('affiche "Utilisateur" pour un rôle user', () => {
            renderProfilePage();
            expect(screen.getByText("Utilisateur")).toBeInTheDocument();
        });

        it("affiche les initiales dans l'avatar", () => {
            renderProfilePage();
            expect(screen.getByText("JD")).toBeInTheDocument();
        });

        it("pré-remplit le champ Prénom", () => {
            renderProfilePage();
            expect(screen.getByLabelText("Prénom")).toHaveValue("Jean");
        });

        it("pré-remplit le champ Nom", () => {
            renderProfilePage();
            expect(screen.getByLabelText("Nom")).toHaveValue("Dupont");
        });

        it("pré-remplit le champ Email", () => {
            renderProfilePage();
            expect(screen.getByLabelText("Adresse e-mail")).toHaveValue(
                "jean.dupont@test.com"
            );
        });

        it("les champs mot de passe sont vides au départ", () => {
            renderProfilePage();
            expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
            expect(screen.getByLabelText("Nouveau mot de passe")).toHaveValue("");
            expect(
                screen.getByLabelText("Confirmer le nouveau mot de passe")
            ).toHaveValue("");
        });
    });

    // ── Formulaire informations personnelles ────────────────────────────────

    describe("Formulaire informations personnelles", () => {
        it("affiche une erreur si un champ est vide", async () => {
            renderProfilePage();
            fireEvent.change(screen.getByLabelText("Prénom"), {
                target: { value: "" },
            });
            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );
            expect(
                await screen.findByText("Tous les champs sont requis.")
            ).toBeInTheDocument();
        });

        it("ne appelle pas updateProfile si un champ est vide", async () => {
            renderProfilePage();
            fireEvent.change(screen.getByLabelText("Nom"), {
                target: { value: "   " },
            });
            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );
            await waitFor(() => {
                expect(mockUpdateProfile).not.toHaveBeenCalled();
            });
        });

        it("appelle updateProfile avec les bonnes valeurs", async () => {
            mockUpdateProfile.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Prénom"), {
                target: { value: "Marie" },
            });
            fireEvent.change(screen.getByLabelText("Nom"), {
                target: { value: "Curie" },
            });
            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "marie@curie.com" },
            });
            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            await waitFor(() => {
                expect(mockUpdateProfile).toHaveBeenCalledWith(
                    "Curie",
                    "Marie",
                    "marie@curie.com"
                );
            });
        });

        it("affiche le message de succès après mise à jour", async () => {
            mockUpdateProfile.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            expect(
                await screen.findByText("Profil mis à jour avec succès.")
            ).toBeInTheDocument();
        });

        it("affiche une erreur si updateProfile rejette", async () => {
            mockUpdateProfile.mockRejectedValueOnce(new Error("Erreur serveur"));
            renderProfilePage();

            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
        });

        it("affiche l'état de chargement pendant la mise à jour", async () => {
            mockUpdateProfile.mockReturnValueOnce(new Promise(() => {}));
            renderProfilePage();

            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            await waitFor(() => {
                expect(screen.getByText("Enregistrement...")).toBeInTheDocument();
            });
        });

        it("désactive le bouton pendant le chargement", async () => {
            mockUpdateProfile.mockReturnValueOnce(new Promise(() => {}));
            renderProfilePage();

            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /Enregistrement/i })
                ).toBeDisabled();
            });
        });

        it("normalise l'email en minuscules", async () => {
            mockUpdateProfile.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Adresse e-mail"), {
                target: { value: "JEAN@TEST.COM" },
            });
            fireEvent.click(
                screen.getByRole("button", { name: "Enregistrer les modifications" })
            );

            await waitFor(() => {
                expect(mockUpdateProfile).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                    "jean@test.com"
                );
            });
        });
    });

    // ── Formulaire mot de passe ─────────────────────────────────────────────

    describe("Formulaire mot de passe", () => {
        it("affiche une erreur si les champs sont vides", async () => {
            renderProfilePage();
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );
            expect(
                await screen.findByText("Tous les champs sont requis.")
            ).toBeInTheDocument();
        });

        it("affiche une erreur si le nouveau mot de passe est trop court", async () => {
            renderProfilePage();
            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "abc" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "abc" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );
            expect(
                await screen.findByText(
                    "Le nouveau mot de passe doit faire au moins 6 caractères."
                )
            ).toBeInTheDocument();
        });

        it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
            renderProfilePage();
            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "different123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );
            expect(
                await screen.findByText("Les mots de passe ne correspondent pas.")
            ).toBeInTheDocument();
        });

        it("appelle updatePassword avec les bonnes valeurs", async () => {
            mockUpdatePassword.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            await waitFor(() => {
                expect(mockUpdatePassword).toHaveBeenCalledWith(
                    "ancienmdp",
                    "nouveau123"
                );
            });
        });

        it("affiche le message de succès après changement", async () => {
            mockUpdatePassword.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            expect(
                await screen.findByText("Mot de passe mis à jour avec succès.")
            ).toBeInTheDocument();
        });

        it("vide les champs mot de passe après succès", async () => {
            mockUpdatePassword.mockResolvedValueOnce(undefined);
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            await waitFor(() => {
                expect(screen.getByLabelText("Mot de passe actuel")).toHaveValue("");
                expect(screen.getByLabelText("Nouveau mot de passe")).toHaveValue("");
                expect(
                    screen.getByLabelText("Confirmer le nouveau mot de passe")
                ).toHaveValue("");
            });
        });

        it("affiche une erreur si updatePassword rejette", async () => {
            mockUpdatePassword.mockRejectedValueOnce(
                new Error("Mot de passe actuel incorrect")
            );
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "mauvaismdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            expect(
                await screen.findByText("Mot de passe actuel incorrect")
            ).toBeInTheDocument();
        });

        it("affiche l'état de chargement pendant la mise à jour", async () => {
            mockUpdatePassword.mockReturnValueOnce(new Promise(() => {}));
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            await waitFor(() => {
                expect(screen.getByText("Mise à jour...")).toBeInTheDocument();
            });
        });

        it("désactive le bouton pendant le chargement", async () => {
            mockUpdatePassword.mockReturnValueOnce(new Promise(() => {}));
            renderProfilePage();

            fireEvent.change(screen.getByLabelText("Mot de passe actuel"), {
                target: { value: "ancienmdp" },
            });
            fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
                target: { value: "nouveau123" },
            });
            fireEvent.change(
                screen.getByLabelText("Confirmer le nouveau mot de passe"),
                { target: { value: "nouveau123" } }
            );
            fireEvent.click(
                screen.getByRole("button", { name: "Changer le mot de passe" })
            );

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /Mise à jour/i })
                ).toBeDisabled();
            });
        });
    });
});
