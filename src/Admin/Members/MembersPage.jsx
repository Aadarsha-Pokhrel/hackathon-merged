import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Users, Search, DollarSign, Wallet } from "lucide-react";

const API = "http://localhost:8080"; // your backend URL

export function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [searchText, setSearchText] = useState("");

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extract contacts array from backend response
        if (res.data && Array.isArray(res.data.contacts)) {
          setMembers(res.data.contacts);
        } else {
          console.error("Unexpected members format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort filtered members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "deposits")
      return (b.depositDto?.totalDeposit || 0) - (a.depositDto?.totalDeposit || 0);
    if (sortBy === "borrowed")
      return (b.depositDto?.totalBurrowed || 0) - (a.depositDto?.totalBurrowed || 0);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400" /> Members Details
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Total Members:{" "}
            <span className="text-white font-semibold">{members.length}</span>
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-64 bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="deposits">Sort by Deposits</option>
            <option value="borrowed">Sort by Borrowed</option>
          </select>
        </div>
      </div>

      {/* Loading / Empty / Members List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-800/50 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : sortedMembers.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10 text-slate-500">
          No members found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMembers.map((member) => (
            <Card key={member.userID} hoverEffect className="relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-400">{member.phonenumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-slate-950/30 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase flex items-center gap-1 mb-1">
                      <Wallet size={12} /> Borrowed
                    </p>
                    <p className="text-lg font-bold text-white">
                      ₹ {member.depositDto?.totalBurrowed?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase flex items-center gap-1 mb-1">
                      <DollarSign size={12} /> Deposits
                    </p>
                    <p className="text-lg font-bold text-white">
                      ₹ {member.depositDto?.totalDeposit?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}