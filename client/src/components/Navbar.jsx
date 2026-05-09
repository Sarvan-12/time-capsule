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
    <nav className="sticky top-0 z-50 bg-navy-base/60 backdrop-blur-[30px] border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="p-2 bg-accent-purple/20 border border-accent-purple/30 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Clock className="w-6 h-6 text-accent-purple" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Capsule
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'text-accent-purple' : ''}`} />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="flex items-center gap-3 px-4 py-1.5 glass bg-white/5 border-white/10 rounded-full">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=7850ff&color=fff`}
                alt="Profile"
                className="w-7 h-7 rounded-full border border-white/20"
              />
              <span className="hidden sm:inline text-sm font-semibold text-white/90">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-white/45 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
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
