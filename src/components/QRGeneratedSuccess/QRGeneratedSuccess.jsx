import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaDownload, FaShareAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { generateQR, generateQRDataURL } from "../../services/QRService";
import "./QRGeneratedSuccess.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const QrGeneratedSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Destructure IDs passed via router state from CreatePetProfile
  const { petolifeId, petProfileId, petName, petType } = location.state || {};

  // qrStatus: "loading" | "success" | "error"
  const [qrStatus, setQrStatus] = useState("loading");
  const [qrError, setQrError] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // If no petolifeId was passed from the previous page, we can't generate the QR.
    if (!petolifeId) {
      setQrStatus("error");
      setQrError("No PetOLife ID was received. Please go back and create a pet profile first.");
      return;
    }

    // Build the resolver URL that the backend expects
    const resolverUrl = `${API_BASE}/api/pet-profile/by-petolife-id/${encodeURIComponent(petolifeId)}`;
    setQrUrl(resolverUrl);

    const renderQR = async () => {
      try {
        setQrStatus("loading");

        // Small delay so canvas transitions to visible before drawing
        await new Promise((r) => setTimeout(r, 50));

        if (!canvasRef.current) throw new Error("Canvas element is not available.");

        // Always go through QRService — never call QRCode.toCanvas directly
        await generateQR(canvasRef.current, resolverUrl);

        setQrStatus("success");
      } catch (err) {
        console.error("QR generation error:", err);
        setQrStatus("error");
        setQrError(err.message || "Failed to generate QR code.");
      }
    };

    renderQR();
  }, [petolifeId]);

  const handleDownload = async () => {
    if (!qrUrl || qrStatus !== "success") return;

    setIsDownloading(true);
    try {
      const dataUrl = await generateQRDataURL(qrUrl);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `PetOLife-QR-${petolifeId || "code"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("QR download error:", err);
      alert("Failed to download QR code. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!qrUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petName || "Pet"}'s PetOLife Profile`,
          text: `Scan this QR code to view ${petName || "the pet"}'s full profile.`,
          url: qrUrl,
        });
      } catch {
        // User dismissed the share sheet — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(qrUrl);
        alert("Profile link copied to clipboard!");
      } catch {
        alert("Sharing is not supported on this browser.");
      }
    }
  };

  return (
    <div className="qr-success-page">
      <div className="qr-success-popup">
        <button className="popup-close-btn" onClick={() => navigate(-1)}>
          ✕
        </button>

        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h2 className="stagger-1">QR Code Generated Successfully</h2>

        <p className="stagger-1">
          {petName
            ? `${petName}'s profile has been created.`
            : "Your pet profile has been created successfully."}
        </p>

        {petolifeId && (
          <div className="petolife-id-badge stagger-2">
            <span className="id-label">PetOLife ID</span>
            <span className="id-value">{petolifeId}</span>
          </div>
        )}


        <div className="qr-preview stagger-3">
          {qrStatus === "loading" && (
            <div className="qr-loading">
              <div className="qr-spinner"></div>
              <span>Generating QR Code…</span>
            </div>
          )}

          {qrStatus === "error" && (
            <div className="qr-error-box">
              <FaExclamationTriangle />
              <p>{qrError}</p>
              {petolifeId && (
                <button
                  className="qr-retry-btn"
                  onClick={() => {
                    setQrStatus("loading");
                    setQrError("");
                    generateQR(canvasRef.current, qrUrl)
                      .then(() => setQrStatus("success"))
                      .catch((e) => {
                        setQrStatus("error");
                        setQrError(e.message);
                      });
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Canvas stays in DOM at all times so canvasRef is always valid */}
          <canvas
            ref={canvasRef}
            className={`qr-canvas ${qrStatus === "success" ? "visible" : "hidden"}`}
          />
        </div>

        <div className="qr-actions-row stagger-4">
          <button
            className={`action-field ${qrStatus !== "success" || isDownloading ? "disabled" : ""}`}
            onClick={handleDownload}
            disabled={qrStatus !== "success" || isDownloading}
          >
            <FaDownload />
            <span>{isDownloading ? "Downloading…" : "Download QR"}</span>
          </button>

          <button
            className={`action-field ${qrStatus !== "success" ? "disabled" : ""}`}
            onClick={handleShare}
            disabled={qrStatus !== "success"}
          >
            <FaShareAlt />
            <span>Share QR</span>
          </button>
        </div>

        <button
          className="care-team-btn stagger-5"
          onClick={() => navigate("/home")}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QrGeneratedSuccess;
