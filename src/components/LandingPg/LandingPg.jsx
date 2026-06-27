// Homepg.jsx - Consolidated standalone component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPg.css"; // merged stylesheet

// ---------- Navbar ----------
import logo from "../../assets/logo.png";
const Navbar = ({ openModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'For Pet Parents', href: '#pet-parents' },
    { label: 'For Veterinarians', href: '#veterinarians' },
    { label: 'About PetOlife', href: '#about' },
  ];
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="#home" className="navbar-logo" aria-label="PetOlife Home">
            <img src={logo} alt="PetOlife" />
          </a>
          <nav className="navbar-nav" aria-label="Main navigation">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="navbar-cta">
            <button className="btn btn-primary" onClick={() => openModal('parent')}>Join Early Access</button>
          </div>
          <button
            className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      <div className={`navbar-mobile-overlay${menuOpen ? ' open' : ''}`} onClick={closeMenu}></div>
      <nav className={`navbar-mobile${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        {navLinks.map(link => (
          <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
        <button className="btn btn-primary" onClick={() => { closeMenu(); openModal('parent'); }}>Join Early Access</button>
      </nav>
    </>
  );
};

// ---------- Hero ----------
import heroPets from "../../assets/hero-pets.png";
const Hero = ({ openModal, onJoinPetParent }) => (
  <section id="home" className="hero">
    <div className="container hero-grid">

      {/* Left Side */}
      <div className="hero-content">
        <h1 className="hero-title">
          Building a Health Identity
          <br />
          for <span className="highlight">Every Pet</span>
        </h1>

        <p className="hero-description">
          Helping pet parents organize health records, track care routines,
          and stay connected with trusted veterinary care.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={onJoinPetParent}
          >
            Join as Pet Parent
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => openModal("vet")}
          >
            Join as Veterinarian
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-visual">
        <img
          src={heroPets}
          alt="Pet parent with pets"
          className="hero-image"
        />
      </div>

    </div>
  </section>
)
;

// ---------- Solution ----------
const problems = [
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/></svg>), label: 'Missed vaccines' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>), label: 'Paper records' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), label: 'WhatsApp chaos' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>), label: 'Lost prescriptions' },
];
const solutions = [
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>), label: 'Digital records' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>), label: 'Health timeline' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/></svg>), label: 'Smart reminders' },
  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>), label: 'Care continuity' },
];
const Solution = () => (
  <section id="pet-parents" className="section solution-section">
    <div className="container">
      <div className="solution-header">
        <h2 className="section-title">Pet care shouldn't depend on <span className="text-teal">memory</span>.</h2>
        <p className="section-subtitle">PetOlife brings scattered pet health information together in one place.</p>
      </div>
      <div className="solution-row">
        <div className="solution-side solution-side--problem">
          <span className="solution-badge solution-badge--problem">The Problem</span>
          <ul className="solution-list">
            {problems.map((item, idx) => (
              <li key={idx} className="solution-item solution-item--problem">
                <span className="solution-icon solution-icon--problem">{item.icon}</span>
                <span className="solution-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="solution-divider">
          <div className="solution-divider-line"></div>
          <div className="solution-divider-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
          <div className="solution-divider-line"></div>
        </div>
        <div className="solution-side solution-side--solution">
          <span className="solution-badge solution-badge--solution">PetOlife</span>
          <ul className="solution-list">
            {solutions.map((item, idx) => (
              <li key={idx} className="solution-item solution-item--solution">
                <span className="solution-icon solution-icon--solution">{item.icon}</span>
                <span className="solution-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// ---------- Workingprocess ----------
import profileImg from "../../assets/pet-profile.png";
import recordsImg from "../../assets/health-records.png";
import reminderImg from "../../assets/health-timeline.png";
const steps = [
  { id: "01", title: "Create Your Pet Profile", description: "Add your pet's basic details like name, breed, age, and medical information to get started.", image: profileImg },
  { id: "02", title: "Upload Health Records", description: "Store vaccination records, prescriptions, reports, and other important health documents securely.", image: recordsImg },
  { id: "03", title: "Get Reminders & Health Timeline", description: "Receive smart reminders and track your pet's complete healthcare journey in one place.", image: reminderImg },
];
const Workingprocess = () => (
  <section className="working-process">
    <div className="container">
      <div className="section-header">
        <span className="tag">🐾 3 steps to pet parenthood 😊</span>
        <h2><span className="dark">How</span> <span className="green">PetOlife Works</span></h2>
        <p>Keep your furry friends healthy with just three simple steps.</p>
      </div>
      <div className="process-grid">
        {steps.map(step => (
          <div className="process-card" key={step.id}>
            <div className="step-number">{step.id}</div>
            <div className="image-box"><img src={step.image} alt={step.title} /></div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
      <div className="bottom-banner"><span>💚</span><p>Smart reminders, secure records, and a lifelong health timeline — all in one place.</p></div>
    </div>
  </section>
);

// ---------- VetTimeline ----------
import prescription from "../../assets/vetconnect/prescription.svg";
import followup from "../../assets/vetconnect/followup.svg";
import history from "../../assets/vetconnect/history.svg";
import continuity from "../../assets/vetconnect/continuity.svg";
const vetSteps = [
  { image: prescription, title: "Digital Prescription" },
  { image: followup, title: "Better Follow-up" },
  { image: history, title: "Organized Patient History" },
  { image: continuity, title: "Treatment Continuity" },
];
const VetTimeline = () => (
  <section className="vetTimeline">
    <div className="container">
      <div className="timelineHeader">
        <h2><span className="dark">Built for</span><span className="green"> Better Veterinary Care</span></h2>
        <p>One connected workflow for smarter and continuous pet healthcare.</p>
      </div>
      <div className="timelineWrapper">
        <div className="timelineLine"></div>
        {vetSteps.map((item, index) => (
          <div className="timelineItem" key={index}>
            <div className="timelineCircle"><img src={item.image} alt={item.title} /></div>
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ---------- BeforeAfter ----------
import problemSolutionImg from "../../assets/problem-solution.jpeg";
const BeforeAfter = () => (
  <section className="section ba-section">
    <div className="container">
      <div className="ba-header">
        <h2 className="section-title">Struggling with <span className="text-teal">Pet Care</span>? <span className="text-green">Solution!</span></h2>
        <p className="section-subtitle">Bridging the gap between stressful pet care and happy companionship.</p>
      </div>
      <div className="ba-image-wrapper">
        <img src={problemSolutionImg} alt="Before and after PetOlife — from scattered pet care to organized health management" className="ba-image" />
      </div>
    </div>
  </section>
);

// ---------- Categories ----------
import firstImg from "../../assets/firstimg.png";
import thirdImg from "../../assets/thirdimg.png";
const petParentBenefits = ['Store health records','Track vaccines','Track medications','Receive reminders','Stay organized'];
const vetBenefits = ['Access complete history','Improve treatment continuity','Support follow-up care','Shape future workflows'];
const Categories = ({ openModal }) => (
  <section id="veterinarians" className="section categories-section">
    <div className="container">
      <div className="cat-header">
        <span className="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Who Is It For</span>
        <h2 className="section-title">Made for Every <span className="text-green">Pet Journey</span></h2>
        <p className="section-subtitle">Whether you're a dedicated pet parent or a practising veterinarian — PetOlife is built with you in mind.</p>
      </div>
      <div className="cat-grid">
        <div className="cat-card cat-card--parent">
          <div className="cat-card-content">
            <h3 className="cat-card-title">Built for Responsible Pet Parenting</h3>
            <ul className="cat-benefits">
              {petParentBenefits.map((item, idx) => (
                <li key={idx} className="cat-benefit"><span className="cat-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>{item}</li>
              ))}
            </ul>
            <button className="btn btn-primary cat-cta" onClick={() => openModal('parent')}>Join Early Access</button>
          </div>
          <div className="cat-card-visual"><img src={firstImg} alt="Pet health tracking and medical records interface" /></div>
        </div>
        <div className="cat-card cat-card--vet">
          <div className="cat-card-content">
            <h3 className="cat-card-title">Designed with Veterinary Feedback</h3>
            <ul className="cat-benefits">
              {vetBenefits.map((item, idx) => (
                <li key={idx} className="cat-benefit"><span className="cat-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>{item}</li>
              ))}
            </ul>
            <button className="btn btn-primary cat-cta" onClick={() => openModal('vet')}>Join Early Access</button>
          </div>
          <div className="cat-card-visual"><img src={thirdImg} alt="Breed guides, knowledge base, and veterinary advice interface" /></div>
        </div>
      </div>
      <p className="cat-note"><span className="cat-note-icon">🌱</span><strong>Planning to bring home your first pet?</strong> PetOlife will help you get started responsibly.</p>
    </div>
  </section>
);

// ---------- Trust ----------
const trustIndicators = [
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>), label: 'Veterinary Feedback', desc: 'Shaped by insights from practising veterinarians.' },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>), label: 'Real Clinic Learnings', desc: 'Built on real-world clinic workflows and challenges.' },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>), label: 'Pet Parent Community', desc: "Designed around real needs of responsible pet parents." },
  { icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), label: 'Privacy-Focused', desc: "Your pet's data stays secure and under your control." },
];
const Trust = ({ openModal }) => (
  <section id="about" className="section trust-section">
    <div className="container">
      <div className="trust-header">
        <span className="section-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Trust &amp; Credibility</span>
        <h2 className="section-title">Built with <span className="text-teal">Pet Parents</span>.<br/>Built with <span className="text-green">Veterinarians</span>.</h2>
        <p className="trust-mission">Building a Health Identity for Every Pet.</p>
      </div>
      <div className="trust-grid">
        {trustIndicators.map((item, idx) => (
          <div key={idx} className={`trust-card trust-card--${idx + 1}`}>
            <div className="trust-card-icon">{item.icon}</div>
            <h4 className="trust-card-label">{item.label}</h4>
            <p className="trust-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="trust-cta-block">
        <p className="trust-cta-text">Join the growing community of pet parents and veterinarians who are shaping the future of pet healthcare.</p>
        <div className="trust-cta-actions">
          <button className="btn btn-primary" onClick={() => openModal('parent')}>Join as Pet Parent</button>
          <button className="btn btn-secondary" onClick={() => openModal('vet')}>Join as Veterinarian</button>
        </div>
      </div>
    </div>
  </section>
);

// ---------- Footer ----------
import footerLogo from "../../assets/logo.png";
const Footer = () => {
  const companyLinks = [{ label: "About Us", href: "#about" },{ label: "Our Mission", href: "#home" },{ label: "Contact Us", href: "mailto:tech@petolife.com" }];
  const productLinks = [{ label: "How It Works", href: "#pet-parents" },{ label: "For Pet Parents", href: "#veterinarians" },{ label: "For Veterinarians", href: "#veterinarians" },{ label: "Trust & Mission", href: "#about" }];
  return (
    <footer className="footer">
      <div className="footer-wave"><svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="currentColor"/></svg></div>
      <div className="footer-body"><div className="container"><div className="footer-grid">
        <div className="footer-brand"><img src={footerLogo} alt="PetOlife" className="footer-logo" /><p className="footer-tagline">Building a Health Identity for Every Pet.</p></div>
        <div className="footer-column"><h4 className="footer-column-title">Company</h4><ul className="footer-links">{companyLinks.map((link, idx)=>(<li key={idx}><a href={link.href}>{link.label}</a></li>))}</ul></div>
        <div className="footer-column"><h4 className="footer-column-title">Follow Us</h4><div className="footer-socials">
          <a href="https://www.linkedin.com/company/petolife/" className="footer-social" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM0 8h5v16H0V8zm7.5 0h4.79v2.19h.07c.67-1.27 2.31-2.61 4.76-2.61 5.09 0 6.03 3.35 6.03 7.7V24h-5v-7.08c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.71 1.84-2.71 3.74V24h-5V8z"/></svg></a>
          <a href="#" className="footer-social" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
        </div><div className="footer-contact"><p>tech@petolife.com</p></div></div>
        <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} PetOlife. All rights reserved.</p><div className="footer-legal"><a href="#">Privacy Policy</a><span className="footer-divider">|</span><a href="#">Terms of Service</a><span className="footer-divider">|</span><a href="#">Cookie Policy</a></div></div>
      </div></div></div>
    </footer>
  );
};

// ---------- RegistrationModal ----------
import { submitPetParentForm, submitVetForm } from '../../api/endpoints';
const RegistrationModal = ({ isOpen, onClose, type, onRegisterSuccess }) => {
  const isVet = type === 'vet';
  const [vetData, setVetData] = useState({ doctorName: '', clinicName: '', mobile: '', email: '', city: '', earlyAccess: true });
  const [parentData, setParentData] = useState({ name: '', mobile: '', email: '', city: '', petType: '', hasPet: true, earlyAccess: true });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', ok: null });
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  useEffect(() => { if (isOpen) setStatus({ msg: '', ok: null }); }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ msg: '', ok: null });
    const res = isVet ? await submitVetForm(vetData) : await submitPetParentForm(parentData);
    setLoading(false);
    setStatus({ msg: res.message, ok: res.success });
    if (res.success && onRegisterSuccess) { onRegisterSuccess(type); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        <h3 className="modal-title">{isVet ? 'Veterinarian Interest Form' : 'Pet Parent Interest Form'}</h3>
        <p className="modal-subtitle">{isVet ? 'Join us to shape the future of pet healthcare.' : "Join early to organize your pet's health identity."}</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          {isVet ? (
            <> {/* Vet fields */}
              <div className="form-group"><label>Doctor Name</label><input type="text" placeholder="Dr. Akash Jha" required value={vetData.doctorName} onChange={e=>setVetData({...vetData, doctorName:e.target.value})} /></div>
              <div className="form-group"><label>Clinic Name</label><input type="text" placeholder="Happy Pets Clinic" required value={vetData.clinicName} onChange={e=>setVetData({...vetData, clinicName:e.target.value})} /></div>
              <div className="form-group"><label>Mobile Number</label><input type="tel" placeholder="+91 XXXXX XXXXX" required value={vetData.mobile} onChange={e=>setVetData({...vetData, mobile:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="akash@happypets.com" required value={vetData.email} onChange={e=>setVetData({...vetData, email:e.target.value})} /></div>
              <div className="form-group"><label>City</label><input type="text" placeholder="e.g., Chennai" required value={vetData.city} onChange={e=>setVetData({...vetData, city:e.target.value})} /></div>
              <div className="form-checkbox"><input type="checkbox" id="vet-early" checked={vetData.earlyAccess} onChange={e=>setVetData({...vetData, earlyAccess:e.target.checked})} /><label htmlFor="vet-early">Interested in Early Access?</label></div>
            </>
          ) : (
            <> {/* Parent fields */}
              <div className="form-group"><label>Name</label><input type="text" placeholder="Ram Charan" required value={parentData.name} onChange={e=>setParentData({...parentData, name:e.target.value})} /></div>
              <div className="form-group"><label>Mobile Number</label><input type="tel" placeholder="+91 XXXXX XXXXX" required value={parentData.mobile} onChange={e=>setParentData({...parentData, mobile:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="ram@example.com" required value={parentData.email} onChange={e=>setParentData({...parentData, email:e.target.value})} /></div>
              <div className="form-group"><label>City</label><input type="text" placeholder="e.g., Chennai" required value={parentData.city} onChange={e=>setParentData({...parentData, city:e.target.value})} /></div>
              <div className="form-group"><label>Pet Type</label><div className="pet-type-pills">{['dog','cat','other'].map(pet=>(<label className="pet-pill" key={pet}><input type="radio" name="petType" value={pet} required checked={parentData.petType===pet} onChange={e=>setParentData({...parentData, petType:e.target.value})} /><span>{pet.charAt(0).toUpperCase()+pet.slice(1)}</span></label>))}</div></div>
              <div className="form-checkbox"><input type="checkbox" id="parent-have-pet" checked={parentData.hasPet} onChange={e=>setParentData({...parentData, hasPet:e.target.checked})} /><label htmlFor="parent-have-pet">Already Have a Pet?</label></div>
              <div className="form-checkbox"><input type="checkbox" id="parent-early" checked={parentData.earlyAccess} onChange={e=>setParentData({...parentData, earlyAccess:e.target.checked})} /><label htmlFor="parent-early">Interested in Early Access?</label></div>
            </>
          )}
          {status.msg && (<p style={{ textAlign: 'center', fontSize: '0.875rem', color: status.ok ? 'var(--color-teal)' : '#e53e3e', margin: '0' }}>{status.msg}</p>) }
          <button type="submit" className="btn btn-primary modal-submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
};

// ---------- ThankYouModal ----------
const ThankYouModal = ({ isOpen, onClose, type }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { onClose(); }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const isVet = type === 'vet';
  return (
    <div className="thank-overlay"><div className="thank-modal"><button className="close-btn" onClick={onClose}>×</button>
      <div className="success-icon">{isVet ? "🩺" : "🐾"}</div>
      <h2>{isVet ? "Thank You for Joining VetConnect!" : "Welcome to the PetOlife Family!"}</h2>
      <h4>Your registration has been received.</h4>
      <div className="status-list"><p>✅ Our team will review your details.</p><p>✅ You'll receive updates as we move closer to launch.</p><p>✅ Stay connected and follow our journey.</p></div>
      <div className="social-buttons"><a href="https://www.instagram.com/petolife.care/" target="_blank">📸 Follow Instagram</a> <a href="https://www.linkedin.com/company/petolife/" target="_blank">💼 Follow LinkedIn</a></div>
      <button className="home-btn" onClick={onClose}>Return Home</button>
    </div></div>
  );
};

// ---------- Main Homepg Component ----------
function LandingPg() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('parent');
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankType, setThankType] = useState('parent');
  const openModal = (type) => { setModalType(type); setModalOpen(true); };
  const handleRegisterSuccess = (type) => { setModalOpen(false); setThankType(type); setShowThankYou(true); };
  const handleJoinPetParent = () => navigate('/login');
  return (
    <>
      <Navbar openModal={openModal} />
      <main>
        <Hero openModal={openModal} onJoinPetParent={handleJoinPetParent} />
        <Solution />
        <Workingprocess />
        <VetTimeline />
        <BeforeAfter />
        <Categories openModal={openModal} />
        <Trust openModal={openModal} />
      </main>
      <Footer />
      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} onRegisterSuccess={handleRegisterSuccess} />
      <ThankYouModal isOpen={showThankYou} type={thankType} onClose={() => setShowThankYou(false)} />
    </>
  );
}

export default LandingPg;
