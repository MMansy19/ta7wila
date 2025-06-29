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
    <div className="overflow-x-auto">
      <table className="w-full text-center">
        <thead>
          <tr className="bg-gray-800">
            {[translations.table.id,  translations.auth.name, translations.auth.email, translations.auth.mobile, translations.users.table.status,  translations.users.table.createdAt, translations.users.table.actions].map((header) => (
              <th key={header} className="p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user: User) => (
              <EmployeeRow
                key={user.id}
                user={user}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                handleEditUser={handleEditUser}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                {translations.employees.noData}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;