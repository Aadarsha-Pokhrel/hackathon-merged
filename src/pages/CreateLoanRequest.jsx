// src/pages/LoanRequest.jsx
import { useState } from "react";
import axios from "axios";
import "./CreateLoanRequest.css";

const CreateLoanRequest = ({ user }) => {
  const [Amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  // const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Amount || !purpose ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/loan-request", // your backend endpoint
        {
          memberId: user.id,
          Amount,
          purpose,
          // description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Loan request submitted successfully!");
      setAmount("");
      setPurpose("");
      // setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit request. Try again.");
    }
  };

  return (
    <div className="loan-request-container">
      <h2>Request a Loan</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="loan-request-form">
        <label>
          Amount (NPR):
          <input
            type="number"
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label>
          Purpose:
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>

        {/* <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label> */}

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default CreateLoanRequest;