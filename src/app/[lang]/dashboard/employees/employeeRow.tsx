import { useTranslation } from '@/hooks/useTranslation';
import { User } from "./types";

interface EmployeeRowProps {
  user: User;
  isSubmitting: boolean;
  handleSubmit: (e: React.MouseEvent, user: User, newStatus: string) => void;
  handleEditUser: (user: User) => void;
  rowIndex: number;
  isLastRow: boolean;
}

const EmployeeRow = ({
  user,
  isSubmitting,
  handleSubmit,
  handleEditUser,
  rowIndex,
  isLastRow,
}: EmployeeRowProps) => {
  const translations = useTranslation();

  return (
    <tr className={`group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1F1F1F] border-b border-white/5 hover:border-white/10 ${isLastRow ? 'last:rounded-b-xl' : ''}`}>
      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end">
          {user.id}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 rounded-full bg-[#53B4AB]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#53B4AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium text-white/90">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-medium text-blue-400">{user.email}</span>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F58C7B]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F58C7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="text-[#F58C7B] font-medium" style={{
            direction: "ltr",
            textAlign: "left",
            display: "inline-block",
          }}>
            {user.mobile}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex justify-end">
          {user.status === "active" ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 px-4 py-2 rounded-full border border-[#53B4AB]/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[#53B4AB]"></div>
              <span className="text-[#53B4AB] font-semibold text-xs">
                {user.status}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#F58C7B]/20 to-[#F58C7B]/10 px-4 py-2 rounded-full border border-[#F58C7B]/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[#F58C7B]"></div>
              <span className="text-[#F58C7B] font-semibold text-xs">
                {user.status || "inactive"}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-medium text-gray-300">{user.createdAt}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-right group-hover:text-white/90 transition-colors duration-200">
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={isSubmitting}
            onClick={(e) =>
              handleSubmit(
                e,
                user,
                user.status === "active" ? "inactive" : "active"
              )
            }
            className="px-3 py-1 bg-gradient-to-r from-[#F58C7B]/20 to-[#F58C7B]/10 text-[#F58C7B] hover:from-[#F58C7B]/30 hover:to-[#F58C7B]/20 rounded-lg text-xs font-semibold border border-[#F58C7B]/30 transition-all duration-200 disabled:opacity-50"
          >
            {user.status === "active"
              ? translations.users.actions.deactivate
              : translations.users.actions.activate}
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleEditUser(user)}
            className="px-3 py-1 bg-gradient-to-r from-[#53B4AB]/20 to-[#53B4AB]/10 text-[#53B4AB] hover:from-[#53B4AB]/30 hover:to-[#53B4AB]/20 rounded-lg text-xs font-semibold border border-[#53B4AB]/30 transition-all duration-200 disabled:opacity-50"
          >
            {translations.stores.actions.update}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeRow;
