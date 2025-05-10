import {
  faCalendarAlt,
  faChartLine,
  faCoins,
  faCreditCard,
  faGem,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SubscriptionInfoProps {
  subscription: any;
  translations: any;
  formatCurrency: (amount: number) => string;
}

export function SubscriptionInfo({
  subscription,
  translations,
  formatCurrency,
}: SubscriptionInfoProps) {
  return (
    <div className="bg-neutral-900 rounded-lg shadow p-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-700 mb-4">
        <h3 className="text-xl font-bold">
          {translations.userInfo.subscriptionInfo.title}
        </h3>
       
      </div>

      {subscription ? (
        <ul className="space-y-2">
          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="w-5 h-5 text-purple-400/80 group-hover:text-purple-300 transition-colors"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 font-medium">
                {translations.userInfo.subscriptionInfo.plan}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-100 font-semibold text-sm">
                  {subscription.title}
                </span>
                <span className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded-md">
                  {subscription.subscription_type === "monthly"
                    ? translations.userInfo.subscriptionInfo.monthly
                    : translations.userInfo.subscriptionInfo.yearly}
                </span>
              </div>
            </div>
          </li>

          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faCoins}
                className="w-5 h-5 text-amber-400/80 group-hover:text-amber-300 transition-colors"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 font-medium">
                {translations.userInfo.subscriptionInfo.amount}
              </span>
              <span className="text-neutral-100 font-semibold text-sm bg-neutral-700/40 px-3 py-1 rounded-md">
                {formatCurrency(subscription.amount)}
              </span>
            </div>
          </li>

          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faShieldAlt}
                className="w-5 h-5 text-green-400/80 group-hover:text-green-300 transition-colors"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-300 font-medium">
                {translations.userInfo.subscriptionInfo.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  subscription.status === "active"
                    ? "bg-green-400/20 text-green-400"
                    : "bg-red-400/20 text-red-400"
                }`}
              >
                {subscription.status === "active"
                  ? translations.userInfo.status.active
                  : translations.userInfo.status.inactive}
              </span>
            </div>
          </li>

          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="w-5 h-5 text-blue-400/80 group-hover:text-blue-300 transition-colors"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-neutral-300 font-medium">
                  {translations.userInfo.subscriptionInfo.applicationsCount}
                </span>
                <span className="text-neutral-100 text-sm">
                  {subscription.applications_count} /{" "}
                  {subscription.max_applications_count}
                </span>
              </div>
            </div>
          </li>
          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="w-5 h-5 text-blue-400/80 group-hover:text-blue-300 transition-colors"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-neutral-300 font-medium">
                  {translations.userInfo.subscriptionInfo.vendorsCount}
                </span>
                <span className="text-neutral-100 text-sm">
                  {subscription.vendors_count} /{" "}
                  {subscription.max_vendors_count}
                </span>
              </div>
            </div>
          </li>
          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="w-5 h-5 text-blue-400/80 group-hover:text-blue-300 transition-colors"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-neutral-300 font-medium">
                  {translations.userInfo.subscriptionInfo.employeesCount}
                </span>
                <span className="text-neutral-100 text-sm">
                  {subscription.employees_count} /{" "}
                  {subscription.max_employees_count}
                </span>
              </div>
            </div>
          </li>

          <li className="group grid grid-cols-[24px,1fr] items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="w-5 h-5 text-cyan-400/80 group-hover:text-cyan-300 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 font-medium text-sm">
                  {translations.userInfo.subscriptionInfo.subscriptionDate}
                </span>
                <span className="text-neutral-100 text-sm font-mono">
                  {new Date(subscription.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 font-medium text-sm">
                  {translations.userInfo.subscriptionInfo.renewalDate}
                </span>
                <span className="text-neutral-100 text-sm font-mono">
                  {new Date(subscription.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </li>
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
          <div className="p-4 bg-neutral-800/50 rounded-full">
            <FontAwesomeIcon
              icon={faGem}
              className="w-12 h-12 text-purple-400 animate-pulse"
            />
          </div>
          <h4 className="text-lg font-semibold text-neutral-200">
            {translations.userInfo.subscriptionInfo.noSubscription.title}
          </h4>
          <p className="text-neutral-400 text-sm max-w-xs">
            {translations.userInfo.subscriptionInfo.noSubscription.description}
          </p>
       
        </div>
      )}
    </div>
  );
}
