import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2, Archive, Lock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CapsuleCard from '../components/CapsuleCard';

const Dashboard = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const { data } = await api.get('/capsules');
        setCapsules(data.data);
      } catch (error) {
        console.error('Failed to fetch capsules', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCapsules();
  }, []);

  const filteredCapsules = capsules.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { name: 'Total Capsules', value: capsules.length, icon: Archive, color: 'text-blue-500' },
    { name: 'Sealed', value: capsules.filter(c => c.status === 'sealed').length, icon: Lock, color: 'text-amber-500' },
    { name: 'Delivered', value: capsules.filter(c => c.status === 'delivered').length, icon: Send, color: 'text-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Capsules</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your future messages and memories</p>
        </div>
        <Link to="/capsule/new" className="btn-primary flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search capsules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Grid */}
      {filteredCapsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <CapsuleCard key={capsule._id} capsule={capsule} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl">
          <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Archive className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No capsules found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Start by creating your very first digital time capsule.</p>
          <Link to="/capsule/new" className="text-primary-600 font-medium hover:underline">
            Create Capsule &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
