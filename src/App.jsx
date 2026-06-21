import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import "./App.css";

// Lazy-loaded routes
const Homepg = lazy(() => import("./components/homepg/Homepg"));
const ProfileCreate = lazy(
  () => import("./components/profilecreation/Profilecreation"),
);
const PostIdScreen = lazy(
  () => import("./components/postidscreen/postidscreen"),
);
const PetCard = lazy(() => import("./components/PetCard/PetCard"));

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        color: "#9ca3af",
      }}
    >
      Loading…
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Homepg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-pet-profile" element={<ProfileCreate />} />
          <Route path="/post-id-success" element={<PostIdScreen />} />
          <Route path="/pet-card" element={<PetCard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
