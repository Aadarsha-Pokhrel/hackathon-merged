import { useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Coins, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';

const CreateLoanRequest = ({ user }) => {
  const [Amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus("idle");

    if (!Amount || !purpose ) {
      setMessage("Please fill all fields.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/loan-request", 
        {
          memberId: user.id,
          Amount,
          purpose,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Loan request submitted successfully!");
      setStatus("success");
      setAmount("");
      setPurpose("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit request. Try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">Request a Loan</h2>
      </div>

      <Card className="p-8 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Coins size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">New Application</h3>
                <p className="text-slate-400 text-sm">Submit your loan details for approval.</p>
            </div>
        </div>

        {message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 
                'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
                {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
             label="Loan Amount (NPR)"
             icon={Coins}
             type="number"
             placeholder="e.g. 50000"
             value={Amount}
             onChange={(e) => setAmount(e.target.value)}
          />

          <Input 
             label="Purpose"
             icon={FileText}
             type="text"
             placeholder="e.g. Home Renovation"
             value={purpose}
             onChange={(e) => setPurpose(e.target.value)}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Submit Request <Send size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateLoanRequest;