import React from "react";
import HeroMemberCard from "./HeroMemberCard.jsx";
import { loans } from "../data/dummydata.js";
import LoanCard from "./LoanCard.jsx";

const Hero = ({ user }) => {
  // Use the logged-in user's ID instead of hardcoded value
  const currentMemberId = user?.id || 1;
  const myLoans = loans.filter((loan) => loan.memberId === currentMemberId);

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen px-4 py-8
                md:ml-64"
    >
      <div className="w-full max-w-4xl mt-20">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Welcome, {user?.name || 'User'}!  {/* Display the user's actual name */}
        </h2>
        
        {/* Hero Cards */}
        <div className="flex flex-wrap justify-evenly items-center gap-4">
          <HeroMemberCard title="Total Deposits" value="NPR 120,000" />
          <HeroMemberCard title="Active Loans" value={myLoans.length.toString()} />
          <HeroMemberCard title="Total Borrowed" value="NPR 40,000" />
        </div>

        {/* Active Loans Section */}
        <div className="bg-white rounded-lg shadow mb-6 mt-14">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-center">My Active Loans</h2>
          </div>
          <div className="p-6">
            {myLoans.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active loans</p>
            ) : (
              <div className="space-y-4">
                {myLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

