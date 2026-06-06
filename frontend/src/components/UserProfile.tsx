"use client";

import { User, Mail, Phone, MapPin, Calendar, CreditCard, TrendingUp, Award, FileText, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CreditHistory {
  id: string;
  date: Date;
  amount: number;
  status: "active" | "completed" | "cancelled";
  institution: string;
  type: string;
  paymentsMade: number;
  totalPayments: number;
}

interface UserProfileProps {
  address?: string;
  isDemoMode?: boolean;
}

export function UserProfile({ address, isDemoMode = false }: UserProfileProps) {
  // Datos mock para demo
  const demoProfile = {
    name: "Juan Carlos Pérez",
    email: "juan.perez@email.com",
    phone: "+57 300 123 4567",
    address: "Bogotá, Colombia",
    memberSince: new Date(2023, 0, 15),
    totalCredits: 3,
    activeCredits: 1,
    completedCredits: 2,
    totalPaid: 4500000,
    averageScore: 850,
  };

  const demoCreditHistory: CreditHistory[] = [
    {
      id: "1",
      date: new Date(2024, 9, 1),
      amount: 2000000,
      status: "active",
      institution: "Sistecrédito",
      type: "Consumo",
      paymentsMade: 5,
      totalPayments: 12,
    },
    {
      id: "2",
      date: new Date(2024, 2, 15),
      amount: 1500000,
      status: "completed",
      institution: "Sistecrédito",
      type: "Consumo",
      paymentsMade: 12,
      totalPayments: 12,
    },
    {
      id: "3",
      date: new Date(2023, 8, 10),
      amount: 1000000,
      status: "completed",
      institution: "Sistecrédito",
      type: "Consumo",
      paymentsMade: 12,
      totalPayments: 12,
    },
  ];

  const profile = isDemoMode ? demoProfile : null;
  const creditHistory = isDemoMode ? demoCreditHistory : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            Activo
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            Completado
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const getProgressPercentage = (paymentsMade: number, totalPayments: number) => {
    return (paymentsMade / totalPayments) * 100;
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Conecta tu wallet para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600">Miembro desde {format(profile.memberSince, "MMMM yyyy", { locale: es })}</p>
            </div>
          </div>
          {address && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Wallet</p>
              <p className="text-xs font-mono text-gray-700">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
            <Mail className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
            <Phone className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Teléfono</p>
              <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="text-sm font-semibold text-gray-900">{profile.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Miembro desde</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(profile.memberSince, "dd MMM yyyy", { locale: es })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Crediticio */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CreditCard className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Resumen Crediticio</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{profile.totalCredits}</div>
            <div className="text-xs text-gray-600 mt-1">Total Créditos</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{profile.activeCredits}</div>
            <div className="text-xs text-gray-600 mt-1">Activos</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{profile.completedCredits}</div>
            <div className="text-xs text-gray-600 mt-1">Completados</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              ${(profile.totalPaid / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Pagado</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">Score Promedio</span>
            </div>
            <div className="text-2xl font-bold text-indigo-600">{profile.averageScore}</div>
          </div>
        </div>
      </div>

      {/* Historial Crediticio */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Historial Crediticio</h3>
          </div>
          <span className="text-sm text-gray-500">{creditHistory.length} registros</span>
        </div>

        <div className="space-y-4">
          {creditHistory.length > 0 ? (
            creditHistory.map((credit) => (
              <div
                key={credit.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{credit.institution}</h4>
                        <p className="text-sm text-gray-600">{credit.type}</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(credit.date, "dd 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>${credit.amount.toLocaleString("es-CO")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(credit.status)}
                  </div>
                </div>

                {credit.status === "active" && (
                  <div className="ml-11 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progreso del Crédito</span>
                      <span className="text-sm text-gray-600">
                        {credit.paymentsMade} / {credit.totalPayments} pagos
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${getProgressPercentage(credit.paymentsMade, credit.totalPayments)}%` }}
                      >
                        {getProgressPercentage(credit.paymentsMade, credit.totalPayments) > 20 && (
                          <span className="text-xs font-bold text-white">
                            {Math.round(getProgressPercentage(credit.paymentsMade, credit.totalPayments))}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {credit.totalPayments - credit.paymentsMade} pagos restantes
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay historial crediticio disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

