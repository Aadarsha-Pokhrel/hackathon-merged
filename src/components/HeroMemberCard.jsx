import React from "react";

const HeroMemberCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow min-w-[250px] w-fit">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default HeroMemberCard;

