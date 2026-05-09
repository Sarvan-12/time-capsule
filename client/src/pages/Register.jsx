import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] glass p-10 stagger-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">Join Us</h1>
          <p className="text-white/45 mt-3 font-medium">Start capturing your future today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
              <input
                type="text"
                name="name"
                className="w-full glass-input pl-12"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
              <input
                type="email"
                name="email"
                className="w-full glass-input pl-12"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
                <input
                  type="password"
                  name="password"
                  className="w-full glass-input pl-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full glass-input pl-12"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary w-full flex items-center justify-center gap-3 py-3.5 mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="font-bold tracking-wide">Create Account</span>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-sm font-medium text-white/30">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-purple hover:text-white transition-colors font-bold underline underline-offset-4 decoration-accent-purple/30">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
