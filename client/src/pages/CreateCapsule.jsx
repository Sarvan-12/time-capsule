import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Lock, ArrowLeft, Plus, X, Calendar as CalendarIcon, UserPlus, Image as ImageIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import RichTextEditor from '../components/RichTextEditor';
import MediaUploader from '../components/MediaUploader';

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [capsuleId, setCapsuleId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&q=80&w=800',
    unlockDate: new Date(Date.now() + 86400000 * 7), // Default 1 week
    deliveryMode: 'in-app',
    privacy: 'private',
    recipients: [{ email: '' }],
    media: [],
  });

  const handleRecipientChange = (index, value) => {
    const newRecipients = [...formData.recipients];
    newRecipients[index].email = value;
    setFormData({ ...formData, recipients: newRecipients });
  };

  const addRecipient = () => {
    setFormData({ ...formData, recipients: [...formData.recipients, { email: '' }] });
  };

  const removeRecipient = (index) => {
    const newRecipients = formData.recipients.filter((_, i) => i !== index);
    setFormData({ ...formData, recipients: newRecipients });
  };

  const saveDraft = async () => {
    if (!formData.title) return toast.error('Title is required');
    setLoading(true);
    try {
      if (capsuleId) {
        await api.put(`/capsules/${capsuleId}`, formData);
        toast.success('Draft updated');
      } else {
        const { data } = await api.post('/capsules', formData);
        setCapsuleId(data.data._id);
        toast.success('Draft saved');
      }
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSeal = async () => {
    if (!formData.title || !formData.content) {
      return toast.error('Title and Content are required to seal');
    }
    
    setLoading(true);
    try {
      let id = capsuleId;
      if (!id) {
        const { data } = await api.post('/capsules', formData);
        id = data.data._id;
      } else {
        await api.put(`/capsules/${id}`, formData);
      }
      
      await api.post(`/capsules/${id}/seal`);
      toast.success('Capsule sealed and time-locked! 🕰️');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to seal capsule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button onClick={saveDraft} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors font-medium">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button onClick={handleSeal} disabled={loading} className="btn-primary flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Seal Capsule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor & Media */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <input
              type="text"
              placeholder="Give your capsule a title..."
              className="text-3xl font-bold bg-transparent border-none outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-700"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary-500" />
              Media Attachments
            </h3>
            <MediaUploader 
              capsuleId={capsuleId} 
              onUploadComplete={(media) => setFormData({ ...formData, media })} 
            />
            {formData.media.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {formData.media.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                    <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Unlock Date
              </label>
              <DatePicker
                selected={formData.unlockDate}
                onChange={(date) => setFormData({ ...formData, unlockDate: date })}
                minDate={new Date()}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                className="input-field"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Privacy</label>
              <div className="flex gap-2">
                {['private', 'shared', 'public'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFormData({ ...formData, privacy: p })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                      formData.privacy === p 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block flex items-center justify-between">
                Recipients
                <button onClick={addRecipient} className="p-1 hover:bg-primary-100 rounded text-primary-600">
                  <Plus className="w-4 h-4" />
                </button>
              </label>
              <div className="space-y-2">
                {formData.recipients.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="relative flex-1">
                      <UserPlus className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        className="input-field pl-8 py-1.5 text-sm"
                        placeholder="email@example.com"
                        value={r.email}
                        onChange={(e) => handleRecipientChange(i, e.target.value)}
                      />
                    </div>
                    {formData.recipients.length > 1 && (
                      <button onClick={() => removeRecipient(i)} className="text-slate-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Delivery Mode</label>
              <select
                className="input-field py-1.5 text-sm"
                value={formData.deliveryMode}
                onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value })}
              >
                <option value="in-app">In-App Only</option>
                <option value="email">Email Only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCapsule;
