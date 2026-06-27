import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { profileService, type ProfilSanteData, type SanteReferences, type UpdateSantePayload } from "../services/profileService";

const EXPERIENCE_OPTIONS = [
  { value: 1, label: "Débutant" },
  { value: 2, label: "Intermédiaire" },
  { value: 3, label: "Avancé" },
];

const OBJECTIF_OPTIONS = [
  { value: "perte_de_poids", label: "Perte de poids" },
  { value: "prise_de_masse", label: "Prise de masse" },
  { value: "maintien", label: "Maintien du poids" },
  { value: "endurance", label: "Améliorer l'endurance" },
  { value: "flexibilite", label: "Flexibilité et mobilité" },
];

interface SanteForm {
  date_of_birth: string;
  height_cm: string;
  weight_kg: string;
  id_gender: string;
  id_activity_level: string;
  experience_level: string;
  objectif: string;
  allergie_ids: number[];
  pathologie_ids: number[];
}

interface InfoForm {
  nom: string;
  prenom: string;
  email: string;
}

interface PasswordForm {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmation: string;
}

export function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();

  const [profilSante, setProfilSante] = useState<ProfilSanteData | null>(null);
  const [references, setReferences] = useState<SanteReferences | null>(null);
  const [santeForm, setSanteForm] = useState<SanteForm>({
    date_of_birth: "", height_cm: "", weight_kg: "", id_gender: "",
    id_activity_level: "", experience_level: "", objectif: "",
    allergie_ids: [], pathologie_ids: [],
  });
  const [santeLoading, setSanteLoading] = useState(false);
  const [santeSuccess, setSanteSuccess] = useState(false);
  const [santeError, setSanteError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      try {
        const [sante, refs] = await Promise.all([
          profileService.getProfilSante(user.backendId),
          profileService.getSanteReferences(),
        ]);
        setProfilSante(sante);
        setReferences(refs);
        setSanteForm({
          date_of_birth: sante.profil.date_of_birth ?? "",
          height_cm: sante.profil.height_cm?.toString() ?? "",
          weight_kg: sante.profil.weight_kg?.toString() ?? "",
          id_gender: sante.profil.id_gender?.toString() ?? "",
          id_activity_level: sante.profil.id_activity_level?.toString() ?? "",
          experience_level: sante.profil.experience_level?.toString() ?? "",
          objectif: sante.profil.objectif ?? "",
          allergie_ids: sante.allergies.map((a) => a.id),
          pathologie_ids: sante.pathologies.map((p) => p.id),
        });
      } catch {
        // silencieux si le backend est injoignable
      }
    })();
  }, [user]);

  const toggleCheckbox = (
    field: "allergie_ids" | "pathologie_ids",
    id: number,
  ) => {
    setSanteForm((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      };
    });
  };

  const handleSanteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSanteLoading(true);
    setSanteError(null);
    setSanteSuccess(false);
    try {
      const payload: UpdateSantePayload = {
        date_of_birth: santeForm.date_of_birth || null,
        height_cm: santeForm.height_cm ? Number.parseInt(santeForm.height_cm) : null,
        weight_kg: santeForm.weight_kg ? Number.parseFloat(santeForm.weight_kg) : null,
        id_gender: santeForm.id_gender ? Number.parseInt(santeForm.id_gender) : null,
        id_activity_level: santeForm.id_activity_level ? Number.parseInt(santeForm.id_activity_level) : null,
        experience_level: santeForm.experience_level ? Number.parseInt(santeForm.experience_level) : null,
        objectif: santeForm.objectif || null,
        allergie_ids: santeForm.allergie_ids,
        pathologie_ids: santeForm.pathologie_ids,
      };
      await profileService.updateProfilSante(user.backendId, payload);
      const updated = await profileService.getProfilSante(user.backendId);
      setProfilSante(updated);
      setSanteSuccess(true);
    } catch (err) {
      setSanteError(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setSanteLoading(false);
    }
  };

  const [infoForm, setInfoForm] = useState<InfoForm>({
    nom: user?.nom ?? "",
    prenom: user?.prenom ?? "",
    email: user?.email ?? "",
  });
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  const [pwdForm, setPwdForm] = useState<PasswordForm>({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmation: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const updateInfoField =
    (field: keyof InfoForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setInfoForm((prev) => ({ ...prev, [field]: e.target.value }));

  const updatePwdField =
    (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setPwdForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { nom, prenom, email } = infoForm;
    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setInfoError("Tous les champs sont requis.");
      return;
    }
    setInfoLoading(true);
    setInfoError(null);
    setInfoSuccess(false);
    try {
      await updateProfile(nom.trim(), prenom.trim(), email.trim().toLowerCase());
      setInfoSuccess(true);
    } catch (err) {
      setInfoError(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { ancienMotDePasse, nouveauMotDePasse, confirmation } = pwdForm;
    if (!ancienMotDePasse || !nouveauMotDePasse) {
      setPwdError("Tous les champs sont requis.");
      return;
    }
    if (nouveauMotDePasse.length < 6) {
      setPwdError("Le nouveau mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (nouveauMotDePasse !== confirmation) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(false);
    try {
      await updatePassword(ancienMotDePasse, nouveauMotDePasse);
      setPwdSuccess(true);
      setPwdForm({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmation: "" });
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : "Erreur lors du changement de mot de passe.");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Mon profil</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gérez vos informations personnelles et votre mot de passe
        </p>
      </div>

      {/* Avatar + pseudo */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ backgroundColor: user?.avatarColor ?? "#10b981" }}
        >
          {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-100">{user?.name}</p>
          <p className="text-sm text-emerald-400">@{user?.pseudo}</p>
          <p className="text-xs text-slate-500 mt-0.5">{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-4">Informations personnelles</h2>
        <form onSubmit={(e) => void handleInfoSubmit(e)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-prenom" className="block text-sm font-medium text-slate-300 mb-1.5">
                Prénom
              </label>
              <input
                id="profile-prenom"
                type="text"
                value={infoForm.prenom}
                onChange={updateInfoField("prenom")}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="profile-nom" className="block text-sm font-medium text-slate-300 mb-1.5">
                Nom
              </label>
              <input
                id="profile-nom"
                type="text"
                value={infoForm.nom}
                onChange={updateInfoField("nom")}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Adresse e-mail
            </label>
            <input
              id="profile-email"
              type="email"
              value={infoForm.email}
              onChange={updateInfoField("email")}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          {infoError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {infoError}
            </div>
          )}
          {infoSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl">
              Profil mis à jour avec succès.
            </div>
          )}

          <button
            type="submit"
            disabled={infoLoading}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            {infoLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>

      {/* Profil santé */}
      {profilSante && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-100">Profil santé</h2>

          {/* Cartes IMC / TDEE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">IMC</p>
              <p className="text-2xl font-bold text-emerald-400">{profilSante.imc ?? "—"}</p>
              <p className="text-xs text-slate-300 mt-1">{profilSante.imc_categorie ?? ""}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Besoins caloriques / jour</p>
              <p className="text-2xl font-bold text-emerald-400">
                {profilSante.tdee_kcal ? `${profilSante.tdee_kcal} kcal` : "—"}
              </p>
              <p className="text-xs text-slate-300 mt-1">TDEE estimé</p>
            </div>
          </div>

          {/* Formulaire santé */}
          <form onSubmit={(e) => void handleSanteSubmit(e)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date de naissance
                  {!!profilSante.age && (
                    <span className="ml-2 text-emerald-400 font-normal">({profilSante.age} ans)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={santeForm.date_of_birth}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSanteForm((p) => ({ ...p, date_of_birth: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Taille (cm)</label>
                <input
                  type="number" min={100} max={250}
                  value={santeForm.height_cm}
                  onChange={(e) => setSanteForm((p) => ({ ...p, height_cm: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Poids (kg)</label>
                <input
                  type="number" step="0.1" min={30} max={300}
                  value={santeForm.weight_kg}
                  onChange={(e) => setSanteForm((p) => ({ ...p, weight_kg: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Genre</label>
                <select
                  value={santeForm.id_gender}
                  onChange={(e) => setSanteForm((p) => ({ ...p, id_gender: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="">--</option>
                  {references?.genders.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Niveau d'activité</label>
                <select
                  value={santeForm.id_activity_level}
                  onChange={(e) => setSanteForm((p) => ({ ...p, id_activity_level: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="">--</option>
                  {references?.activity_levels.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Expérience</label>
                <select
                  value={santeForm.experience_level}
                  onChange={(e) => setSanteForm((p) => ({ ...p, experience_level: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="">--</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Objectif</label>
              <select
                value={santeForm.objectif}
                onChange={(e) => setSanteForm((p) => ({ ...p, objectif: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="">-- Sélectionner un objectif --</option>
                {OBJECTIF_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Allergies */}
            {references && references.allergies.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-300 mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {references.allergies.map((a) => (
                    <label key={a.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={santeForm.allergie_ids.includes(a.id)}
                        onChange={() => toggleCheckbox("allergie_ids", a.id)}
                        className="accent-emerald-500"
                      />
                      <span className="text-sm text-slate-300">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Pathologies */}
            {references && references.disease_types.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-300 mb-2">Pathologies / maladies</p>
                <div className="flex flex-wrap gap-2">
                  {references.disease_types.map((d) => (
                    <label key={d.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={santeForm.pathologie_ids.includes(d.id)}
                        onChange={() => toggleCheckbox("pathologie_ids", d.id)}
                        className="accent-emerald-500"
                      />
                      <span className="text-sm text-slate-300">{d.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {santeError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {santeError}
              </div>
            )}
            {santeSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl">
                Profil santé mis à jour. IMC et TDEE recalculés.
              </div>
            )}

            <button
              type="submit"
              disabled={santeLoading}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              {santeLoading ? "Enregistrement..." : "Mettre à jour le profil santé"}
            </button>
          </form>
        </div>
      )}

      {/* Changer le mot de passe */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-4">Changer le mot de passe</h2>
        <form onSubmit={(e) => void handlePasswordSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="pwd-ancien" className="block text-sm font-medium text-slate-300 mb-1.5">
              Mot de passe actuel
            </label>
            <input
              id="pwd-ancien"
              type="password"
              value={pwdForm.ancienMotDePasse}
              onChange={updatePwdField("ancienMotDePasse")}
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="pwd-nouveau" className="block text-sm font-medium text-slate-300 mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              id="pwd-nouveau"
              type="password"
              value={pwdForm.nouveauMotDePasse}
              onChange={updatePwdField("nouveauMotDePasse")}
              autoComplete="new-password"
              placeholder="6 caractères minimum"
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="pwd-confirmation" className="block text-sm font-medium text-slate-300 mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="pwd-confirmation"
              type="password"
              value={pwdForm.confirmation}
              onChange={updatePwdField("confirmation")}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          {pwdError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {pwdError}
            </div>
          )}
          {pwdSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-xl">
              Mot de passe mis à jour avec succès.
            </div>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-600/50 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            {pwdLoading ? "Mise à jour..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
