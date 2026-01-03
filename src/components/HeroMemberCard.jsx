import React from "react";
import "./HeroMemberCard.css";

const HeroMemberCard = ({ title, value }) => {
  return (
    <div className="hero-member-card">
      <p className="hero-card-title">{title}</p>
      <p className="hero-card-value">{value}</p>
    </div>
  );
};

export default HeroMemberCard;
