import { Activity, ChevronLeft, ChevronRight, TrendingDown, Users, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdminPatients } from "../hooks/useAdminPatients";
import { useUserProfile } from "../hooks/useUserProfile";
import type { DietRecommendation } from "../types";

function getBmiColor(bmi: number): string {
  if (bmi < 18.5) return "text-blue-400";
  if (bmi < 25) return "text-emerald-400";
  if (bmi < 30) return "text-orange-400";
  return "text-red-400";
}

// ─── Vue personnelle (utilisateur classique) ───────────────────────────────

function PersonalProfilePage() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user);

  const bmiColor = getBmiColor(profile.bmi);

  const rows = [
    { label: "Âge", value: `${profile.age} ans` },
    { label: "Taille", value: `${profile.heightCm} cm` },
    { label: "Poids actuel", value: `${profile.weightKg} kg` },
    { label: "IMC", value: profile.bmi.toString(), valueClass: bmiColor },
    { label: "Niveau d'activité", value: profile.activityLevel },
    { label: "Plan nutritionnel", value: profile.dietPlan },
    { label: "Allergie / Restriction", value: "Aucune" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Mon Profil Santé</h1>
        <p className="text-slate-400 text-sm">Vos informations personnelles de santé</p>
      </div>

      {/* En-tête profil */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ backgroundColor: user?.avatarColor ?? "#10b981" }}
        >
          {user?.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Utilisateur
          </span>
        </div>
      </div>

      {/* Données santé */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-100 font-semibold mb-4">Données de santé</h3>
        <div className="divide-y divide-slate-700">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-400">{row.label}</span>
              <span className={`text-sm font-medium ${row.valueClass ?? "text-slate-200"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risque */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-100 font-semibold mb-3">Risque détecté</h3>
        {profile.riskDisease === "None" ? (
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="text-emerald-400 text-xl">✓</span>
            <p className="text-emerald-400 text-sm font-medium">Aucun risque détecté — continuez ainsi !</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <span className="text-orange-400 text-xl">⚠</span>
            <p className="text-orange-400 text-sm font-medium">
              Risque détecté : <strong>{profile.riskDisease}</strong> — consultez votre médecin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal détail patient ──────────────────────────────────────────────────

interface PatientDetailModalProps {
  patient: DietRecommendation;
  onClose: () => void;
}

function PatientDetailModal({ patient, onClose }: Readonly<PatientDetailModalProps>) {
  const bmiColor = getBmiColor(patient.bmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Fermer"
      />
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-100">Dossier patient #{patient.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Identité */}
          <section>
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Identité</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Âge" value={`${patient.age} ans`} />
              <DetailRow label="Genre" value={patient.gender_name ?? String(patient.gender)} />
              <DetailRow label="Taille" value={`${patient.height_cm} cm`} />
              <DetailRow label="Poids" value={`${patient.current_weight_kg} kg`} />
              <DetailRow label="IMC" value={String(patient.bmi)} valueClass={bmiColor} />
            </div>
          </section>

          {/* Santé */}
          <section>
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Bilan santé</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Maladie" value={patient.disease_name ?? "—"} />
              <DetailRow label="Sévérité" value={patient.severity_name ?? "—"} />
              <DetailRow label="Cholestérol" value={`${patient.cholesterol_mg} mg`} />
              <DetailRow label="Glycémie" value={`${patient.glucose_mg_dl} mg/dL`} />
              <DetailRow label="Tension" value={`${patient.blood_pressure_mmhg} mmHg`} />
            </div>
          </section>

          {/* Nutrition */}
          <section>
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">Nutrition & activité</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Régime" value={patient.diet_name ?? "—"} />
              <DetailRow label="Calories/jour" value={`${patient.daily_caloric_target} kcal`} />
              <DetailRow label="Allergie" value={patient.allergy_name ?? "—"} />
              <DetailRow label="Activité" value={patient.activity_name ?? "—"} />
              <DetailRow label="Heures sport/sem." value={`${patient.weekly_exercise_hours}h`} />
              <DetailRow label="Adhérence plan" value={`${patient.adherence_to_diet_plan}%`} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueClass }: Readonly<{ label: string; value: string; valueClass?: string }>) {
  return (
    <div className="bg-slate-700/40 rounded-lg px-3 py-2">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-medium ${valueClass ?? "text-slate-200"}`}>{value}</p>
    </div>
  );
}

// ─── Contrôles de pagination ───────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, total, onPageChange }: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-sm text-slate-400">
        {total} enregistrement{total > 1 ? "s" : ""} · Page {page}/{totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-emerald-500 text-white"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Vue globale (admin) ───────────────────────────────────────────────────

function AdminPatientsPage() {
  const { patients, total, page, totalPages, loading, error, setPage } = useAdminPatients();
  const [selectedPatient, setSelectedPatient] = useState<DietRecommendation | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedPatient && (
        <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Gestion des Patients</h1>
        <p className="text-slate-400 text-sm">
          {total} patients dans la base · accès administrateur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Total Patients</p>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{total}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Page actuelle</p>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{page} / {totalPages}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Affichés</p>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">{patients.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => setSelectedPatient(patient)}
            className="text-left bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-100 text-sm">Patient #{patient.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {patient.age} ans · {patient.gender_name ?? (patient.gender === 1 ? "Homme" : "Femme")}
                </p>
              </div>
              <span className={`text-sm font-bold ${getBmiColor(patient.bmi)}`}>
                IMC {patient.bmi}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Maladie</span>
                <span className="text-xs font-medium text-orange-400 truncate max-w-[55%] text-right">
                  {patient.disease_name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Régime</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 truncate max-w-[55%]">
                  {patient.diet_name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Allergie</span>
                <span className="text-xs text-slate-300">{patient.allergy_name ?? "—"}</span>
              </div>
            </div>

            <p className="text-xs text-emerald-500 mt-3 text-right">Voir le dossier →</p>
          </button>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}

// ─── Point d'entrée ────────────────────────────────────────────────────────

export function PatientsPage() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminPatientsPage /> : <PersonalProfilePage />;
}
