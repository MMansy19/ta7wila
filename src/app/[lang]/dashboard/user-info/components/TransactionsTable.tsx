import Image from "next/image";

interface TransactionsTableProps {
  transactions: {
    data: any[];
  };
  translations: any;
  formatCurrency: (amount: number) => string;
  defaultPaymentOptions: Array<{
    name: string;
    key: string;
    img: string;
  }>;
}

export function TransactionsTable({
  transactions,
  translations,
  formatCurrency,
  defaultPaymentOptions,
}: TransactionsTableProps) {
  return (
    <div className="grid bg-neutral-900 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">
        {translations.userInfo.transactions.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">
                {translations.userInfo.transactions.transactionId}
              </th>
              <th className="px-4 py-2">{translations.userInfo.transactions.refId}</th>
              <th className="px-4 py-2">{translations.userInfo.transactions.amount}</th>
              <th className="px-4 py-2">
                {translations.userInfo.transactions.netAmount}
              </th>
              <th className="px-4 py-2">{translations.userInfo.transactions.fees}</th>
              <th className="px-4 py-2">{translations.userInfo.transactions.status}</th>
              <th className="px-4 py-2">
                {translations.userInfo.transactions.paymentMethod}
              </th>
              <th className="px-4 py-2">
                {translations.userInfo.transactions.senderName}
              </th>
              <th className="px-4 py-2">
                {translations.userInfo.transactions.transactionDate}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.data.map((transaction) => (
              <tr key={transaction.id} className="border-b border-white/10">
                <td className="px-4 py-2">{transaction.transaction_id || "#"}</td>
                <td className="px-4 py-2">{transaction.ref_id} </td>
                <td className="px-4 py-2">{formatCurrency(transaction.amount)} </td>
                <td className="px-4 py-2">
                  {formatCurrency(transaction.amount_exclude_fees)}
                </td>
                <td className="px-4 py-2">
                  {formatCurrency(transaction.total_fees)}{" "}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "completed"
                        ? "bg-[#53B4AB] bg-opacity-20 text-[#53B4AB]"
                        : "bg-[#F58C7B] bg-opacity-20 text-[#F58C7B]"
                    }`}
                  >
                    {transaction.status === "completed"
                      ? translations.userInfo.transactions.completed
                      : transaction.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  {(() => {
                    const paymentOption = defaultPaymentOptions.find(
                      (opt) => opt.key === transaction.payment_option.toLowerCase()
                    );
                    return paymentOption ? (
                      <Image
                        src={paymentOption.img}
                        width={24}
                        height={24}
                        alt={transaction.payment_option}
                        className="w-6 h-6 object-contain"
                      />
                    ) : null;
                  })()}
                  <span>{transaction.payment_option}</span>
                </td>
                <td className="px-4 py-2">
                  {transaction.sender_name ||
                    translations.userInfo.transactions.notAvailable}
                </td>
                <td className="px-4 py-2">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}