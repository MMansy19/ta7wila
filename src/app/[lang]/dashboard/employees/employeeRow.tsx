import { useTranslation } from "@/context/translation-context";
import { User } from './types';

interface EmployeeRowProps {
  user: User;
  isSubmitting: boolean;
  handleSubmit: (
    e: React.MouseEvent, 
    user: User, 
    newStatus: string
  ) => void;
  handleEditUser: (user: User) => void;
}

const EmployeeRow = ({
  user,
  isSubmitting,
  handleSubmit,
  handleEditUser
}: EmployeeRowProps) => {
  const translations = useTranslation();
  
  return (
    <tr>
      <td className="p-2">{user.id}</td>
      <td className="p-2">{user.name}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.mobile}</td>
      <td className="p-2">{user.status || "null"}</td>
      <td className="p-2">{user.createdAt}</td>
      <td className="p-2 gap-2 flex items-center justify-center">
        <button
          disabled={isSubmitting}
          onClick={(e) => 
            handleSubmit(
              e,
              user,
              user.status === "active" ? "inactive" : "active"
            )
          }
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-[12px] w-28"
        >
          {user.status === "active" ? translations.users.actions.deactivate : translations.users.actions.activate}
        </button>
        <button
          disabled={isSubmitting}
          onClick={() => handleEditUser(user)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-[12px] w-28"
        >
          {translations.stores.actions.update}
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;