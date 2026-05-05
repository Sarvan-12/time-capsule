import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
      setUnreadCount(data.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every min
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error('Error marking as read');
    }
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      toast.error('Error deleting notification');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold">Notifications</h3>
              <span className="text-xs text-slate-500">{unreadCount} unread</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map((n) => (
                    <div key={n._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <p className="text-sm text-slate-800 dark:text-slate-200 mb-2">{n.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          {!n.isRead && (
                            <button onClick={() => markAsRead(n._id)} className="p-1 hover:text-emerald-500" title="Mark as read">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteNotif(n._id)} className="p-1 hover:text-red-500" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
