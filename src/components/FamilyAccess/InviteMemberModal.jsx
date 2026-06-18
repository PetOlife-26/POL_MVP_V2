import { useState } from "react";
import "./FamilyAccess.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* WhatsApp Icon */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* Link Icon */
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function InviteMemberModal({ householdId, userId, onClose, onInviteCreated }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("family_member");
  const [shareMethod, setShareMethod] = useState("link");
  const [inviteUrl, setInviteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSendInvite = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/household/${householdId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitee_name: name.trim(),
          role,
          invited_by_user_id: userId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to create invite");
      }

      const data = await res.json();
      const url = data.invite_url;
      setInviteUrl(url);

      if (shareMethod === "whatsapp") {
        const message = `Hi! Join our PetOLife household to help care for our pets: ${url}`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
        onInviteCreated && onInviteCreated();
      } else {
        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => {
            onInviteCreated && onInviteCreated();
          }, 1500);
        } catch {
          // Fallback for older browsers
          const input = document.createElement("input");
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          setCopied(true);
          setTimeout(() => {
            onInviteCreated && onInviteCreated();
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Invite error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const waMessage = `Hi! Join our PetOLife household to help care for our pets: [invite link]`;

  return (
    <div className="invite-modal-overlay" onClick={onClose}>
      <div className="invite-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="invite-modal-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <h3 className="invite-modal-title">Invite Member</h3>
        </div>
        <p className="invite-modal-subtitle">
          They'll get access to all pets in your household.
        </p>

        {copied ? (
          <div className="invite-copied-toast">
            ✓ Invite link copied to clipboard!
          </div>
        ) : (
          <>
            {/* Name Field */}
            <label className="invite-field-label">Name</label>
            <input
              type="text"
              className="invite-text-input"
              placeholder="e.g. Sister"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              autoFocus
            />

            {/* Role Toggle */}
            <label className="invite-field-label">Role</label>
            <div className="invite-role-toggle">
              <button
                className={`invite-role-btn ${role === "family_member" ? "active" : ""}`}
                onClick={() => setRole("family_member")}
                type="button"
              >
                Family Member
              </button>
              <button
                className={`invite-role-btn ${role === "caregiver" ? "active" : ""}`}
                onClick={() => setRole("caregiver")}
                type="button"
              >
                Temporary Caregiver
              </button>
            </div>

            {/* Share Method */}
            <p className="invite-share-label">Send invite via</p>
            <div className="invite-share-methods">
              <button
                className={`invite-share-btn ${shareMethod === "whatsapp" ? "active" : ""}`}
                onClick={() => setShareMethod("whatsapp")}
                type="button"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </button>
              <button
                className={`invite-share-btn ${shareMethod === "link" ? "active" : ""}`}
                onClick={() => setShareMethod("link")}
                type="button"
              >
                <LinkIcon />
                <span>Copy Link</span>
              </button>
            </div>

            {/* WhatsApp Preview */}
            {shareMethod === "whatsapp" && (
              <div className="invite-wa-preview">
                <div className="invite-wa-preview-label">WhatsApp message</div>
                <p className="invite-wa-preview-text">{waMessage}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="invite-modal-actions">
              <button className="invite-cancel-btn" onClick={onClose} type="button">
                Cancel
              </button>
              <button
                className="invite-send-btn"
                onClick={handleSendInvite}
                disabled={!name.trim() || loading}
                type="button"
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
