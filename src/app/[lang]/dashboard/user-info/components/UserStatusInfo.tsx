import axios from "axios";
import { Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import getAuthHeaders from "../../Shared/getAuth";

interface UserStatusInfoProps {
  user: {
    is_transactions_enabled: boolean;
    id: string;
  };
  translations: any;
  onStatusChange?: (newStatus: boolean) => void;
}

export function UserStatusInfo({ user, translations, onStatusChange }: UserStatusInfoProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(user.is_transactions_enabled);

  const handleStatusUpdate = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${apiUrl}/transactions/user/is-enabled`, {
        user_id: user.id,
      },
      {
        headers: getAuthHeaders(),
      });
      
      const newStatus = !isEnabled;
      setIsEnabled(newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 bg-neutral-900 rounded-xl p-6">
      <div className={`h-4 w-4 ${isEnabled ? "text-[#53B4AB] animate-pulse" : "text-gray-400"}`}>
        {isEnabled ? <Wifi /> : <WifiOff />}
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        {isEnabled ? (
          <>
           <span className="text-[#53B4AB] font-semibold text-sm">
              {translations.userInfo.connection.enabled}
            </span>
          <span className="text-gray-400 text-sm">
            {translations.userInfo.connection.enabledDesc}
          </span>
          </>
        ) : (
          <>
            <span className="text-red-400 font-semibold text-sm">
              {translations.userInfo.connection.disabled}
            </span>
            <span className="text-gray-400 text-sm">
              {translations.userInfo.connection.disabledDesc}
            </span>
          </>
        )}
      </div>
      <button
        onClick={handleStatusUpdate}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg transition-colors text-sm  ${
          isEnabled
            ? "bg-[#F58C7B] bg-opacity-20 text-[#F58C7B]"
            : "bg-[#53B4AB] bg-opacity-20 text-[#53B4AB]"
        }  font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          translations.userInfo.connection.loading
        ) : isEnabled ? (
          translations.userInfo.connection.disable
        ) : (
          translations.userInfo.connection.enable
        )}
      </button>
    </div>
  );
}