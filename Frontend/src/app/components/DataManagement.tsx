import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Download,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface DataSource {
  id: string;
  name: string;
  type: "patients" | "nutrition" | "sport";
  status: "pending" | "processing" | "completed" | "error";
  records: number;
  lastSync: string;
}

export function DataManagement() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Patients Data",
      type: "patients",
      status: "completed",
      records: 1250,
      lastSync: "2026-02-04 14:30",
    },
    {
      id: "2",
      name: "Nutrition Data",
      type: "nutrition",
      status: "completed",
      records: 850,
      lastSync: "2026-02-04 12:15",
    },
    {
      id: "3",
      name: "Sport Sessions",
      type: "sport",
      status: "completed",
      records: 3420,
      lastSync: "2026-02-04 16:45",
    },
  ]);

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: DataSource["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Gestion des Données ETL</h1>
        <p className="text-gray-600">
          Import, export et synchronisation des données
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200">
          <Upload className="w-4 h-4" />
          Importer des données
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <Download className="w-4 h-4" />
          Exporter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <RefreshCw className="w-4 h-4" />
          Tout synchroniser
        </button>
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold">
                Sources de données
              </h3>
              <p className="text-sm text-gray-600">Statut des imports ETL</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {dataSources.map((source) => (
            <div
              key={source.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(source.status)}
                <div>
                  <h4 className="text-gray-900 font-medium">{source.name}</h4>
                  <p className="text-sm text-gray-600">
                    {source.records.toLocaleString()} enregistrements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(source.status)}`}
                >
                  {source.status === "completed"
                    ? "Terminé"
                    : source.status === "error"
                      ? "Erreur"
                      : source.status === "processing"
                        ? "En cours"
                        : "En attente"}
                </span>
                <span className="text-sm text-gray-500">
                  Dernière sync: {source.lastSync}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg hover:scale-110 transition-transform">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ETL History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 font-semibold mb-4">
          Historique des opérations
        </h3>
        <div className="space-y-3">
          {[
            {
              time: "16:45",
              action: "Synchronisation Sport",
              status: "success",
              records: 150,
            },
            {
              time: "14:30",
              action: "Synchronisation Patients",
              status: "success",
              records: 45,
            },
            {
              time: "12:15",
              action: "Synchronisation Nutrition",
              status: "success",
              records: 89,
            },
            {
              time: "10:00",
              action: "Nettoyage des données",
              status: "success",
              records: 12,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{item.time}</span>
                <span className="text-gray-900">{item.action}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {item.records} enregistrements
                </span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
