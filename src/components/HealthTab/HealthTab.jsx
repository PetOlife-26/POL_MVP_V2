import React from 'react';
import { Activity } from 'lucide-react';
import './HealthTab.css';

export default function HealthTab() {
  return (
    <div className="health-tab-container">
      <div className="health-coming-soon">
        <div className="health-icon-wrapper">
          <Activity size={48} color="white" strokeWidth={2} />
        </div>
        <h2 className="health-coming-title">Coming Soon</h2>
        <p className="health-coming-sub">
          Health tracking, vaccination records, and medical features are on the way. We're building something amazing for your pet's wellness!
        </p>
      </div>
    </div>
  );
}
