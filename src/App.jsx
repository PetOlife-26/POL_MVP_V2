import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Lazy-loaded routes
const LandingPg = lazy(() => import("./components/LandingPg/LandingPg"));
const MainLayout = lazy(() => import("./components/MainLayout/MainLayout"));
const ProfileCreate = lazy(() => import("./components/ProfileCreation/ProfileCreation/ProfileCreation"));
const PetCard = lazy(() => import("./components/petcard/petcard"));
const ResetPassword = lazy(() => import("./components/Login/ResetPassword"));

function LoadingFallback() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#9ca3af" }}>
      Loading…
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pet/:id" element={<PetCard />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<MainLayout />} />
            <Route path="/create-pet-profile" element={<ProfileCreate />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
