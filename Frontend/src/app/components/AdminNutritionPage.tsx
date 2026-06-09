import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useAdminNutrition } from "../hooks/useAdminNutrition";
import type { DietRecommendation, ReferenceData } from "../types";

// ─── Formulaire ajout / édition ───────────────────────────────────────────

interface RecommendationFormProps {
  initial: Partial<DietRecommendation> | null;
  refData: ReferenceData;
  onSave: (data: Partial<DietRecommendation>) => Promise<void>;
  onClose: () => void;
}

const NUMERIC_FIELDS: { key: keyof DietRecommendation; label: string; step?: string }[] = [
  { key: "age", label: "Âge" },
  { key: "height_cm", label: "Taille (cm)" },
  { key: "current_weight_kg", label: "Poids (kg)", step: "0.1" },
  { key: "bmi", label: "IMC", step: "0.01" },
  { key: "daily_caloric_target", label: "Calories/jour" },
  { key: "cholesterol_mg", label: "Cholestérol (mg)" },
  { key: "blood_pressure_mmhg", label: "Tension (mmHg)" },
  { key: "glucose_mg_dl", label: "Glycémie (mg/dL)" },
  { key: "weekly_exercise_hours", label: "Heures sport/sem.", step: "0.1" },
  { key: "adherence_to_diet_plan", label: "Adhérence (%)", step: "0.01" },
  { key: "dietary_nutrient_imbalance_score", label: "Score déséquilibre", step: "0.01" },
];

function RecommendationForm({ initial, refData, onSave, onClose }: Readonly<RecommendationFormProps>) {
  const [formValues, setFormValues] = useState<Partial<DietRecommendation>>(initial ?? {});
  const [saving, setSaving] = useState(false);

  const setField = (key: keyof DietRecommendation, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formValues);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const dropdowns: { key: keyof DietRecommendation; label: string; options: { id: number; name: string }[] }[] = [
    { key: "gender", label: "Genre", options: refData.genders },
    { key: "disease_type", label: "Maladie", options: refData.disease_types },
    { key: "severity", label: "Sévérité", options: refData.severity_types },
    { key: "diet_recommendation", label: "Régime recommandé", options: refData.diet_types },
    { key: "activity_level", label: "Niveau d'activité", options: refData.activity_levels },
    { key: "dietary_restrictions", label: "Restrictions alimentaires", options: refData.dietary_restrictions },
    { key: "allergy", label: "Allergie", options: refData.allergies },
    { key: "preferred_cuisine", label: "Cuisine préférée", options: refData.cuisine_types },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Fermer" />
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-100">
            {initial ? `Modifier — #${initial.id}` : "Nouvelle recommandation"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-6">
          {/* Champs numériques */}
          <div>
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Données métriques</h3>
            <div className="grid grid-cols-2 gap-3">
              {NUMERIC_FIELDS.map(({ key, label, step }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <input
                    type="number"
                    step={step ?? "1"}
                    value={(formValues[key] as number | undefined) ?? ""}
                    onChange={(e) => setField(key, Number.parseFloat(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Listes déroulantes */}
          <div>
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Catégories</h3>
            <div className="grid grid-cols-2 gap-3">
              {dropdowns.map(({ key, label, options }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <select
                    value={(formValues[key] as number | undefined) ?? ""}
                    onChange={(e) => setField(key, Number.parseInt(e.target.value, 10))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">— Choisir —</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
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

// ─── Page principale ───────────────────────────────────────────────────────

export function AdminNutritionPage() {
  const {
    recommendations, total, page, totalPages, loading, error, refData,
    setPage, createRecommendation, updateRecommendation, deleteRecommendation,
  } = useAdminNutrition();

  const [editingRec, setEditingRec] = useState<Partial<DietRecommendation> | null | undefined>(undefined);

  const handleSave = async (formData: Partial<DietRecommendation>) => {
    if (editingRec?.id === undefined) {
      await createRecommendation(formData);
    } else {
      await updateRecommendation(editingRec.id, formData);
    }
  };

  if (loading && recommendations.length === 0) {
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
      {editingRec !== undefined && refData && (
        <RecommendationForm
          initial={editingRec}
          refData={refData}
          onSave={handleSave}
          onClose={() => setEditingRec(undefined)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Recommandations Nutritionnelles</h1>
          <p className="text-slate-400 text-sm">{total} enregistrements · accès administrateur</p>
        </div>
        <button
          type="button"
          onClick={() => setEditingRec(null)}
          disabled={!refData}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/50">
                {["ID", "Âge", "Genre", "Maladie", "Régime", "Allergie", "IMC", "Actions"].map((col) => (
                  <th key={col} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recommendations.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-400">{rec.id}</td>
                  <td className="py-3 px-4 text-sm text-slate-200">{rec.age}</td>
                  <td className="py-3 px-4 text-sm text-slate-200">{rec.gender_name ?? rec.gender}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
                      {rec.disease_name ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {rec.diet_name ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">{rec.allergy_name ?? "Aucune"}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-200">{rec.bmi}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingRec(rec)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { void deleteRecommendation(rec.id); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </div>
  );
}
