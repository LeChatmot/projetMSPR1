import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../app/components/Header";

const mockOnMenuToggle = vi.fn();

vi.mock("../app/context/AuthContext", () => ({
    useAuth: vi.fn(() => ({
        user: {
            name: "Jean Dupont",
            role: "admin",
            avatarColor: "#10b981",
        },
    })),
}));

function renderHeader(path = "/") {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Header onMenuToggle={mockOnMenuToggle} />
        </MemoryRouter>
    );
}

describe("Header", () => {

    describe("Titre de la page", () => {
        it('affiche "Dashboard" pour la route "/"', () => {
            renderHeader("/");
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        it('affiche "Patients" pour la route "/patients"', () => {
            renderHeader("/patients");
            expect(screen.getByText("Patients")).toBeInTheDocument();
        });

        it('affiche "Nutrition" pour la route "/nutrition"', () => {
            renderHeader("/nutrition");
            expect(screen.getByText("Nutrition")).toBeInTheDocument();
        });

        it('affiche "Santé & Fit" pour une route inconnue', () => {
            renderHeader("/route-inconnue");
            expect(screen.getByText("Santé & Fit")).toBeInTheDocument();
        });
    });

    describe("Utilisateur", () => {
        it("affiche le nom de l'utilisateur", () => {
            renderHeader();
            expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
        });

        it('affiche "Administrateur" pour un utilisateur admin', () => {
            renderHeader();
            expect(screen.getByText("Administrateur")).toBeInTheDocument();
        });

        it("affiche les initiales JD", () => {
            renderHeader();
            expect(screen.getByText("JD")).toBeInTheDocument();
        });
    });

    describe("Boutons", () => {
        it("affiche le bouton notifications", () => {
            renderHeader();
            expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
        });

        it("appelle onMenuToggle au clic sur le bouton hamburger", () => {
            renderHeader();
            fireEvent.click(screen.getByLabelText("Ouvrir le menu"));
            expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
        });
    });
});
