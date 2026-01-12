"use client";

import { Locale } from "@/lib/i18n/config";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export const useWithdrawalHistoryColumns = (): TableColumnDefinition<WithdrawalTransaction>[] => {
  const locale = useLocale();

  return [
    {
      header: "Transaction ID",
      accessorKey: "id",
      render: (_, transaction: WithdrawalTransaction) => (
        <span className="text-high-grey-II !text-sm font-medium">
          {transaction.transactionId || transaction.id.slice(0, 8)}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      render: (_, transaction: WithdrawalTransaction) => (
        <span className="!text-sm font-medium">{formatCurrency(transaction.amount, locale as Locale)}</span>
      ),
    },
    {
      header: "Bank",
      accessorKey: "bankName",
      render: (_, transaction: WithdrawalTransaction) => (
        <div>
          <div className="!text-sm font-medium">{transaction.bankName}</div>
          <div className="!text-sm">{transaction.bankAccount}</div>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      render: (_, transaction: WithdrawalTransaction) => (
        <span className="!text-sm">{formatDate(transaction.date, locale as Locale)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (_, transaction: WithdrawalTransaction) => (
        <span
          className={cn(
            "rounded-full px-4 py-1 !text-sm capitalize",
            transaction.status === "approved" && "bg-low-success text-mid-success",
            transaction.status === "pending" && "bg-yellow-100 text-yellow-600",
            transaction.status === "processing" && "bg-blue-100 text-blue-600",
            transaction.status === "rejected" && "bg-low-danger text-mid-danger",
          )}
        >
          {transaction.status}
        </span>
      ),
    },
  ];
};
