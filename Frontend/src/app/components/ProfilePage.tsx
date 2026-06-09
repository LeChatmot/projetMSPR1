import { type FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

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
