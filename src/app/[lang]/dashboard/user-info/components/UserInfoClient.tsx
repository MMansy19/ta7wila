"use client";

import { useTranslation } from "@/context/translation-context";
import { AccountInfo } from "./AccountInfo";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { TransactionsTable } from "./TransactionsTable";
import { UserStatusInfo } from "./UserStatusInfo";

interface UserInfoClientProps {
  user: any;
  subscription: any;
  transactions: {
    data: any[];
  };
}

export function UserInfoClient({ user, subscription, transactions }: UserInfoClientProps) {
  const translations = useTranslation();

  const defaultPaymentOptions = [
    {
      name: "E-cash",
      key: "ecash",
      img: "/ecash.svg",
    },
    {
      name: "O-cash",
      key: "ocash",
      img: "/ocash.svg",
    },
    {
      name: "V-cash",
      key: "vcash",
      img: "/vcash.svg",
    },
    {
      name: "We-cash",
      key: "wecash",
      img: "/wecash.svg",
    },
    {
      name: "Instapay",
      key: "instapay",
      img: "/instapay.svg",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <UserStatusInfo user={user} translations={translations} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountInfo user={user} translations={translations} />
        <SubscriptionInfo 
          subscription={subscription} 
          translations={translations} 
          formatCurrency={formatCurrency}
        />
      </div>

      <TransactionsTable 
        transactions={transactions}
        translations={translations}
        formatCurrency={formatCurrency}
        defaultPaymentOptions={defaultPaymentOptions}
      />
    </div>
  );
}