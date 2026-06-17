import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartAnimation.css';
import logoSvgRaw from '../../assets/POL_logo.svg?raw';

export default function StartAnimation() {
  const navigate = useNavigate();

  useEffect(() => {
    // Sequence is 4 seconds. After it finishes, navigate to login
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="startup-container" 
      dangerouslySetInnerHTML={{ __html: logoSvgRaw }} 
    />
  );
}
