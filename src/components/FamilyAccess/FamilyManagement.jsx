import { useState, useEffect } from "react";
import InviteMemberModal from "./InviteMemberModal";
import "./FamilyAccess.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* Permission descriptions by role */
const OWNER_PERMS = [
  "Invite & remove family",
  "Edit pet profile",
  "Transfer ownership",
];

const FAMILY_PERMS = [
  "View pet records",
  "Complete checklist",
  "Mark medicines given",
];

const CAREGIVER_PERMS = [
  "View pet profile",
  "Complete checklist",
];

function getPermsForRole(role) {
  if (role === "owner") return OWNER_PERMS;
  if (role === "caregiver") return CAREGIVER_PERMS;
  return FAMILY_PERMS;
}

function getRoleBadgeClass(role) {
  if (role === "owner") return "owner";
  if (role === "caregiver") return "caregiver";
  return "family";
}

function getRoleBadgeText(role) {
  if (role === "owner") return "Admin";
  if (role === "caregiver") return "Temporary Caregiver";
  return "Family Member";
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function FamilyManagement({ onClose, userId }) {
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [petCount, setPetCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/household/by-user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch household");
      const data = await res.json();

      setHousehold(data.household);
      setMembers(data.members || []);
      setPetCount(data.pet_count || 0);
      setUserRole(data.user_role);
    } catch (err) {
      console.error("Fetch household error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/household/${household.id}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      }
    } catch (err) {
      console.error("Role change error:", err);
    }
  };

  const handleRemove = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from the household?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/household/${household.id}/members/${memberId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
      }
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  const isOwner = userRole === "owner";

  // Separate members by role
  const ownerMember = members.find(m => m.role === "owner");
  const familyMembers = members.filter(m => m.role === "family_member" && m.status === "active");
  const caregivers = members.filter(m => m.role === "caregiver" && m.status === "active");

  return (
    <>
      <div className="family-mgmt-overlay" onClick={onClose}>
        <div className="family-mgmt-sheet" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="family-mgmt-header">
            <div className="family-mgmt-header-row">
              <h2 className="family-mgmt-title">
                <svg className="family-mgmt-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Family Access
              </h2>
              <button className="family-mgmt-close" onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="family-mgmt-subtitle">
              Everyone here can care for all {petCount} pet{petCount !== 1 ? "s" : ""} in this household.
            </p>
          </div>

          {loading ? (
            <div className="fm-loading">
              <div className="fm-spinner" />
              <span>Loading members...</span>
            </div>
          ) : (
            <>
              {/* Invite Button */}
              {isOwner && (
                <button className="family-invite-btn" onClick={() => setShowInviteModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Invite Member
                </button>
              )}

              {/* Owner Section */}
              {ownerMember && (
                <div className="fm-section">
                  <div className="fm-section-label">OWNER / ADMIN</div>
                  <MemberCard
                    member={ownerMember}
                    isCurrentUser={ownerMember.user_id === userId}
                    isOwner={true}
                    canManage={false}
                  />
                </div>
              )}

              {/* Family Members */}
              {familyMembers.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-label">FAMILY MEMBERS</div>
                  {familyMembers.map(m => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isCurrentUser={m.user_id === userId}
                      isOwner={false}
                      canManage={isOwner}
                      onRoleChange={(newRole) => handleRoleChange(m.id, newRole)}
                      onRemove={() => handleRemove(m.id, m.display_name)}
                    />
                  ))}
                </div>
              )}

              {/* Caregivers */}
              {caregivers.length > 0 && (
                <div className="fm-section">
                  <div className="fm-section-label">TEMPORARY CAREGIVERS</div>
                  {caregivers.map(m => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isCurrentUser={m.user_id === userId}
                      isOwner={false}
                      canManage={isOwner}
                      onRoleChange={(newRole) => handleRoleChange(m.id, newRole)}
                      onRemove={() => handleRemove(m.id, m.display_name)}
                    />
                  ))}
                </div>
              )}

              {/* No members message */}
              {familyMembers.length === 0 && caregivers.length === 0 && (
                <div className="family-activity-empty" style={{ padding: "32px 20px" }}>
                  No family members yet. Invite someone to help care for your pets!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && household && (
        <InviteMemberModal
          householdId={household.id}
          userId={userId}
          onClose={() => setShowInviteModal(false)}
          onInviteCreated={() => {
            setShowInviteModal(false);
            fetchData();
          }}
        />
      )}
    </>
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
