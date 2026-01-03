import React from "react";
import { contacts } from "../data/dummydata";
import "./Contacts.css";

const Contacts = ({ user }) => {
  const displayContacts =
    user?.role === "member"
      ? contacts.filter((contact) => contact.id !== user.id)
      : contacts;

  return (
    <div className="contacts-container">
      <h2 className="contacts-title">
        {user?.role === "admin"
          ? "All Member Contacts"
          : "Group Member Contacts"}
      </h2>

      <div className="contacts-list">
        {displayContacts.length === 0 ? (
          <p className="no-contacts">No contacts found.</p>
        ) : (
          displayContacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="contact-avatar"
              />

              <div className="contact-info">
                <p className="contact-name">{contact.name}</p>
                <p className="contact-details">
                  {contact.phone} • {contact.email}
                </p>
                <p
                  className={`contact-status ${
                    contact.status === "active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {contact.status === "active" ? "● Active" : "○ Inactive"}
                </p>
              </div>

              {user?.role === "admin" && (
                <div className="contact-actions">
                  <button className="btn edit-btn">Edit</button>
                  <button className="btn view-btn">View</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;
