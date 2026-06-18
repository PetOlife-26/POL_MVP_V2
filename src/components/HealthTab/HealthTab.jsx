import React, { useEffect, useRef, useState } from 'react';
import timelineDemoImg from "../../assets/images/timeline_demo.jpeg";
import './HealthTab.css';

const PAW = [
  "M205.116,153.078c31.534,11.546,69.397-12.726,84.58-54.209c15.174-41.484,1.915-84.462-29.614-96.001c-31.541-11.53-69.4,12.735-84.582,54.218C160.325,98.57,173.584,141.548,205.116,153.078z",
  "M85.296,219.239c32.987-2.86,56.678-40.344,52.929-83.75c-3.757-43.391-33.545-76.253-66.532-73.409c-32.984,2.869-56.674,40.36-52.921,83.759C22.53,189.23,52.313,222.091,85.296,219.239z",
  "M342.196,217.768c28.952,17.017,70.552-0.073,92.926-38.154c22.374-38.106,17.041-82.758-11.915-99.774c-28.951-17.001-70.56,0.097-92.93,38.178C307.905,156.117,313.245,200.768,342.196,217.768z",
  "M497.259,262.912c-18.771-27.271-63.07-29.379-98.954-4.694c-35.892,24.701-49.762,66.822-30.996,94.101c18.766,27.27,63.069,29.38,98.954,4.686C502.143,332.312,516.021,290.191,497.259,262.912z",
  "M304.511,268.059c-3.58-24.773-18.766-47.366-43.039-58.824c-24.268-11.45-51.365-8.807-72.758,4.169c-23.646,14.35-38.772,33.096-59.138,41.29c-20.363,8.193-77.4-16.209-112.912,48.278c-25.081,45.548-2.057,103.128,44.962,125.315c35.738,16.864,64.023,14.981,84.788,24.774c20.762,9.793,37.29,32.83,73.025,49.692c47.018,22.188,106.1,3.362,125.315-44.957c27.206-68.407-27.897-96.922-34.522-117.85C303.613,319.021,308.472,295.426,304.511,268.059z"
];

const PAWS = [
  { t: 0.0,  cx: 0.13, cy: 0.78 },
  { t: 0.45, cx: 0.41, cy: 0.50 },
  { t: 0.90, cx: 0.71, cy: 0.22 },
];

const TOTAL = 3000;
const T_IN = 1.45, T_FULL = 1.85, T_FADE = 2.65, T_END = 3.00;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

let globalPawCache = {};

function makePaw(sz) {
  const oc = document.createElement('canvas');
  oc.width = sz; oc.height = sz;
  const ctx = oc.getContext('2d');
  ctx.scale(sz / 512, sz / 512);
  ctx.fillStyle = 'rgba(100,100,110,0.72)';
  PAW.forEach(d => ctx.fill(new Path2D(d)));
  return oc;
}

function getPaw(sz) {
  if (!globalPawCache[sz]) globalPawCache[sz] = makePaw(sz);
  return globalPawCache[sz];
}

export default function HealthTab() {
  const [showAnimation, setShowAnimation] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    let raf = null;
    let t0 = null;
    const canvas = canvasRef.current;
    
    if (!canvas || !showAnimation) return;

    const resize = () => {
      if (canvas && canvas.parentElement) {
        const r = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.round(r.width);
        canvas.height = Math.round(r.height);
        globalPawCache = {}; // Clear cache on resize since size changes
      }
    };
    
    resize();
    window.addEventListener('resize', resize);

    const draw = (sec) => {
      const W = canvas.width;
      const H = canvas.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);

      const SZ = Math.round(Math.min(W, H) * 0.25); // Adjusted size for mobile view layout
      const paw = getPaw(SZ);

      PAWS.forEach(p => {
        const el = sec - p.t;
        if (el < 0) return;
        const FADE = 0.30;
        let op, sc;
        if (el < FADE) {
          const prog = clamp(el / FADE, 0, 1);
          op = easeOutCubic(prog) * 0.42;
          sc = 0.6 + 0.4 * easeOutCubic(prog);
        } else {
          op = 0.42; sc = 1.0;
        }
        const cx = p.cx * W;
        const cy = p.cy * H;
        const s = SZ * sc;
        ctx.save();
        ctx.globalAlpha = op;
        ctx.drawImage(paw, cx - s / 2, cy - s / 2, s, s);
        ctx.restore();
      });

      if (sec < T_IN) return;

      let op;
      if (sec < T_FULL) {
        op = easeInOutCubic(clamp((sec - T_IN) / (T_FULL - T_IN), 0, 1));
      } else if (sec < T_FADE) {
        op = 1.0;
      } else {
        op = 1.0 - easeInOutCubic(clamp((sec - T_FADE) / (T_END - T_FADE), 0, 1));
      }
      op = clamp(op, 0, 1);
      if (op < 0.002) return;

      const cx = W / 2, cy = H / 2;
      const fs = Math.round(Math.min(W, H) * 0.08); // Responsive font size
      const ruleW = Math.round(W * 0.4); // Responsive rule width

      ctx.save();
      ctx.globalAlpha = op;

      ctx.fillStyle = 'rgba(18,18,22,0.28)';
      ctx.fillRect(cx - ruleW / 2, cy - fs * 0.88, ruleW, 0.75);

      ctx.fillStyle = 'rgba(18,18,22,1)';
      ctx.font = `300 ${fs}px "Georgia","Times New Roman",serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.letterSpacing = `${Math.round(W * 0.004)}px`;
      ctx.fillText('coming soon', cx, cy + fs * 0.08);

      ctx.fillStyle = 'rgba(18,18,22,0.28)';
      ctx.fillRect(cx - ruleW / 2, cy + fs * 0.30, ruleW, 0.75);

      ctx.restore();
    };

    const tick = (ts) => {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;
      const sec = Math.min(elapsed, TOTAL / 1000);
      
      draw(sec);
      
      if (elapsed < TOTAL / 1000) {
        raf = requestAnimationFrame(tick);
      } else {
        // Animation finished
        setShowAnimation(false);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [showAnimation]);

  return (
    <div className="health-tab-container">
      {/* Underlying Timeline Image */}
      <img 
        src={timelineDemoImg} 
        alt="Health Timeline Demo" 
        className="health-tab-image" 
      />

      {/* Animation Overlay */}
      {showAnimation && (
        <div className="health-animation-overlay">
          <canvas ref={canvasRef} className="health-canvas"></canvas>
        </div>
      )}
    </div>
  );
}
