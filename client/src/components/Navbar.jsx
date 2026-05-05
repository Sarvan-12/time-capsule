import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, PlusCircle, Inbox, LayoutDashboard, Clock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import NotificationBell from './NotificationBell';


const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Capsule', path: '/capsule/new', icon: PlusCircle },
    { name: 'Inbox', path: '/inbox', icon: Inbox },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-600 rounded-lg group-hover:rotate-12 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Capsule
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary-500'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800">

              <img
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-primary-500/20"
              />
              <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
