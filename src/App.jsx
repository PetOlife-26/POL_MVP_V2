import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import StartAnimation from './components/startanimation/StartAnimation';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import './App.css';

// Lazy-load these — they have asset dependencies that may not exist yet
const CreatePetProfile = lazy(() => import('./components/CreatePetProfile/CreatePetProfile'));
const QRGeneratedSuccess = lazy(() => import('./components/QRGeneratedSuccess/QRGeneratedSuccess'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#9ca3af' }}>
      Loading…
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<StartAnimation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-pet-profile" element={<CreatePetProfile />} />
          <Route path="/qr-success" element={<QRGeneratedSuccess />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
