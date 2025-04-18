import { useTranslation } from "@/context/translation-context";
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
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="text-start">
            <th className="p-2">{translations.paymentVerification.table.id}</th>
            <th className="p-2">{translations.paymentVerification.table.userName}</th>
            <th className="p-2">{translations.paymentVerification.table.paymentValue}</th>
            <th className="p-2">{translations.paymentVerification.table.paymentOption}</th>
            <th className="p-2">{translations.paymentVerification.table.date}</th>
            <th className="p-2">{translations.paymentVerification.table.state}</th>
            <th className="p-2">{translations.paymentVerification.table.actions}</th>
          </tr>
        </thead>
        <tbody>
          {paymentDatas.map((paymentData) => (
            <PaymentRow
              key={paymentData.id}
              paymentData={paymentData}
              paymentOptions={paymentOptions}
              onAction={onRowAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentRow({
  paymentData,
  paymentOptions,
  onAction,
}: {
  paymentData: PaymentData;
  paymentOptions: PaymentOption[];
  onAction: (paymentData: PaymentData) => void;
}) {
  const paymentOption = paymentOptions.find(
    (opt) => opt.key === paymentData.payment_option
  );

  return (
    <tr className="text-start border-b !border-white/10 py-2">
      <td className="p-2">{paymentData.id}</td>
      <td className="p-2">{paymentData.user.name}</td>
      <td className="p-2">{paymentData.value}</td>
      <td className="p-2 items-start px-4 flex ">
        {paymentOption ? (
          <Image
            width="34"
            height="34"
            loading="lazy"
            src={paymentOption.img}
            alt={paymentOption.name}
            className="object-contain self-center aspect-square w-[34px] "
          />
        ) : (
          "N/A"
        )}
      </td>
      <td className="p-2">{paymentData.created_at}</td>
      <td className="p-2">
        <StatusBadge status={paymentData.status} />
      </td>
      <td className="p-2 text-start">
        {paymentData.status !== "verified" ? (
          <ActionButton onClick={() => onAction(paymentData)} />
        ):
        (
          <span className="text-sm text-white/50 px-5">----</span>
        )
        }
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const translations = useTranslation();
  const statusStyles = {
    verified: "bg-[#53B4AB] bg-opacity-25 text-[#0FDBC8]",
    pending: "bg-[#F58C7B] bg-opacity-25 text-[#F58C7B]",
    default: "bg-red-500",
  };

  return (
    <span className={`px-2 rounded-[12px] text-sm ${statusStyles[status as keyof typeof statusStyles] || statusStyles.default}`}>
      {translations.paymentVerification.status[status as keyof typeof translations.paymentVerification.status] || status}
    </span>
  );
}

function ActionButton({ onClick }: { onClick: () => void }) {
  const translations = useTranslation();
  
  return (
    <button
      onClick={onClick}
      className="flex bg-[#53B4AB] text-black text-sm rounded-[12px] px-4 py-2 hover:bg-[#53B4AB] items-center"
    >
      {translations.paymentVerification.action.check}
    </button>
  );
}