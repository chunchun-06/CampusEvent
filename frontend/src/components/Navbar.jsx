import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLinks = {
    admin: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/admin', label: 'Admin Panel' },
    ],
    organizer: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/organizer', label: 'My Events' },
    ],
    student: [
      { to: '/dashboard', label: 'Explore' },
      { to: '/my-events', label: 'My Registrations' },
    ],
    pending_org: [
      { to: '/dashboard', label: 'Explore' },
      { to: '/organizer', label: 'Register Club ⏳' },
    ],
  };

  const links = user ? (roleLinks[user.role] || roleLinks.student) : [];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="text-xl font-serif-italic text-gray-800">CampusHub</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-gray-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-cyan-600 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
