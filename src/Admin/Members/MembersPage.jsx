import { useState } from "react";
import { members as initialMembers } from "./Members.js";
import "./MembersPage.css";

export function MembersPage() {
  const [members] = useState(initialMembers);
  const [sortBy, setSortBy] = useState("name");
  const [searchText, setSearchText] = useState("");

  // Filter members based on search
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort filtered members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "loans") return b.loansTaken - a.loansTaken;
    if (sortBy === "borrowed") return b.totalBorrowed - a.totalBorrowed;
    return 0;
  });

  return (
    <div className="members-page">
      <h1 className="page-title">👥 Members Details</h1>

      {/* Total Members */}
      <div className="total-members">
        Total Members: <span>{members.length}</span>
      </div>

      {/* Search and Sort */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        <div className="sort-section">
          <label>Sort By: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="loans">Loans Taken</option>
            <option value="borrowed">Total Borrowed</option>
          </select>
        </div>
      </div>

      {/* Members List */}
      <div className="members-list">
        {sortedMembers.length === 0 && <p>No members found</p>}
        {sortedMembers.map((member) => (
          <div key={member.id} className="member-card">
            <p className="member-name">{member.name}</p>
            <p className="member-loans">Loans Taken: {member.loansTaken}</p>
            <p className="member-borrowed">Total Borrowed: ₹ {member.totalBorrowed}</p>
            <p className="member-contact">Contact: {member.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
