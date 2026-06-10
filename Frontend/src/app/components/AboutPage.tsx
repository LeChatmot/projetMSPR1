import { Github, QrCode } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Grégory Mutombo",
    role: "Frontend & PWA",
    description: "Interface React, design responsive, service worker et expérience utilisateur.",
    color: "#10b981",
  },
  {
    name: "Baptiste COL",
    role: "DevOps & CI/CD",
    description: "Pipeline Jenkins, SonarQube, containerisation Docker et infrastructure.",
    color: "#6366f1",
  },
  {
    name: "Maxime CHANEL",
    role: "Data Engineering",
    description: "Pipelines ETL Airflow, traitement des datasets et intégration BDD.",
    color: "#f59e0b",
  },
];

export function AboutPage() {
  const loginUrl = `${window.location.origin}/login`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(loginUrl)}&bgcolor=1e293b&color=f1f5f9&margin=10`;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">À propos & Démo</h1>
        <p className="text-slate-400 text-sm">Santé & Fit — Application PWA de suivi santé et fitness</p>
      </div>

      {/* QR Code */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-slate-100 font-semibold">Accès Mobile</h2>
            <p className="text-slate-400 text-sm">Scannez pour ouvrir l'application sur votre téléphone</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-3 rounded-xl shrink-0">
            <img
              src={qrCodeUrl}
              alt="QR Code connexion mobile"
              width={160}
              height={160}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <p className="text-slate-300 text-sm">
              Une fois sur l'application via Chrome mobile, appuyez sur{" "}
              <span className="text-emerald-400 font-medium">"Ajouter à l'écran d'accueil"</span>{" "}
              pour l'installer en mode standalone.
            </p>
            <div className="bg-slate-700/50 rounded-lg px-3 py-2 inline-block">
              <p className="text-xs text-slate-500 mb-0.5">URL de connexion</p>
              <p className="text-xs font-mono text-emerald-400 break-all">{loginUrl}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Équipe */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-indigo-500/10 p-2 rounded-lg">
            <Github className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-slate-100 font-semibold">Équipe projet</h2>
            <p className="text-slate-400 text-sm">MSPR — TPRE601 · 2025-2026</p>
          </div>
        </div>

        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: member.color }}
              >
                {member.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-slate-100 font-medium text-sm">{member.name}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: member.color }}>
                  {member.role}
                </p>
                <p className="text-xs text-slate-400">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack technique */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-slate-100 font-semibold mb-4">Stack technique</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "React 18", sublabel: "Frontend" },
            { label: "TypeScript", sublabel: "Typage" },
            { label: "Flask", sublabel: "Backend" },
            { label: "MySQL 8", sublabel: "Base de données" },
            { label: "Airflow", sublabel: "ETL / Pipelines" },
            { label: "Docker", sublabel: "Containerisation" },
            { label: "Jenkins", sublabel: "CI/CD" },
            { label: "SonarQube", sublabel: "Qualité code" },
            { label: "PWA", sublabel: "Mode standalone" },
          ].map((tech) => (
            <div key={tech.label} className="bg-slate-700/40 rounded-lg px-3 py-2.5">
              <p className="text-sm font-semibold text-slate-200">{tech.label}</p>
              <p className="text-xs text-slate-500">{tech.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
