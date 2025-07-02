"use client";

import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime } from "@/lib/utils";
import { Users, User, Mail, Phone, Calendar, Shield, Crown, UserCheck, Settings } from "lucide-react";
import { Params } from "./types";

type Employee = {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  role?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
};

type EmployeesProps = {
  employees?: Employee[];
  params: Params;
};

export default function Employees({ employees = [], params }: EmployeesProps) {
  const translations = useTranslation();

  const getRoleIcon = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'employee':
      case 'staff':
        return <UserCheck className="w-4 h-4 text-green-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'employee':
      case 'staff':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/60 backdrop-blur-sm rounded-2xl border border-white/10 p-4 lg:p-6 h-fit">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg lg:text-xl text-white">
            {translations.storeDetails?.employees?.title || "الموظفون"}
          </h3>
          <p className="text-white/60 text-sm">
            {employees.length} {employees.length === 1 ? 'موظف' : 'موظف'}
          </p>
        </div>
      </div>

      {/* Employees List */}
      <div className="space-y-3">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-neutral-700/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200 hover:bg-neutral-700/40"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    {getRoleIcon(employee.role)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm lg:text-base">
                      {employee.name}
                    </h4>
                    <p className="text-white/60 text-xs">
                      ID: {employee.id}
                    </p>
                  </div>
                </div>
                
                {/* Status and Role Badges */}
                <div className="flex flex-col gap-1">
                  {employee.role && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(employee.role)} text-center`}>
                      {employee.role}
                    </div>
                  )}
                  {employee.status && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)} text-center`}>
                      {employee.status === 'active' ? 'نشط' : employee.status === 'inactive' ? 'غير نشط' : employee.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                {employee.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm truncate">{employee.email}</span>
                  </div>
                )}
                
                {employee.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-white/80 text-sm" style={{ direction: "ltr" }}>
                      {employee.mobile}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-white/60 text-xs">
                    انضم في {formatDateTime(employee.created_at).date}
                  </span>
                </div>
              </div>

              {/* Employee Actions (if needed in the future) */}
              <div className="flex justify-end mt-3 pt-3 border-t border-white/5">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-white font-medium mb-2">
              لا يوجد موظفون
            </h4>
            <p className="text-white/60 text-sm">
              لم يتم إضافة أي موظفين لهذا المتجر بعد
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {employees.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">
              إجمالي الموظفين
            </span>
            <span className="text-white font-medium">
              {employees.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
