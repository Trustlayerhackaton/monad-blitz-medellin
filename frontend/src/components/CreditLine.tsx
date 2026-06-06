"use client";

import { CreditCard, CheckCircle2, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

interface CreditLineProps {
  score: number;
  isDemoMode?: boolean;
}

export function CreditLine({ score, isDemoMode = false }: CreditLineProps) {
  const getCreditLimit = (score: number) => {
    if (score >= 950) return { limit: 10000000, rate: 1.5, approved: true };
    if (score >= 850) return { limit: 5000000, rate: 2.0, approved: true };
    if (score >= 750) return { limit: 3000000, rate: 2.5, approved: true };
    if (score >= 600) return { limit: 1500000, rate: 3.0, approved: true };
    return { limit: 0, rate: 0, approved: false };
  };

  const creditInfo = getCreditLimit(score);
  const monthlyPayment = creditInfo.approved
    ? Math.round((creditInfo.limit * creditInfo.rate) / 100 / 12)
    : 0;

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-md p-6 border-2 border-green-200">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Línea de Crédito Pre-Aprobada</h3>
      </div>

      {creditInfo.approved ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-green-100 rounded-lg border border-green-300">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Crédito Pre-Aprobado!</p>
              <p className="text-sm text-green-700">Basado en tu Payment Score de {score}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Límite Disponible</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ${creditInfo.limit.toLocaleString("es-CO")}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Tasa de Interés</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{creditInfo.rate}%</p>
              <p className="text-xs text-gray-500">Anual</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Cuota Mensual</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ${monthlyPayment.toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-gray-500">Estimada</p>
            </div>
          </div>

          <div className="pt-4 border-t border-green-200">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold">
              Solicitar Crédito Ahora
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Crédito No Disponible
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Tu Payment Score actual ({score}) no cumple con los requisitos mínimos.
          </p>
          <p className="text-xs text-gray-500">
            Mejora tu score a 600+ para acceder a créditos pre-aprobados.
          </p>
        </div>
      )}
    </div>
  );
}

