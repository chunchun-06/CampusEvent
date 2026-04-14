import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => { setEvent(data); setLoading(false); })
      .catch(() => { toast.error('Event not found.'); navigate('/dashboard'); });

    // Check if already registered
    if (user) {
      api.get('/registrations/me').then(({ data }) => {
        setRegistered(data.some((r) => r.id === parseInt(id)));
      });
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    setRegistering(true);
    try {
      await api.post(`/events/${id}/register`);
      setRegistered(true);
      setShowQR(true);
      toast.success('Successfully registered!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const date = new Date(event.date);
  const formatted = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isFull = event.capacity && event.registration_count >= event.capacity;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-sm text-cyan-600 hover:underline mb-6 flex items-center gap-1">
          ← Back
        </button>

        <div className="card">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide bg-cyan-50 px-3 py-1 rounded-full">
                {event.type === 'department' ? '🎓 Department' : '🏆 Club'} · {event.source_name}
              </span>
              {event.status === 'approved' && (
                <span className="badge-approved">✓ Approved</span>
              )}
            </div>
            <h1 className="text-4xl font-serif-italic text-gray-900 leading-tight mb-2">{event.title}</h1>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Calendar size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="text-sm font-medium text-gray-800">{formatted}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Clock size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Time</p>
                <p className="text-sm font-medium text-gray-800">{time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Venue</p>
                <p className="text-sm font-medium text-gray-800">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Users size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Registrations</p>
                <p className="text-sm font-medium text-gray-800">
                  {event.registration_count} {event.capacity ? `/ ${event.capacity}` : ''} registered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="w-9 h-9 bg-cyan-100 rounded-xl flex items-center justify-center">
                <User size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Organizer</p>
                <p className="text-sm font-medium text-gray-800">{event.organizer_name}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About this event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Register Button */}
          {event.status === 'approved' && user?.role === 'student' && (
            <div>
              {registered ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <p className="text-emerald-700 font-semibold mb-3">✅ You're registered!</p>
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    {showQR ? 'Hide QR' : 'Show QR Code'}
                  </button>
                  {showQR && (
                    <div className="mt-4 flex justify-center">
                      <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block">
                        <QRCodeSVG
                          value={`CampusHub|Event:${event.id}|User:${user.id}|${event.title}`}
                          size={160}
                          fgColor="#0e7490"
                        />
                        <p className="text-xs text-gray-400 mt-2">{user.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : isFull ? (
                <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                  Event is Full
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {registering ? 'Registering...' : 'Register for this Event'}
                </button>
              )}
            </div>
          )}

          {!user && event.status === 'approved' && (
            <button onClick={() => navigate('/login')} className="btn-primary w-full">
              Login to Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
