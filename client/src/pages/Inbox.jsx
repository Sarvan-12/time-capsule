import { useState, useEffect } from 'react';
import { Inbox as InboxIcon, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CapsuleCard from '../components/CapsuleCard';

const Inbox = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const { data } = await api.get('/capsules/inbox');
        setCapsules(data.data);
      } catch (error) {
        console.error('Failed to fetch inbox', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inbox</h1>
        <p className="text-slate-500 dark:text-slate-400">Messages sent to you from the past</p>
      </div>

      {capsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <CapsuleCard key={capsule._id} capsule={capsule} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl">
          <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <InboxIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your inbox is empty</h3>
          <p className="text-slate-500 dark:text-slate-400">You haven't received any capsules yet.</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
