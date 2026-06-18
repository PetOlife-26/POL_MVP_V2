import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoImg from "../../assets/logo.png";
import heroImg from "../../assets/login/hero.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Logo() {
  return (
    <div className="logo-wrap">
      <img src={logoImg} alt="PetOLife" className="logo-img" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" className="google-icon">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.2-11.3-7.7l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.4-4.5 5.8l6.2 5.2C36.9 37 44 32 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function BackBtn({ onClick }) {
  return (
    <button className="back-btn" onClick={onClick} aria-label="Go back">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  );
}

function SuccessScreen({ type, userName, onContinue }) {
  const isSignup = type === "signup";
  return (
    <div className="screen success-screen">
      <div className="success-icon-wrap">
        <div className="success-circle">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>
      <h2 className="success-title">
        {isSignup ? "Account Created!" : "Welcome Back!"}
      </h2>
      <p className="success-sub">
        {isSignup
          ? `Hey ${userName || "there"} 👋 Your PetOLife account is all set. Let's get started!`
          : `Great to see you again ${userName || ""}! Your pets are waiting for you.`}
      </p>
      <div className="success-badge">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#06402B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
        <span>PetOLife Member</span>
      </div>
      <button className="btn-primary success-btn" onClick={onContinue}>
        {isSignup ? "Go to Login" : "Continue to App"}
      </button>
    </div>
  );
}



function LoginScreen({ onSignUp, onSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const isEmail = identifier.includes("@");
      const payload = { password };
      if (isEmail) {
        payload.email = identifier;
      } else {
        payload.phone = identifier.replace(/\s+/g, '');
      }

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Login failed");
      // Store token
      if (data.access_token) localStorage.setItem("access_token", data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      onSuccess({ type: "login", name: data.user?.user_metadata?.full_name || identifier.split("@")[0] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Google login is not available yet.");
    }
  };

  return (
    <div className="screen auth-screen">
      <Logo />
      <div className="welcome-tagline">
        <span className="tagline-black">Building a Healthy<br />identity for </span>
        <span className="tagline-green"><em>every pet</em></span>
      </div>
      <div className="vet-badge">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#06402B"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
        <span>Built with Veterinary Insights</span>
      </div>
      <div className="hero-container" style={{ marginBottom: 20 }}>
        <img src={heroImg} alt="PetOLife App" className="hero-img" />
      </div>

      <h2 className="auth-title" style={{ marginTop: 0 }}>Login</h2>

      {error && <p className="auth-error">{error}</p>}

      <div className="form-group">
        <label>Email or Phone Number</label>
        <input type="text" placeholder="Enter your email or phone" value={identifier} onChange={e => setIdentifier(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Password</label>
        <div className="input-with-icon">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
            <EyeIcon open={showPass} />
          </button>
        </div>
      </div>

      <div className="forgot-row">
        <span className="link-green">Forgot Password?</span>
      </div>

      <button className="btn-primary" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in…" : "Login"}
      </button>

      <div className="or-divider"><span>OR</span></div>

      <button className="btn-google" onClick={handleGoogleLogin}>
        <GoogleIcon /> Continue with Google
      </button>

      <p className="auth-footer">
        New user?{" "}
        <span className="link-green" onClick={onSignUp}>Create Account</span>
      </p>
    </div>
  );
}

function SignupScreen({ onBack, onLogin, onSuccess }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: "", identifier: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSignup = async () => {
    if (!form.name || !form.password || !form.identifier) { setError("Please fill in required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    try {
      const isEmail = form.identifier.includes("@");
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? form.identifier : undefined,
          password: form.password,
          full_name: form.name,
          phone: !isEmail ? form.identifier.replace(/\s+/g, '') : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Signup failed");
      onSuccess({ type: "signup", name: form.name });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Google signup is not available yet.");
    }
  };

  return (
    <div className="screen auth-screen signup-screen">
      <BackBtn onClick={onBack} />
      <Logo />
      <h2 className="auth-title">Create Account</h2>

      {error && <p className="auth-error">{error}</p>}

      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your name" value={form.name} onChange={set("name")} />
      </div>
      <div className="form-group">
        <label>Email or Phone Number</label>
        <input type="text" placeholder="Enter your email or phone" value={form.identifier} onChange={set("identifier")} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <div className="input-with-icon">
          <input type={showPass ? "text" : "password"} placeholder="Create password" value={form.password} onChange={set("password")} />
          <button className="eye-btn" onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></button>
        </div>
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <div className="input-with-icon">
          <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={form.confirm} onChange={set("confirm")} />
          <button className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}><EyeIcon open={showConfirm} /></button>
        </div>
      </div>

      <button className="btn-primary" style={{ marginTop: 6 }} onClick={handleSignup} disabled={loading}>
        {loading ? "Creating Account…" : "Create Account"}
      </button>

      <div className="or-divider"><span>OR</span></div>

      <button className="btn-google" onClick={handleGoogleSignup}>
        <GoogleIcon /> Continue with Google
      </button>

      <p className="auth-footer" style={{ marginTop: 14 }}>
        Already have an account?{" "}
        <span className="link-green" onClick={onLogin}>Login</span>
      </p>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("login");
  const [successData, setSuccessData] = useState(null);

  const handleSuccess = (data) => {
    setSuccessData(data);
    setScreen("success");
  };

  const handleSuccessContinue = () => {
    if (successData?.type === "signup") {
      setScreen("login");
    } else {
      // Login success — go to home dashboard
      navigate("/home");
    }
    setSuccessData(null);
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {screen === "login" && (
          <LoginScreen
            onSignUp={() => setScreen("signup")}
            onSuccess={handleSuccess}
          />
        )}
        {screen === "signup" && (
          <SignupScreen
            onBack={() => setScreen("login")}
            onLogin={() => setScreen("login")}
            onSuccess={handleSuccess}
          />
        )}
        {screen === "success" && (
          <SuccessScreen
            type={successData?.type}
            userName={successData?.name}
            onContinue={handleSuccessContinue}
          />
        )}
      </div>
    </div>
  );
}
