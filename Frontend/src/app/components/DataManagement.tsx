import { useState } from 'react';
import { Database, CheckCircle, Loader2, Download, RefreshCw } from 'lucide-react';
import { mockPatients } from '../data/mockData';

export function DataManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleETLImport = () => {
    setIsLoading(true);
    setShowSuccess(false);

    // Simulation de l'import ETL avec un délai de 3 secondes
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des Données</h1>
          <p className="text-gray-600">Administration et import des données patients</p>
        </div>

        {/* ETL Import Button - CRITIQUE */}
        <button
          onClick={handleETLImport}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Import en cours...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Lancer l'import ETL (Python)</span>
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-green-900">Données mises à jour avec succès</p>
            <p className="text-sm text-green-700">Les nouvelles données patients ont été importées et synchronisées.</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-gray-900">Dernière Synchronisation</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">5 Fév 2026</p>
          <p className="text-sm text-gray-600">09:45 AM</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-900">Données Importées</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">{mockPatients.length} patients</p>
          <p className="text-sm text-gray-600">Cette semaine</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-gray-900">Fréquence Sync</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">Quotidienne</p>
          <p className="text-sm text-gray-600">Automatique à 09:00</p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900">Derniers Patients Importés</h3>
          <p className="text-sm text-gray-600 mt-1">Liste des patients ajoutés récemment au système</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  ID Patient
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Âge
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Risque Maladie
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Recommandation Alimentaire
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date Import
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPatients.map((patient, index) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      {patient.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age} ans
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                      patient.gender === 'M' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-pink-50 text-pink-700'
                    }`}>
                      {patient.gender === 'M' ? 'Homme' : 'Femme'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {patient.riskDisease === 'None' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Aucun
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                        {patient.riskDisease}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                      {patient.dietRecommendation}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(patient.importDate).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage de <span className="text-gray-900">{mockPatients.length}</span> patients
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ETL Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="bg-blue-100 rounded-lg p-3 h-fit">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-blue-900 mb-2">À propos de l'import ETL</h3>
            <p className="text-sm text-blue-800 mb-3">
              Le processus ETL (Extract, Transform, Load) permet d'importer et de traiter les données depuis diverses sources 
              (fichiers CSV, bases de données, APIs externes). Les données sont nettoyées, transformées et chargées dans le système.
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Extract:</strong> Récupération des données brutes</li>
              <li>• <strong>Transform:</strong> Nettoyage et transformation des données</li>
              <li>• <strong>Load:</strong> Insertion dans la base de données</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
