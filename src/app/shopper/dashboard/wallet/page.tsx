"use client";

import { useState } from "react";
import { Card, Spin, message } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import Sidebar from "../_components/Sidebar";
import { useQuery } from "@apollo/client/react";
import { GET_MY_WALLET } from "@/graphql/queries";

export default function WalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const { data, loading, error, refetch } = useQuery<any>(GET_MY_WALLET, {
    pollInterval: 30000, // Poll every 30s
  });

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    message.error("Failed to load wallet data");
    console.error(error);
  }

  const wallet = data?.myWallet || { balance: 0, transactions: [] };
  const transactions = wallet.transactions || [];

  const filteredTransactions =
    activeTab === "All"
      ? transactions
      : transactions.filter((t: any) =>
        activeTab === "Credit" ? t.type === "CREDIT" : t.type === "DEBIT"
      );

  return (
    <div className="min-h-screen bg-app_bg flex font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text1 hover:text-app_primary transition-colors"
            >
              <MenuOutlined className="text-xl" />
            </button>
            <div className="hidden lg:block w-6" />
          </div>

          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Wallet
          </h1>

          <div className="flex items-center gap-4">
            <button className="text-text2 hover:text-text1 transition-colors">
              <DownloadOutlined className="text-xl" />
            </button>
            <button
              className="text-text2 hover:text-text1 transition-colors"
              onClick={() => refetch()}
            >
              <ReloadOutlined className="text-xl" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Available Balance Card */}
            <div className="bg-[#FF7043] rounded-xl p-8 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold mb-8">
                {wallet.currency || "NGN"} {wallet.balance?.toLocaleString()}
              </h2>
              <button
                className="w-full sm:w-1/2 bg-[#FF8A65] hover:bg-[#FFAB91] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                onClick={() => message.info("Top-up feature coming soon!")}
              >
                <PlusOutlined />
                Add Money
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-text2 mb-2">Total Spent</p>
                <p className="text-2xl font-bold text-text1 mb-1">₦0</p>
                <p className="text-xs text-text2">Last 30 days: ₦0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-text2 mb-2">Total Cashback</p>
                <p className="text-2xl font-bold text-text1 mb-1">₦0</p>
                <p className="text-xs text-text2">Earned from 0 orders</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-text2 mb-2">Pending</p>
                <p className="text-2xl font-bold text-text1 mb-1">₦0</p>
                <p className="text-xs text-text2">No pending transactions</p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-text1">
                  Transaction History
                </h3>
                <div className="flex gap-3 p-1 rounded-lg">
                  {["All", "Credit", "Debit"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab
                        ? "bg-[#FF7043] text-white shadow-sm"
                        : "bg-gray-100 text-text2 hover:text-text1"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <p className="text-center text-text2 py-8">No transactions found</p>
                ) : (
                  filteredTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === "CREDIT"
                            ? "bg-green-50 text-green-500"
                            : "bg-red-50 text-red-500"
                            }`}
                        >
                          {transaction.type === "CREDIT" ? (
                            <ArrowDownOutlined className="text-xl" />
                          ) : (
                            <ArrowUpOutlined className="text-xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-text1">
                            {transaction.description || "Transaction"}
                          </p>
                          <p className="text-xs text-text2 mt-0.5">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${transaction.type === "CREDIT"
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {transaction.type === "CREDIT" ? "+" : "-"}
                          {wallet.currency}
                          {transaction.amount.toLocaleString()}
                        </p>
                        <p className={`text-xs mt-0.5 ${transaction.status === "COMPLETED" ? "text-green-600" :
                          transaction.status === "PENDING" ? "text-orange-500" : "text-red-500"
                          }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
