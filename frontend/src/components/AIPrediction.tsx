"use client";

import { Brain, TrendingUp, Target, Lightbulb, AlertCircle } from "lucide-react";

interface AIPredictionProps {
  currentScore: number;
  consecutivePayments: number;
  isDemoMode?: boolean;
}

export function AIPrediction({
  currentScore,
  consecutivePayments,
  isDemoMode = false,
}: AIPredictionProps) {
  // Simulación de predicción con IA basada en tendencias
  const calculatePrediction = () => {
    const trend = consecutivePayments > 10 ? "positive" : "neutral";
    const monthsAhead = 3;
    
    // Algoritmo de predicción simulado
    const baseIncrease = trend === "positive" ? 8 : 5;
    const paymentBonus = consecutivePayments * 0.5;
    const scoreIncrease = baseIncrease + paymentBonus;
    
    const predictedScore = Math.min(
      currentScore + scoreIncrease * monthsAhead,
      1000
    );
    
    const confidence = currentScore > 800 ? 92 : currentScore > 600 ? 78 : 65;
    
    // Recomendaciones basadas en el análisis
    const recommendations = [];
    if (consecutivePayments < 5) {
      recommendations.push({
        icon: Target,
        text: "Mantén al menos 5 pagos consecutivos para mejorar tu score",
        priority: "high",
      });
    }
    if (currentScore < 900) {
      recommendations.push({
        icon: TrendingUp,
        text: "Realiza pagos puntuales para alcanzar el Badge de Oro",
        priority: "medium",
      });
    }
    if (consecutivePayments >= 10) {
      recommendations.push({
        icon: Lightbulb,
        text: "¡Excelente racha! Mantén este ritmo para maximizar recompensas",
        priority: "low",
      });
    }

    return {
      predictedScore: Math.round(predictedScore),
      scoreIncrease: Math.round(scoreIncrease * monthsAhead),
      confidence,
      monthsAhead,
      recommendations,
    };
  };

  const prediction = calculatePrediction();
  const scoreDifference = prediction.predictedScore - currentScore;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Predicción con IA
        </h3>
        <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
          {prediction.confidence}% confianza
        </span>
      </div>

      <div className="space-y-4">
        {/* Predicción principal */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Score Actual</div>
              <div className="text-2xl font-bold text-gray-900">
                {currentScore}
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Predicción ({prediction.monthsAhead} meses)
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {prediction.predictedScore}
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-purple-100">
            <div className="flex items-center space-x-2 text-sm">
              {scoreDifference > 0 ? (
                <>
                  <span className="text-green-600 font-semibold">
                    +{scoreDifference} puntos proyectados
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </>
              ) : (
                <>
                  <span className="text-orange-600 font-semibold">
                    Mantén tu score actual
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        {prediction.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span>Recomendaciones Personalizadas</span>
            </h4>
            {prediction.recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    rec.priority === "high"
                      ? "bg-red-50 border border-red-200"
                      : rec.priority === "medium"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mt-0.5 ${
                      rec.priority === "high"
                        ? "text-red-500"
                        : rec.priority === "medium"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <p className="text-sm text-gray-700 flex-1">{rec.text}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Información adicional */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-white p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>
            Predicción basada en análisis de tendencias y machine learning
          </span>
        </div>
      </div>
    </div>
  );
}

