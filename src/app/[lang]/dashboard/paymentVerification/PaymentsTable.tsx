import { useTranslation } from '@/hooks/useTranslation';
import Image from "next/image";
import { PaymentData, PaymentOption } from "./types";

export default function PaymentsTable({
  paymentDatas,
  paymentOptions,
  onRowAction,
}: {
  paymentDatas: PaymentData[];
  paymentOptions: PaymentOption[];
  onRowAction: (paymentData: PaymentData) => void;
}) {
  const translations = useTranslation();

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.id}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.userName}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.paymentValue}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.paymentOption}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.date}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.state}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white/90 tracking-wide">{translations.paymentVerification.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paymentDatas.length > 0 ? (
              paymentDatas.map((paymentData, index) => (
                <PaymentRow
                  key={paymentData.id}
                  paymentData={paymentData}
                  paymentOptions={paymentOptions}
                  onAction={onRowAction}
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-neutral-700/50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-neutral-400 text-lg font-medium">No payment data available</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentRow({
  paymentData,
  paymentOptions,
  onAction,
  index,
}: {
  paymentData: PaymentData;
  paymentOptions: PaymentOption[];
  onAction: (paymentData: PaymentData) => void;
  index: number;
}) {
  const paymentOption = paymentOptions.find(
    (opt) => opt.key === paymentData.payment_option
  );

  return (
    <tr className={`group hover:bg-white/5 transition-all duration-200 ${
      index % 2 === 0 ? 'bg-neutral-800/20' : 'bg-transparent'
    }`}>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-blue-400 font-bold text-sm">#{paymentData.id}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">{paymentData.user.name.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
              {paymentData.user.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-emerald-400">{paymentData.value}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {paymentOption ? (
            <div className="flex items-center space-x-3">
              <Image
                width="34"
                height="34"
                loading="lazy"
                src={paymentOption.img}
                alt={paymentOption.name}
                className="object-contain w-8 h-8 rounded-lg"
              />
              <span className="text-white/80 text-sm">{paymentOption.name}</span>
            </div>
          ) : (
            <span className="text-white/50">N/A</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-white text-sm">
            {new Date(paymentData.created_at).toLocaleDateString('ar-EG')}
          </span>
          <span className="text-xs text-amber-400 font-medium">
            {new Date(paymentData.created_at).toLocaleTimeString('ar-EG', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={paymentData.status} />
      </td>
      <td className="px-6 py-4 text-center">
        {paymentData.status !== "verified" ? (
          <ActionButton onClick={() => onAction(paymentData)} />
        ) : (
          <span className="text-sm text-white/50 px-5">----</span>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const translations = useTranslation();
  const statusStyles = {
    verified: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    default: "bg-red-500/20 text-red-300 border border-red-500/30",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.default}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${
        status === 'verified' ? 'bg-emerald-400' : 
        status === 'pending' ? 'bg-amber-400' : 'bg-red-400'
      }`}></span>
      {translations.paymentVerification.status[status as keyof typeof translations.paymentVerification.status] || status}
    </span>
  );
}

function ActionButton({ onClick }: { onClick: () => void }) {
  const translations = useTranslation();
  
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {translations.paymentVerification.action.check}
    </button>
  );
}