import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Wallet, TrendingDown, PiggyBank, PlusCircle } from "lucide-react";

export function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [availableBudget, setAvailableBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH BUDGET ON PAGE LOAD ---------------- */
  useEffect(() => {
    const fetchBudgetInfo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/get-budget-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTotalBudget(res.data.totalBudget);
        setAvailableBudget(res.data.availableBudget);
      } catch (err) {
        console.error("Failed to fetch budget info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetInfo();
  }, []);

  /* ---------------- DEPOSIT MONEY ---------------- */
  const handleDeposit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/admin/create-deposits",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // backend returns updated budget
      setTotalBudget(res.data.totalBudget);
      setAvailableBudget(res.data.availableBudget);
    } catch (err) {
      console.error("Deposit failed", err);
    }
  };

  if (loading) {
    return <p className="text-white">Loading budget...</p>;
  }

  const percentage =
    totalBudget === 0 ? 0 : (availableBudget / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PiggyBank className="text-emerald-400" /> Budget Overview
        </h1>

        {/* DEPOSIT BUTTON */}
        <button
          onClick={handleDeposit}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
        >
          <PlusCircle size={18} />
          Deposit Money
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TOTAL BUDGET */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm uppercase mb-2">
              Total Budget
            </p>
            <h2 className="text-4xl font-bold text-white">
              ₹ {totalBudget.toLocaleString()}
            </h2>
          </div>
        </Card>

        {/* AVAILABLE FUNDS */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm uppercase mb-2">
              Available Funds
            </p>

            <h2
              className={`text-4xl font-bold ${
                availableBudget < 10000
                  ? "text-rose-400"
                  : "text-indigo-400"
              }`}
            >
              ₹ {availableBudget.toLocaleString()}
            </h2>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
              <div className="h-2 w-36 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    availableBudget < 10000
                      ? "bg-rose-500"
                      : "bg-indigo-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {Math.round(percentage)}% Remaining
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}