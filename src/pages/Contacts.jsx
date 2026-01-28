import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Phone } from "lucide-react";

const API = "http://localhost:8080"; // your backend URL

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/member-contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          setContacts(res.data);
        } else {
          console.error("Unexpected contacts format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-12">Loading...</div>;
  }

  // Separate admins and members
  const admins = contacts.filter((c) => c.role === "ADMIN");
  const members = contacts.filter((c) => c.role !== "ADMIN");

  const renderAdminCard = (contact) => (
    <Card
      key={contact.userID}
      hoverEffect
      className="flex flex-col items-center text-center p-4 w-56 sm:w-64"
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={`https://i.pravatar.cc/150?u=${contact.userID}`}
          alt={contact.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-white/5 shadow-md"
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-white mb-1">{contact.name}</h3>

      {/* Role label */}
      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-400">
        Admin
      </span>

      {/* Phone */}
      <div className="w-full mt-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 justify-center">
          <Phone size={14} className="text-indigo-400" />
          {contact.phonenumber}
        </div>
      </div>
    </Card>
  );

  const renderMemberCard = (contact) => (
    <Card
      key={contact.userID}
      hoverEffect
      className="flex flex-col items-center text-center p-4 w-48 sm:w-52"
    >
      {/* Avatar */}
      <div className="relative mb-2">
        <img
          src={`https://i.pravatar.cc/150?u=${contact.userID}`}
          alt={contact.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white/5 shadow-md"
        />
      </div>

      {/* Name */}
      <h3 className="text-md font-bold text-white mb-1">{contact.name}</h3>

      {/* Role label */}
      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
        Member
      </span>

      {/* Phone */}
      <div className="w-full mt-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 justify-center">
          <Phone size={14} className="text-indigo-400" />
          {contact.phonenumber}
        </div>
      </div>

      {/* Active loans */}
      <div className="mt-2 text-xs text-white">
        Active Loans: {contact.nofactiveloans}
      </div>
    </Card>
  );

  return (
    <div className="space-y-10"> {/* increased gap between admin and members */}
      {/* Admins (centered) */}
      {admins.length > 0 && (
        <div className="flex justify-center gap-6 flex-wrap">
          {admins.map(renderAdminCard)}
        </div>
      )}

      {/* Members (normal flow) */}
      {members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map(renderMemberCard)}
        </div>
      )}
    </div>
  );
};

export default Contacts;