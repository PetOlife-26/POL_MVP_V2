import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './postidscreen.css';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  PawPrint,
  Heart,
  ShieldCheck,
  UserPlus,
  Home,
  FilePlus2,
  ChevronRight,
  Share2,
  Copy,
  MessageCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function PostIdScreen({ inlineData }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const dataToUse = inlineData || location.state || {};

  const {
    petName = 'Pet',
    petolifeId = 'ID',
    petPhotoUrl = '',
    petProfileId = '',
  } = dataToUse;

  const qrValue = `${window.location.origin}/api/pet-profile/by-petolife-id/${encodeURIComponent(petolifeId)}`;
  const shareUrl = `${window.location.origin}/pet/${encodeURIComponent(petolifeId)}`;
  const shareText = `Try petolife and see my pet card: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${petName}'s Pet Card`,
        text: `Try petolife and see my pet card`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Deterministic pseudo-random confetti layout
  const useConfetti = (count = 26) => {
    return useMemo(() => {
      const colors = ['var(--gold)', 'var(--gold-soft)', 'var(--green-500)', '#cfe9d6'];
      let seed = 42;
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${rand() * 100}%`,
        delay: `${(rand() * 4).toFixed(2)}s`,
        duration: `${(5 + rand() * 4).toFixed(2)}s`,
        size: `${6 + Math.round(rand() * 8)}px`,
        color: colors[i % colors.length],
        rotate: `${Math.round(rand() * 360)}deg`,
        shape: i % 3 === 0 ? '50%' : '2px',
      }));
    }, [count]);
  };

  const ConfettiLayer = () => {
    const pieces = useConfetti();
    return (
      <div className="confetti-layer" aria-hidden="true">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.shape,
              '--rot': p.rotate,
            }}
          />
        ))}
      </div>
    );
  };

  const PawWatermarks = () => {
    const positions = [
      { top: '8%', left: '6%', size: 34, rotate: -18 },
      { top: '20%', right: '8%', size: 46, rotate: 14 },
      { top: '46%', left: '3%', size: 28, rotate: 8 },
      { bottom: '14%', right: '4%', size: 38, rotate: -10 },
      { bottom: '4%', left: '10%', size: 30, rotate: 20 },
    ];
    return (
      <div className="paw-watermarks" aria-hidden="true">
        {positions.map((pos, i) => (
          <PawPrint key={i} className="paw-watermark" style={{ ...pos, width: pos.size, height: pos.size }} />
        ))}
      </div>
    );
  };

  const ActionButton = ({ tone, icon, label, onClick }) => (
    <button type="button" className={`action action-${tone}`} onClick={onClick}>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
      <span className="action-chevron">
        <ChevronRight size={16} strokeWidth={2.5} />
      </span>
    </button>
  );

  // If no data at all, redirect to home
  if (!inlineData && !location.state) {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '1rem' }}>No pet data found.</p>
        <button
          type="button"
          className="action action-primary"
          style={{ maxWidth: 260, marginTop: 16 }}
          onClick={() => navigate('/home')}
        >
          <span className="action-label">Go to Home</span>
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <ConfettiLayer />
      <PawWatermarks />
      <header className="postid-hero">
        <div className="check-badge">
          <Check size={30} strokeWidth={3} color="var(--green-700)" />
        </div>
        <div className="avatars">
          <div className="avatar avatar-dog" style={{ animationDelay: '0.15s' }}>
            <div className="avatar-ring">
              {petPhotoUrl ? (
                <img className="avatar-photo" src={petPhotoUrl} alt={petName} loading="lazy" />
              ) : (
                <PawPrint size={48} color="var(--cream)" style={{ opacity: 0.5 }} />
              )}
            </div>
            <span className="avatar-charm">
              <PawPrint size={14} />
            </span>
          </div>
        </div>
      </header>
      <main className="id-card" role="status" aria-live="polite">
        <h1 className="title">Pet Health ID Created</h1>
        <p className="ribbon">
          <PawPrint size={15} />
          <span>
            <strong>{petName}</strong> is now part of PetoLife
          </span>
          <Heart size={15} />
        </p>
        <div className="id-panel">
          <div className="id-info">
            <div className="id-label">
              <PawPrint size={12} />
              <span>PET ID</span>
              <PawPrint size={12} />
            </div>
            <div className="id-number">{petolifeId}</div>
            <div className="id-divider" />
            <ShieldCheck size={20} color="var(--green-600)" />
          </div>
          <div className="id-qr">
            <div className="qr-frame">
              <QRCodeSVG value={qrValue} size={120} bgColor="transparent" fgColor="var(--ink)" level="M" />
            </div>
            <span className="qr-tag">Scan to view ID</span>
          </div>
        </div>
      </main>
      <nav className="actions" aria-label="Next steps">
        <ActionButton
          tone="primary"
          icon={<UserPlus size={18} strokeWidth={2.2} />}
          label="Invite Family Member"
          onClick={() => setShowShareModal(true)}
        />
        <ActionButton
          tone="secondary"
          icon={<Home size={18} strokeWidth={2.2} />}
          label="Go to Home"
          onClick={() => navigate('/home')}
        />
        <ActionButton
          tone="secondary"
          icon={<FilePlus2 size={18} strokeWidth={2.2} />}
          label="Upload Medical Records"
          onClick={() => navigate('/home', { state: { tab: 'medicalrecords' } })}
        />
      </nav>

      {/* SHARE / INVITE FAMILY MODAL */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-header">
              <h3>Invite & Share Pet Card</h3>
              <button type="button" className="share-close" onClick={() => setShowShareModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p className="share-sub">Share {petName}'s pet card with family or friends!</p>

            <div className="share-text-box">
              <span>{shareText}</span>
            </div>

            <div className="share-options">
              <button type="button" className="share-opt-btn whatsapp" onClick={handleWhatsApp}>
                <MessageCircle size={20} />
                <span>Send to WhatsApp</span>
              </button>

              <button type="button" className="share-opt-btn copy" onClick={handleCopy}>
                {copied ? <CheckCircle2 size={20} color="#0c6b3a" /> : <Copy size={20} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text & Link'}</span>
              </button>

              {navigator.share && (
                <button type="button" className="share-opt-btn native" onClick={handleNativeShare}>
                  <Share2 size={20} />
                  <span>Share via Apps</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
