import React from "react";
import reminderIcon from "./reminder-icon.png";

export default function ReminderCard() {
  return (
    <div className="reminder-card">
      <div className="reminder-left">
        <div className="reminder-icon">
          <img src={reminderIcon} alt="reminder" />
        </div>

        <div className="reminder-text">
          <span className="reminder-label">Next Reminder</span>
          <p className="reminder-title">No upcoming reminders</p>
          <p className="reminder-sub">You're all set!</p>
        </div>
      </div>

      <button className="reminder-view-btn">View All</button>
    </div>
  );
}