import React from "react";
import { contacts } from "../data/dummydata";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Phone, Mail, User } from "lucide-react";

const Contacts = ({ user }) => {
  const displayContacts =
    user?.role === "member"
      ? contacts.filter((contact) => contact.id !== user.id)
      : contacts;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {user?.role === "admin" ? "All Member Contacts" : "Group Member Contacts"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayContacts.length === 0 ? (
           <div className="col-span-full text-center py-10 text-slate-500">No contacts found.</div>
        ) : (
          displayContacts.map((contact) => (
            <Card key={contact.id} hoverEffect className="flex flex-col items-center text-center p-6">
               <div className="relative mb-4">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/5 shadow-2xl"
                  />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                     contact.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}></div>
               </div>

               <h3 className="text-lg font-bold text-white mb-1">{contact.name}</h3>
               <p className="text-sm text-slate-400 mb-4 flex items-center gap-1 justify-center">
                  <span className={`w-2 h-2 rounded-full ${contact.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                  {contact.status === 'active' ? 'Active Member' : 'Inactive'}
               </p>

               <div className="w-full space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300">
                     <Phone size={16} className="text-indigo-400" />
                     {contact.phone}
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300">
                     <Mail size={16} className="text-indigo-400" />
                     {contact.email}
                  </div>
               </div>

              {user?.role === "admin" && (
                <div className="flex gap-2 w-full mt-6">
                  <Button variant="secondary" className="flex-1 text-xs h-9">Edit</Button>
                  <Button variant="ghost" className="flex-1 text-xs h-9">View Profile</Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;
