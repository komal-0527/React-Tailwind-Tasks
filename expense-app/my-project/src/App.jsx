import React, { useState, useEffect, useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);



export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem("exp_tracker_transactions");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [form, setForm] = useState({
    type: "income",
    title: "",
    amount: "",
    category: "Salary",
    date: new Date().toISOString().slice(0, 10),
  });

  const [filter, setFilter] = useState({
    type: "all",
    category: "all",
    month: "all",
  });

  useEffect(() => {
    localStorage.setItem(
      "exp_tracker_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.title || !form.amount || isNaN(amt) || amt <= 0) return;

    const tx = {
      id: Date.now(),
      title: form.title,
      amount: Math.round(amt * 100) / 100,
      type: form.type,
      category: form.category,
      date: form.date,
    };

    setTransactions((t) => [tx, ...t]);
    setForm({ ...form, title: "", amount: "" });
  };

  const removeTransaction = (id) => {
    setTransactions((t) => t.filter((x) => x.id !== id));
  };

  const categories = [
    "Salary",
    "Savings",
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Other",
  ];

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filter.type !== "all" && tx.type !== filter.type) return false;
      if (filter.category !== "all" && tx.category !== filter.category)
        return false;
      if (filter.month !== "all") {
        const txMonth = tx.date.slice(0, 7); // YYYY-MM
        if (txMonth !== filter.month) return false;
      }
      return true;
    });
  }, [transactions, filter]);

  // Totals
  const totals = useMemo(() => {
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
      balance: Math.round((income - expense) * 100) / 100,
    };
  }, [filtered]);

  // Pie chart: spending by category (expenses only)
  const pieData = useMemo(() => {
    const sums = {};
    categories.forEach((c) => (sums[c] = 0));
    transactions.forEach((t) => {
      if (t.type === "expense")
        sums[t.category] = (sums[t.category] || 0) + t.amount;
    });
    const labels = categories;
    const data = labels.map((l) => Math.round((sums[l] || 0) * 100) / 100);
    return {
      labels,
      datasets: [
        {
          label: "Spending by Category",
          data,
        },
      ],
    };
  }, [transactions]);

  // Line chart: monthly balance (last 6 months)
  const lineData = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      );
    }

    const monthSums = months.map((m) => {
      const income = transactions
        .filter((t) => t.type === "income" && t.date.slice(0, 7) === m)
        .reduce((s, t) => s + t.amount, 0);
      const expense = transactions
        .filter((t) => t.type === "expense" && t.date.slice(0, 7) === m)
        .reduce((s, t) => s + t.amount, 0);
      return Math.round((income - expense) * 100) / 100;
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Monthly Balance",
          data: monthSums,
          tension: 0.3,
        },
      ],
    };
  }, [transactions]);

  // Unique months for filter dropdown
  const monthsAvailable = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Expense Tracker</h1>
          <div className="text-right">
            <div className="text-sm">Balance</div>
            <div className="text-xl font-semibold">
              RS {totals.balance.toFixed(2)}
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form + Filters */}
          <section className="lg:col-span-1 bg-white rounded-2xl p-5 shadow">
            <h2 className="font-semibold mb-3">Add Transaction</h2>
            <form onSubmit={addTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="p-2 border rounded"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="p-2 border rounded"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Title (e.g., Lunch at cafe)"
                className="w-full p-2 border rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  placeholder="Amount"
                  type="number"
                  step="0.01"
                  className="p-2 border rounded"
                />
                <input
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  type="date"
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, title: "", amount: "" })}
                  className="px-4 py-2 border rounded"
                >
                  Clear
                </button>
              </div>
            </form>

            <hr className="my-4" />

            <h3 className="font-semibold mb-2">Filters</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm block mb-1">Type</label>
                <select
                  value={filter.type}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, type: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Category</label>
                <select
                  value={filter.category}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Month</label>
                <select
                  value={filter.month}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, month: e.target.value }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All</option>
                  {monthsAvailable.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setFilter({ type: "all", category: "all", month: "all" })
                  }
                  className="flex-1 px-3 py-2 border rounded"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    const m = `${now.getFullYear()}-${String(
                      now.getMonth() + 1
                    ).padStart(2, "0")}`;
                    setFilter((f) => ({ ...f, month: m }));
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded"
                >
                  This Month
                </button>
              </div>
            </div>
          </section>

          {/* Middle: Transactions list */}
          <section className="lg:col-span-1 bg-white rounded-2xl p-5 shadow max-h-[70vh] overflow-auto">
            <h2 className="font-semibold mb-3">Transactions</h2>
            <div className="mb-3 text-sm">
              <span className="mr-3">Income: RS{totals.income.toFixed(2)}</span>
              <span className="mr-3">
                Expense: RS{totals.expense.toFixed(2)}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No transactions found
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-gray-500">
                        {t.category} • {t.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          t.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        RS {t.amount.toFixed(2)}
                      </div>
                      <div className="mt-2 flex gap-2 justify-end">
                        <button
                          onClick={() => removeTransaction(t.id)}
                          className="text-xs px-2 py-1 border rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Right: Charts */}
          <section className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Spending by Category</h3>
              <div className="h-56">
                <Pie data={pieData} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Monthly Balance (6 months)</h3>
              <div className="h-56">
                <Line data={lineData} />
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with React + Tailwind • Data saved to LocalStorage
        </footer>
      </div>
    </div>
  );
}
