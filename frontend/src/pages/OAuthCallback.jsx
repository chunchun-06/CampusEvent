import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        login(token, { id: user.id, name: user.name, email: user.email, role: user.role });
        toast.success(`Welcome, ${user.name}!`);
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'organizer') navigate('/organizer');
        else navigate('/dashboard');
      } catch {
        toast.error('OAuth login failed.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
