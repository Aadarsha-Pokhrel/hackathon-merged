import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Phone } from "lucide-react";
import profilepicture from '../assets/profilepicture.png';
import { motion } from "framer-motion";

const API = "http://localhost:8080";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + (i * 0.1),
        duration: 0.4
      }
    })
  };

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
          console.error("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-white text-lg">Loading contacts...</p>
        </motion.div>
      </div>
    );
  }

  // Separate admins and members
  const admins = contacts.filter((c) => c.role === "ADMIN");
  const members = contacts.filter((c) => c.role !== "ADMIN");

  /* ================= ADMIN CARD ================= */
  const renderAdminCard = (contact, index) => (
    <motion.div
      key={contact.userID}
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      <Card
        hoverEffect
        className="flex flex-col items-center text-center p-5 w-64 min-h-[280px] relative overflow-hidden group"
      >
        {/* Animated crown glow */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-red-500 rounded-full blur-2xl"></div>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar */}
          <motion.img
            variants={avatarVariants}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
            src={profilepicture}
            alt={contact.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-md mb-3"
          />

          {/* Name */}
          <motion.h3 
            custom={0}
            variants={contentVariants}
            className="text-lg font-bold text-white"
          >
            {contact.name}
          </motion.h3>

          {/* Role */}
          <motion.span 
            custom={1}
            variants={contentVariants}
            whileHover={{ scale: 1.1 }}
            className="mt-1 flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
          >
            👑 Admin
          </motion.span>

          {/* Phone */}
          <motion.div 
            custom={2}
            variants={contentVariants}
            className="w-full mt-4"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-300"
            >
              <Phone size={14} className="text-indigo-400" />
              {contact.phonenumber}
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  /* ================= MEMBER CARD ================= */
  const renderMemberCard = (contact, index) => (
    <motion.div
      key={contact.userID}
      variants={cardVariants}
      whileHover={{ 
        y: -6,
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
    >
      <Card
        hoverEffect
        className="flex flex-col items-center text-center p-4 w-full min-h-[260px] relative overflow-hidden group"
      >
        {/* Animated background glow */}
        <motion.div 
          className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-15 transition-opacity"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        >
          <div className="w-full h-full bg-blue-500 rounded-full blur-2xl"></div>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Avatar */}
          <motion.img
            variants={avatarVariants}
            whileHover={{ 
              scale: 1.1,
              rotate: -5,
              transition: { duration: 0.3 }
            }}
            src={profilepicture}
            alt={contact.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/10 shadow-md"
          />

          {/* Name */}
          <motion.h3 
            custom={0}
            variants={contentVariants}
            className="text-md font-bold text-white mt-2"
          >
            {contact.name}
          </motion.h3>

          {/* Role */}
          <motion.span 
            custom={1}
            variants={contentVariants}
            whileHover={{ scale: 1.08 }}
            className="mt-1 text-xs font-semibold px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
          >
            Member
          </motion.span>

          {/* Phone */}
          <motion.div 
            custom={2}
            variants={contentVariants}
            className="w-full mt-3"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300"
            >
              <Phone size={13} className="text-indigo-400" />
              {contact.phonenumber}
            </motion.div>
          </motion.div>

          {/* Loan Info */}
          <motion.div 
            custom={3}
            variants={contentVariants}
            whileHover={{ scale: 1.05 }}
            className="mt-auto pt-3 text-xs text-slate-300"
          >
            Active Loans:{" "}
            <span className="text-white font-semibold">
              {contact.nofactiveloans}
            </span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-16">

      {/* ================= ADMINS SECTION ================= */}
      {admins.length > 0 && (
        <motion.section 
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.h2 
            variants={headerVariants}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-400 text-center tracking-wide"
          >
            👑 Administrators
          </motion.h2>

          <motion.div 
            variants={sectionVariants}
            className="flex justify-center gap-8 flex-wrap"
          >
            {admins.map((admin, idx) => renderAdminCard(admin, idx))}
          </motion.div>
        </motion.section>
      )}

      {/* ================= MEMBERS SECTION ================= */}
      {members.length > 0 && (
        <motion.section 
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.h2 
            variants={headerVariants}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-wide"
          >
            Members
          </motion.h2>

          <motion.div 
            variants={sectionVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {members.map((member, idx) => renderMemberCard(member, idx))}
          </motion.div>
        </motion.section>
      )}

    </div>
  );
};

export default Contacts;