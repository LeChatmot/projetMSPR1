import { useState, useCallback, useEffect } from "react";
import type { AuthUser, ForumCommentaire, ForumPublication } from "../types";
import { forumService } from "../services/forumService";

interface UseForumReturn {
  publications: ForumPublication[];
  selectedPublication: ForumPublication | null;
  commentaires: ForumCommentaire[];
  loading: boolean;
  error: string | null;
  selectPublication: (publication: ForumPublication) => Promise<void>;
  clearSelection: () => void;
  createPublication: (libelle: string | null, contenu: string) => Promise<void>;
  createCommentaire: (contenu: string, parentId?: number | null) => Promise<void>;
  deletePublication: (id: number) => Promise<void>;
}

function getBackendUserId(user: AuthUser | null): number {
  return user?.backendId ?? 0;
}

export function useForum(user: AuthUser | null): UseForumReturn {
  const [publications, setPublications] = useState<ForumPublication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<ForumPublication | null>(null);
  const [commentaires, setCommentaires] = useState<ForumCommentaire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumService.getPublications();
      setPublications(data);
    } catch (err) {
      setError("Impossible de charger les publications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPublications();
  }, [loadPublications]);

  const selectPublication = useCallback(async (publication: ForumPublication) => {
    setSelectedPublication(publication);
    setCommentaires([]);
    try {
      const data = await forumService.getCommentaires(publication.id);
      setCommentaires(data);
    } catch (loadError) {
      console.error("Erreur chargement commentaires :", loadError);
      setCommentaires([]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPublication(null);
    setCommentaires([]);
  }, []);

  const createPublication = useCallback(
    async (libelle: string | null, contenu: string) => {
      const userId = getBackendUserId(user);
      const created = await forumService.createPublication(libelle, contenu, userId);
      setPublications((prev) => [created, ...prev]);
    },
    [user],
  );

  const createCommentaire = useCallback(
    async (contenu: string, parentId: number | null = null) => {
      if (!selectedPublication) return;
      const userId = getBackendUserId(user);
      const created = await forumService.createCommentaire(
        selectedPublication.id, contenu, userId, parentId,
      );
      setCommentaires((prev) => [...prev, created]);
      setSelectedPublication((prev) =>
        prev ? { ...prev, nb_commentaires: prev.nb_commentaires + 1 } : prev,
      );
    },
    [selectedPublication, user],
  );

  const deletePublication = useCallback(
    async (id: number) => {
      await forumService.deletePublication(id);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      if (selectedPublication?.id === id) clearSelection();
    },
    [selectedPublication, clearSelection],
  );

  return {
    publications, selectedPublication, commentaires,
    loading, error,
    selectPublication, clearSelection,
    createPublication, createCommentaire, deletePublication,
  };
}
