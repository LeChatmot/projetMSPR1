import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RegisterForm {
  nom: string;
  prenom: string;
  pseudo: string;
  email: string;
  date_of_birth: string;
  mot_de_passe: string;
  confirmation: string;
}

const EMPTY_FORM: RegisterForm = {
  nom: "", prenom: "", pseudo: "", email: "", date_of_birth: "", mot_de_passe: "", confirmation: "",
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateForm = (): string | null => {
    if (!form.nom.trim() || !form.prenom.trim() || !form.pseudo.trim() || !form.email.trim())
      return "Tous les champs sont requis.";
    if (form.mot_de_passe.length < 6)
      return "Le mot de passe doit faire au moins 6 caractères.";
    if (form.mot_de_passe !== form.confirmation)
      return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    setError(null);
    try {
      await register({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        pseudo: form.pseudo.trim(),
        email: form.email.trim().toLowerCase(),
        mot_de_passe: form.mot_de_passe,
        date_of_birth: form.date_of_birth || undefined,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création du compte.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Créer un compte</h1>
            <p className="text-slate-400 text-sm mt-1">Rejoignez Santé & Fit</p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
            {/* Ligne Prénom / Nom */}
            <div className="grid grid-cols-2 gap-3">
              {(["prenom", "nom"] as const).map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-slate-300 mb-1.5 capitalize">
                    {field === "prenom" ? "Prénom" : "Nom"}
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={form[field]}
                    onChange={updateField(field)}
                    placeholder={field === "prenom" ? "Jean" : "Dupont"}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pseudo" className="block text-sm font-medium text-slate-300 mb-1.5">Pseudo</label>
                <input
                  id="pseudo"
                  type="text"
                  value={form.pseudo}
                  onChange={updateField("pseudo")}
                  placeholder="jean_fit"
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Date de naissance
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={updateField("date_of_birth")}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="jean@exemple.com"
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="mot_de_passe" className="block text-sm font-medium text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <input
                id="mot_de_passe"
                type="password"
                value={form.mot_de_passe}
                onChange={updateField("mot_de_passe")}
                placeholder="6 caractères minimum"
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmation" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmation"
                type="password"
                value={form.confirmation}
                onChange={updateField("confirmation")}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-5">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
