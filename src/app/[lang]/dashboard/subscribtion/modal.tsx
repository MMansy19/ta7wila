import { useTranslation } from "@/context/translation-context";
import { SubscriptionModalProps } from "./types";

const SubscriptionModal = ({
  selectedSubscription,
  onClose,
}: SubscriptionModalProps) => {
  const translations = useTranslation();

  return (
    <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-neutral-900 rounded-xl p-6 shadow-lg mx-4 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between text-xl font-bold mb-4">
          <h2>{translations.subscription.modal.title}</h2>
          <button type="button" onClick={onClose} className="text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-4">
          <div className="bg-[#444444] p-6 rounded-lg space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className=" flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-auto"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="4"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 6.5V8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V17.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <div className="text-white text-2xl font-bold mb-1">
                  {selectedSubscription.amount} {translations.dashboard.cards.currency}
                </div>
                <div className="text-[#d5d5d5] text-sm">
                  {translations.subscription.modal.subscriptionAmount}
                </div>
              </div>
            </div>
            <hr />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#d5d5d5] text-sm">{translations.subscription.modal.status}</span>
                <span className="text-green-500 font-semibold text-sm">
                  {selectedSubscription.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#d5d5d5] text-sm">{translations.subscription.modal.paymentDate}</span>
                <span className="text-white text-sm">
                  {new Date(selectedSubscription.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#444444] p-4 rounded-lg">
            <div className="flex gap-6">
              <div>
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-500 text-white font-bold uppercase">
                  {selectedSubscription.user.name.charAt(0)}
                </div>
              </div>
              <div>
                <div className="text-white">
                  {selectedSubscription.user.name}
                </div>
                <div className="text-white text-sm">
                  {selectedSubscription.user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#444444] p-4 rounded-lg ">
            {[
              {
                label: translations.subscription.modal.counts.applications,
                value: `${selectedSubscription.applications_count}/${selectedSubscription.max_applications_count}`,
              },
              {
                label: translations.subscription.modal.counts.vendors,
                value: `${selectedSubscription.vendors_count}/${selectedSubscription.max_vendors_count}`,
              },
              {
                label: translations.subscription.modal.counts.employees,
                value: `${selectedSubscription.employees_count}/${selectedSubscription.max_employees_count}`,
              },
            ].map((item, index) => (
              <div key={index} className="flex justify-between space-y-2">
                <div className="text-[#d5d5d5] ">{item.label}</div>
                <div className="text-white">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#444444] p-4 rounded-lg">
            <div className="text-[#d5d5d5] text-sm uppercase">
              {translations.subscription.modal.subscriptionType}
            </div>
            <div className="text-white">
              # {selectedSubscription.subscription_type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
