import { User } from './types';
import EmployeeRow from './employeeRow';
import { useTranslation } from '@/hooks/useTranslation';

interface EmployeeTableProps {
  users: User[];
  isSubmitting: boolean;
  handleSubmit: (
    e: React.MouseEvent,
    user: User,
    newStatus: string
  ) => void;
  handleEditUser: (user: User) => void;
}

const EmployeeTable = ({
  users,
  isSubmitting,
  handleSubmit,
  handleEditUser
}: EmployeeTableProps) => {
  const translations = useTranslation();
  const headers = [
    translations.table.id,
    translations.auth.name,
    translations.auth.email,
    translations.auth.mobile,
    translations.users.table.status,
    translations.users.table.createdAt,
    translations.users.table.actions
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm">
              {[
                { text: translations.table.id, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> },
                { text: translations.auth.name, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
                { text: translations.auth.email, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { text: translations.auth.mobile, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                { text: translations.users.table.status, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { text: translations.users.table.createdAt, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                { text: translations.users.table.actions, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg> }
              ].map((header, index) => (
                <th key={header.text} className={`px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 ${index === 0 ? 'first:rounded-tl-xl' : ''} ${index === 6 ? 'last:rounded-tr-xl' : ''}`}>
                  <div className="flex items-center justify-end gap-2 min-h-[24px]">
                    <span className="text-[#53B4AB] opacity-80">{header.icon}</span>
                    <span>{header.text}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length > 0 ? (
              users.map((user: User, index) => (
                <EmployeeRow
                  key={user.id}
                  user={user}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  handleEditUser={handleEditUser}
                  rowIndex={index}
                  isLastRow={index === users.length - 1}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-white/60">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{translations.employees.noData}.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;