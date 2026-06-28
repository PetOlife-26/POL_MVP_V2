import React from "react";
import "./TimelinePage.css";
import TopNav from "../common/TopNav/TopNav";

export default function TimelinePage() {
  return (
    <div className="timeline-page">
      <TopNav />
      <div className="timeline-body">
        <div className="timeline-card">
          <div className="timeline-icon-wrap">
            <div className="timeline-pulse-ring"></div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0c6b3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <span className="timeline-badge">✨ Feature Preview</span>

          <h2 className="timeline-title">Pet Life Timeline</h2>
          <h3 className="timeline-status">Coming Soon!</h3>

          <p className="timeline-desc">
            We're building an interactive milestone timeline for your pet! Soon you'll be able to track growth milestones, memory galleries, vaccination histories, and special moments all in one chronological story.
          </p>

          <div className="timeline-features-preview">
            <div className="preview-feature-item">
              <span className="feat-dot"></span>
              <span>Growth & Weight Milestones</span>
            </div>
            <div className="preview-feature-item">
              <span className="feat-dot"></span>
              <span>Photo & Memory Gallery</span>
            </div>
            <div className="preview-feature-item">
              <span className="feat-dot"></span>
              <span>Life Event Highlights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
