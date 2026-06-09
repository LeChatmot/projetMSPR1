import { apiCall } from "./api";

interface BackendUser {
  id: number;
  nom: string;
  prenom: string;
  pseudo: string;
  email: string;
  role: string;
}

interface RegisterPayload {
  nom: string;
  prenom: string;
  pseudo: string;
  email: string;
  mot_de_passe: string;
}

function buildDemoUser(overrides: Partial<BackendUser> & Pick<BackendUser, "email">): BackendUser {
  return { id: 0, nom: "Demo", prenom: "Utilisateur", pseudo: "demo_user", role: "user", ...overrides };
}

export const authService = {
  async login(email: string, motDePasse: string): Promise<BackendUser> {
    try {
      return await apiCall<BackendUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });
    } catch (err) {
      // TypeError = backend injoignable (réseau coupé) → mode démo
      // On laisse remonter les erreurs HTTP (401, 500…) pour ne pas bypasser l'auth
      if (err instanceof TypeError) {
        console.warn("⚠️ Backend injoignable — connexion en mode démo");
        return buildDemoUser({ email });
      }
      throw err;
    }
  },

  async register(payload: RegisterPayload): Promise<BackendUser> {
    try {
      return await apiCall<BackendUser>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err instanceof TypeError) {
        console.warn("⚠️ Backend injoignable — inscription en mode démo");
        return buildDemoUser({
          email: payload.email,
          nom: payload.nom,
          prenom: payload.prenom,
          pseudo: payload.pseudo,
        });
      }
      throw err;
    }
  },

  async updateInfo(
    userId: number,
    payload: { nom: string; prenom: string; email: string },
  ): Promise<BackendUser> {
    return apiCall<BackendUser>(`/utilisateurs/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async updatePassword(
    userId: number,
    ancienMotDePasse: string,
    nouveauMotDePasse: string,
  ): Promise<void> {
    return apiCall<void>(`/utilisateurs/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify({ ancien_mot_de_passe: ancienMotDePasse, nouveau_mot_de_passe: nouveauMotDePasse }),
    });
  },
};

export type { BackendUser, RegisterPayload };
