import { apiCall } from "./api";

export interface ReferenceOption {
  id: number;
  name: string;
}

export interface SanteReferences {
  allergies: ReferenceOption[];
  disease_types: ReferenceOption[];
  genders: ReferenceOption[];
  activity_levels: ReferenceOption[];
}

export interface ProfilSanteData {
  profil: {
    date_of_birth: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    id_gender: number | null;
    id_activity_level: number | null;
    experience_level: number | null;
    objectif: string | null;
  };
  age: number | null;
  imc: number | null;
  imc_categorie: string | null;
  tdee_kcal: number | null;
  allergies: ReferenceOption[];
  pathologies: ReferenceOption[];
  blessures: { id_utilisateurs_blessures: number; zone: string; description: string | null }[];
}

export interface UpdateSantePayload {
  date_of_birth?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  id_gender?: number | null;
  id_activity_level?: number | null;
  experience_level?: number | null;
  objectif?: string | null;
  allergie_ids: number[];
  pathologie_ids: number[];
}

export const profileService = {
  async getProfilSante(userId: number): Promise<ProfilSanteData> {
    return apiCall<ProfilSanteData>(`/profile/${userId}`);
  },

  async updateProfilSante(userId: number, payload: UpdateSantePayload): Promise<void> {
    return apiCall<void>(`/profile/${userId}/sante`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async getSanteReferences(): Promise<SanteReferences> {
    return apiCall<SanteReferences>("/references/sante");
  },
};
