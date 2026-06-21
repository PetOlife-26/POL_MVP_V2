import { useState, useEffect } from "react";
import "./FamilyAccess.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/* Check icon for completed tasks */
function CheckCircle() {
  return (
    <svg className="fa-item-icon completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* X icon for skipped tasks */
function XCircle() {
  return (
    <svg className="fa-item-icon skipped" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* Format timestamp to time string */
function formatTime(timestamp) {
  if (!timestamp) return "";
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch {
    return "";
  }
}

export default function FamilyActivityFeed({ householdId, onManageClick }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/household/${householdId}/activity`);
        if (res.ok) {
          const data = await res.json();
          setActivities(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [householdId]);

  if (!householdId || loading) return null;

  return (
    <div className="family-activity-section">
      <div className="family-activity-header">
        <h3 className="family-activity-title">
          <svg className="family-activity-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          TODAY'S FAMILY ACTIVITY
        </h3>
        {onManageClick && (
          <button className="family-activity-manage" onClick={onManageClick}>
            Manage
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="family-activity-list">
          <div className="family-activity-empty">
            No activity yet today. Complete a task to get started!
          </div>
        </div>
      ) : (
        <>
          <div className="family-activity-list">
            {activities.map(activity => (
              <div className="family-activity-item" key={activity.id}>
                {activity.action === "completed" ? <CheckCircle /> : <XCircle />}
                <div className="fa-item-content">
                  <p className="fa-item-text">
                    <strong>{activity.member_name}</strong>
                    {" "}
                    {activity.action === "completed" ? "completed" : "marked missed"}
                    {" "}
                    {activity.task_title}
                    {" "}
                    <span className="fa-item-pet">· {activity.pet_name}</span>
                  </p>
                </div>
                <span className="fa-item-time">{formatTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
          <p className="family-activity-note">
            Everyone in the family sees what's already done — no duplicate care.
          </p>
        </>
      )}
    </div>
  );
}
