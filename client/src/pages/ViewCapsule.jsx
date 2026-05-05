import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Lock, Mail, Tag, Image as ImageIcon, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const ViewCapsule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const { data } = await api.get(`/capsules/${id}`);
        setCapsule(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load capsule');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCapsule();
  }, [id, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] animate-pulse text-primary-600">Loading your memories...</div>;

  const isUnlocked = new Date(capsule.unlockDate) <= new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
        <img src={capsule.coverImage} alt={capsule.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-bold uppercase">
              {capsule.status}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {format(new Date(capsule.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">{capsule.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!isUnlocked && capsule.status === 'sealed' ? (
            <div className="glass p-12 text-center rounded-3xl space-y-6">
              <div className="inline-flex p-6 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <Lock className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold">This capsule is time-locked</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Content will be available on <br />
                <span className="text-slate-900 dark:text-white font-bold text-lg">
                  {format(new Date(capsule.unlockDate), 'PPPP p')}
                </span>
              </p>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl prose dark:prose-invert max-w-none shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: capsule.content }} />
              
              {capsule.media.length > 0 && (
                <div className="mt-12 space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <ImageIcon className="w-5 h-5" /> Attachments
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {capsule.media.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} alt="Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Recipients</h4>
              <div className="space-y-3">
                {capsule.recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                      {r.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{r.email}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery</h4>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="capitalize">{capsule.deliveryMode.replace('-', ' ')} notification</span>
              </div>
            </div>

            {capsule.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {capsule.tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCapsule;
