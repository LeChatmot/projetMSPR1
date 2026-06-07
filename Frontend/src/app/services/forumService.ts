import type { ForumCommentaire, ForumPublication } from "../types";
import { apiCall } from "./api";

const MOCK_PUBLICATIONS: ForumPublication[] = [
  {
    id: 1, libelle: "Perdre du poids",
    contenu: "Depuis longtemps j'ai envie de perdre du poids, c'est très compliqué. Des conseils ?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: null, id_utilisateurs: 1,
    auteur_pseudo: "alice_fit", auteur_nom: "Martin", auteur_prenom: "Alice",
    nb_commentaires: 2,
  },
  {
    id: 2, libelle: "Sortie vélo dimanche",
    contenu: "Qui est partant pour une sortie vélo dimanche matin, ~40 km ?",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: null, id_utilisateurs: 2,
    auteur_pseudo: "bob_sport", auteur_nom: "Lefebvre", auteur_prenom: "Bob",
    nb_commentaires: 1,
  },
];

const MOCK_COMMENTAIRES: ForumCommentaire[] = [
  {
    id: 1, contenu: "Essaie le déficit calorique progressif, ça marche très bien !",
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    id_commentaires_parent: null, id_utilisateurs: 2, auteur_pseudo: "bob_sport",
  },
  {
    id: 2, contenu: "Je confirme, et associe ça avec de la marche rapide 30 min/jour.",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    id_commentaires_parent: 1, id_utilisateurs: 3, auteur_pseudo: "claire_yoga",
  },
];

export const forumService = {
  async getPublications(): Promise<ForumPublication[]> {
    return apiCall<ForumPublication[]>("/publications", {}, async () => MOCK_PUBLICATIONS);
  },

  async createPublication(
    libelle: string | null,
    contenu: string,
    id_utilisateurs: number,
  ): Promise<ForumPublication> {
    return apiCall<ForumPublication>(
      "/publications",
      { method: "POST", body: JSON.stringify({ libelle, contenu, id_utilisateurs }) },
      async () => ({
        id: Date.now(), libelle, contenu,
        created_at: new Date().toISOString(), updated_at: null,
        id_utilisateurs, auteur_pseudo: "moi", auteur_nom: "", auteur_prenom: "",
        nb_commentaires: 0,
      }),
    );
  },

  async deletePublication(id: number): Promise<void> {
    return apiCall<void>(`/publications/${id}`, { method: "DELETE" }, async () => undefined);
  },

  async getCommentaires(publicationId: number): Promise<ForumCommentaire[]> {
    return apiCall<ForumCommentaire[]>(
      `/publications/${publicationId}/commentaires`,
      {},
      async () => MOCK_COMMENTAIRES.filter((c) => c.id_commentaires_parent !== undefined),
    );
  },

  async createCommentaire(
    publicationId: number,
    contenu: string,
    id_utilisateurs: number,
    id_commentaires_parent: number | null = null,
  ): Promise<ForumCommentaire> {
    return apiCall<ForumCommentaire>(
      `/publications/${publicationId}/commentaires`,
      { method: "POST", body: JSON.stringify({ contenu, id_utilisateurs, id_commentaires_parent }) },
      async () => ({
        id: Date.now(), contenu,
        created_at: new Date().toISOString(),
        id_commentaires_parent, id_utilisateurs, auteur_pseudo: "moi",
      }),
    );
  },
};
