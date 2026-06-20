import React from "react";
import "./FamilyAccess.css";

export default function FamilyManagement({ onClose, userId }) {
  return (
    <div className="family-mgmt-overlay" onClick={onClose}>
      <div className="family-mgmt-sheet coming-soon-sheet" onClick={e => e.stopPropagation()}>
        <div className="family-mgmt-header">
          <div className="family-mgmt-header-row">
            <h2 className="family-mgmt-title">Household</h2>
            <button className="family-mgmt-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="coming-soon-page" style={{ height: "300px", justifyContent: "center" }}>
          <div className="coming-soon-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="coming-soon-title">Coming Soon</h2>
          <p className="coming-soon-text">Family sharing and household management will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}

/* MEMBER CARD SUB-COMPONENT */
function MemberCard({ member, isCurrentUser, isOwner, canManage, onRoleChange, onRemove }) {
  const perms = getPermsForRole(member.role);
  const badgeClass = getRoleBadgeClass(member.role);
  const badgeText = getRoleBadgeText(member.role);

  return (
    <div className="fm-member-card">
      <div className="fm-member-header">
        <div className="fm-member-avatar">
          {getInitials(member.display_name)}
        </div>
        <div className="fm-member-info">
          <div className="fm-member-name-row">
            <span className="fm-member-name">{member.display_name || "Member"}</span>
            {isCurrentUser && <span className="fm-member-you">- You</span>}
          </div>
          <span className="fm-member-subtitle">
            {member.role === "owner" ? "Owner" : member.role === "caregiver" ? "Caregiver" : "Family"}
          </span>
        </div>
        <span className={`fm-role-badge ${badgeClass}`}>{badgeText}</span>
      </div>

      {/* Permission bullets */}
      <div className="fm-permissions">
        {perms.map(perm => (
          <div className="fm-perm-item" key={perm}>
            <div className={`fm-perm-dot ${isOwner ? "green" : "green"}`} />
            <span>{perm}</span>
          </div>
        ))}
      </div>

      {/* Actions for non-owners (only visible to the owner) */}
      {canManage && !isOwner && (
        <div className="fm-member-actions">
          <select
            className="fm-role-select"
            value={member.role}
            onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
          >
            <option value="family_member">Family Member</option>
            <option value="caregiver">Temporary Caregiver</option>
          </select>
          <button className="fm-remove-btn" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
