import {
    faCalendarCheck,
    faCalendarPlus,
    faExchangeAlt,
    faIdCard,
    faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AccountInfoProps {
  user: {
    name: string;
    user_type: string;
    is_transactions_enabled: boolean;
    created_at: string;
    updated_at: string;
  };
  translations: any;
}

export function AccountInfo({ user, translations }: AccountInfoProps) {
  return (
    <div className="bg-neutral-900 rounded-lg shadow p-6">
      <div className="flex items-center pb-4 border-b border-neutral-700 mb-4">
        <h3 className="text-xl font-bold">
          {translations.userInfo.accountInfo.title}
        </h3>
      </div>

      <ul className="space-y-2">
        <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faUserTag}
              className="w-5 h-5 text-purple-400/80 group-hover:text-purple-300 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">
              {translations.userInfo.accountInfo.username}
            </span>
            <span className="text-neutral-100 font-semibold text-sm bg-neutral-700/40 px-3 py-1 rounded-md">
              {user.name}
            </span>
          </div>
        </li>

        <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faIdCard}
              className="w-5 h-5 text-blue-400/80 group-hover:text-blue-300 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">
              {translations.userInfo.accountInfo.userType}
            </span>
            <span className="text-neutral-100 font-semibold text-sm bg-neutral-700/40 px-3 py-1 rounded-md">
              {user.user_type === "user"
                ? translations.users.user
                : translations.users.admin}
            </span>
          </div>
        </li>

        <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faExchangeAlt}
              className="w-5 h-5 text-green-400/80 group-hover:text-green-300 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">
              {translations.userInfo.accountInfo.transactionStatus}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.is_transactions_enabled
                  ? "bg-green-400/20 text-green-400"
                  : "bg-red-400/20 text-red-400"
              }`}
            >
              {user.is_transactions_enabled
                ? translations.userInfo.status.active
                : translations.userInfo.status.inactive}
            </span>
          </div>
        </li>

        <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faCalendarPlus}
              className="w-5 h-5 text-amber-400/80 group-hover:text-amber-300 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">
              {translations.subscription.table.createdAt}
            </span>
            <span className="text-neutral-100 text-sm font-mono bg-neutral-700/40 px-3 py-1 rounded-md">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </li>

        <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="w-5 h-5 text-cyan-400/80 group-hover:text-cyan-300 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-300 font-medium">
              {translations.subscription.table.updatedAt}
            </span>
            <span className="text-neutral-100 text-sm font-mono bg-neutral-700/40 px-3 py-1 rounded-md">
              {new Date(user.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}