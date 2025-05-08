"use client";
import { useTranslation } from "@/context/translation-context";
import {
  faCalendarCheck,
  faCalendarPlus,
  faCreditCard,
  faEnvelope,
  faExchangeAlt,
  faIdCard,
  faPhone,
  faUserTag,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import getAuthHeaders from "../../Shared/getAuth";
import { UserData } from "../types";

type PaymentOption = {
  name: string;
  key: string;
  img: string;
};

export default function UserInfoClient({ id }: { id: string }) {
  const translations = useTranslation();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultPaymentOptions: PaymentOption[] = [
    { name: "VF- CASH", key: "vcash", img: "/vcash.svg" },
    { name: "Et- CASH", key: "ecash", img: "/ecash.svg" },
    { name: "WE- CASH", key: "wecash", img: "/wecash.svg" },
    { name: "OR- CASH", key: "ocash", img: "/ocash.svg" },
    { name: "INSTAPAY", key: "instapay", img: "/instapay.svg" },
  ];

  async function fetchUserInfo() {
    const response = await axios.get(`${apiUrl}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.result || {};
  }

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserData, Error>({
    queryKey: ["user-info", id],
    queryFn: fetchUserInfo,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user information</div>;
  if (!user) return <div>No data found</div>;

  return (
    <div className="container mx-auto p-2 space-y-6 text-white">
      <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 ">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent">
              {user.user.name}
            </h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center  space-x-2 ${
                user.user.status === "active"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {user.user.status === "active" && (
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
              <span>
                {user.user.status === "active"
                  ? translations.userInfo.status.active
                  : translations.userInfo.status.inactive}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {user.user.user_type === "user"
                ? translations.users.status.active
                : translations.auth.userName}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-gray-300">
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mx-2" />
              <span>{user.user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mx-2" />
              <span>{user.user.mobile}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-neutral-900 rounded-xl p-6 ">
        <FontAwesomeIcon icon={faWifi} className="w-6 h-6 text-gray-400" />
        {user.user.is_transactions_enabled === true ? (
          <div className="gap-2">
            <span className="text-green-400 font-semibold">
              {translations.userInfo.connection.enabled}
            </span>
            <span className="text-gray-400 text-sm">
              {translations.userInfo.connection.enabledDesc}
            </span>
          </div>
        ) : (
          <div className="gap-2">
            <span className="text-red-400 font-semibold">
              {translations.userInfo.connection.disabled}
            </span>
            <span className="text-gray-400 text-sm">
              {translations.userInfo.connection.disabledDesc}
            </span>
          </div>
        )}
      </div>

      {/* Subscription & Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-neutral-900 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-user-circle text-neutral-400 mr-2"></i>
            {translations.userInfo.accountInfo.title}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faUserTag} className="w-4 h-4 mx-2" />
              <span className="flex-1">
                {translations.userInfo.accountInfo.username}
                <span className="ml-2 text-neutral-300">{user.user.name}</span>
              </span>
            </li>

            <li className="flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 mx-2" />
              <span className="flex-1">
                {translations.userInfo.accountInfo.userType}
                <span className="ml-2 text-neutral-300">
                  {user.user.user_type === "user"
                    ? translations.users.status.active
                    : translations.auth.userName}
                </span>
              </span>
            </li>

            <li className="flex items-center">
              <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4 mx-2" />
              <span className="flex-1">
                {translations.userInfo.accountInfo.transactionStatus}
                <span
                  className={`ml-2 ${user.user.is_transactions_enabled ? "text-green-400" : "text-red-400"}`}
                >
                  {user.user.is_transactions_enabled
                    ? translations.userInfo.status.active
                    : translations.userInfo.status.inactive}
                </span>
              </span>
            </li>

            <li className="flex items-center">
              <FontAwesomeIcon icon={faCalendarPlus} className="w-4 h-4 mx-2" />
              <span className="flex-1">
                {translations.invoice.date}:
                <span className="ml-2 text-neutral-300">
                  {new Date(user.user.created_at).toLocaleString()}
                </span>
              </span>
            </li>

            <li className="flex items-center">
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="w-4 h-4 mx-2"
              />
              <span className="flex-1">
                {translations.subscription.table.updatedAt}:
                <span className="ml-2 text-neutral-300">
                  {new Date(user.user.updated_at).toLocaleString()}
                </span>
              </span>
            </li>
          </ul>
        </div>
        {/* Subscription Info */}
        <div className="bg-neutral-900 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
            {translations.userInfo.subscriptionInfo.title}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              {translations.userInfo.subscriptionInfo.plan}:{" "}
              {user.subscription?.title}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.description}:{" "}
              {user.subscription?.subtitle}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.amount}:{" "}
              {user.subscription?.amount} ج.م
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.type}:{" "}
              {user.subscription?.subscription_type === "monthly"
                ? translations.userInfo.subscriptionInfo.monthly
                : translations.userInfo.subscriptionInfo.yearly}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.status}:{" "}
              <span className="text-green-500">
                {user.subscription?.status === "active"
                  ? translations.userInfo.status.active
                  : translations.userInfo.status.inactive}
              </span>
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.applicationsCount}:{" "}
              {user.subscription?.applications_count} /{" "}
              {user.subscription?.max_applications_count}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.employeesCount}:{" "}
              {user.subscription?.employees_count} /{" "}
              {user.subscription?.max_employees_count}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.vendorsCount}:{" "}
              {user.subscription?.vendors_count} /{" "}
              {user.subscription?.max_vendors_count}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.subscriptionDate}:{" "}
              {new Date(user.subscription?.created_at).toLocaleString()}
            </li>
            <li>
              {translations.userInfo.subscriptionInfo.renewalDate}:{" "}
              {new Date(user.subscription?.updated_at).toLocaleString()}
            </li>
          </ul>
        </div>
      </div>

      {/* Linked Stores */}
      <div className="bg-neutral-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl font-semibold">
            {translations.userInfo.linkedStores.title}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="bg-neutral-800 rounded-lg p-4 border border-green-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-green-400 font-medium">متجر كريم</span>
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <div className="text-xs text-gray-400">
              Connected since: 12/11/2024
            </div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-4 border border-red-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-red-400 font-medium">سوبر ماركت النور</span>
              <span className="text-xs text-gray-400">Inactive</span>
            </div>
            <div className="text-xs text-gray-400">
              Connected since: 15/10/2024
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-neutral-900 rounded-lg shadow p-6">
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
                <th className="px-4 py-2">
                  {translations.userInfo.transactions.refId}
                </th>
                <th className="px-4 py-2">
                  {translations.userInfo.transactions.amount}
                </th>
                <th className="px-4 py-2">
                  {translations.userInfo.transactions.netAmount}
                </th>
                <th className="px-4 py-2">
                  {translations.userInfo.transactions.fees}
                </th>
                <th className="px-4 py-2">
                  {translations.userInfo.transactions.status}
                </th>
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
              {user.transactions.data.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/10">
                  <td className="px-4 py-2">{transaction.transaction_id}</td>
                  <td className="px-4 py-2">{transaction.ref_id}</td>
                  <td className="px-4 py-2">{transaction.amount} ج.م</td>
                  <td className="px-4 py-2">
                    {transaction.amount_exclude_fees} ج.م
                  </td>
                  <td className="px-4 py-2">{transaction.total_fees} ج.م</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
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
                        (opt) =>
                          opt.key === transaction.payment_option.toLowerCase()
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
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
