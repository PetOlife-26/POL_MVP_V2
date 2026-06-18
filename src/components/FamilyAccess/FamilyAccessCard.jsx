import { useState, useEffect } from "react";
import "./FamilyAccess.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* Family Access Card shown in Profile tab */
export default function FamilyAccessCard({ userId, onManageClick }) {
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchHousehold = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/household/by-user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          const activeMembers = (data.members || []).filter(m => m.status === "active");
          setMemberCount(activeMembers.length);
        }
      } catch (err) {
        console.error("Failed to fetch household info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHousehold();
  }, [userId]);

  if (loading) return null;

  return (
    <div className="family-access-card" onClick={onManageClick}>
      <div className="fac-left">
        <div className="fac-icon-group">
          <svg className="fac-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="fac-text">
          <h3 className="fac-title">Family Access</h3>
          <span className="fac-count">
            {memberCount > 0 ? `${memberCount} Member${memberCount !== 1 ? "s" : ""} Active` : "Set up your household"}
          </span>
        </div>
      </div>
      <div className="fac-arrow">
        <span className="fac-manage-text">Manage household care</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}
