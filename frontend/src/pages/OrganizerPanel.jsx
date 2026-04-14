import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const cls = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
  return <span className={cls[status] || 'badge-pending'}>{status}</span>;
};

const OrganizerPanel = () => {
  const { user } = useAuth();
  const isPendingOrg = user?.role === 'pending_org';

  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // Auto-open club request form for pending_org users
  const [activeClubReq, setActiveClubReq] = useState(isPendingOrg);
  const [clubForm, setClubForm] = useState({ name: '', description: '' });
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '', type: 'club', ref_id: '', capacity: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/events/organizer'),
      api.get('/departments'),
      api.get('/clubs'),
    ]).then(([evts, depts, clbs]) => {
      setEvents(evts.data);
      setDepartments(depts.data);
      setClubs(clbs.data.filter(c => c.approved));
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, ref_id: parseInt(form.ref_id), capacity: form.capacity ? parseInt(form.capacity) : undefined };
      await api.post('/events', payload);
      toast.success('Event submitted for approval!');
      setShowForm(false);
      setForm({ title: '', description: '', date: '', venue: '', type: 'club', ref_id: '', capacity: '' });
      const { data } = await api.get('/events/organizer');
      setEvents(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestClub = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clubs', clubForm);
      toast.success('Club request submitted! Awaiting admin approval.');
      setActiveClubReq(false);
      setClubForm({ name: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    }
  };

  const refOptions = form.type === 'department' ? departments : clubs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-serif-italic text-gray-900">Organizer Panel</h1>
            <p className="text-gray-500 mt-1">Create and manage your events</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveClubReq(!activeClubReq)} className="btn-secondary text-sm">
              + Request Club
            </button>
            {!isPendingOrg && (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
                + Create Event
              </button>
            )}
          </div>
        </div>

        {/* Pending org status banner */}
        {isPendingOrg && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Account Pending Approval</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Your organizer account is awaiting admin approval. To get started, submit a <strong>Club Registration Request</strong> below.
                  Once the admin approves your club, your account will be upgraded to <strong>Organizer</strong> and you can post events.
                </p>
                <button
                  onClick={() => setActiveClubReq(true)}
                  className="mt-3 bg-amber-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Submit Club Request →
                </button>
              </div>
            </div>
          </div>
        )}


        {activeClubReq && (
          <div className="card mb-6 border-cyan-200">
            <h2 className="text-xl font-serif-italic mb-4 text-gray-800">Request a New Club</h2>
            <form onSubmit={handleRequestClub} className="space-y-4">
              <input
                type="text"
                placeholder="Club name"
                value={clubForm.name}
                onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="What is this club about?"
                value={clubForm.description}
                onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                rows={3}
                className="input-field resize-none"
                required
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" onClick={() => setActiveClubReq(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Create Event Form */}
        {showForm && (
          <div className="card mb-6 border-cyan-200">
            <h2 className="text-xl font-serif-italic mb-4 text-gray-800">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Event title" className="input-field" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the event..." className="input-field resize-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input name="venue" value={form.venue} onChange={handleChange} placeholder="Auditorium, Room 101..." className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, ref_id: '' })} className="input-field">
                  <option value="club">Club</option>
                  <option value="department">Department</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.type === 'department' ? 'Department' : 'Club'}
                </label>
                <select name="ref_id" value={form.ref_id} onChange={handleChange} className="input-field" required>
                  <option value="">Select {form.type}...</option>
                  {refOptions.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (optional)</label>
                <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Leave blank for unlimited" className="input-field" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <h2 className="text-xl font-serif-italic text-gray-800 mb-4">Your Events</h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📝</div>
            <p>No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={ev.status} />
                    <span className="text-xs text-gray-400">{ev.type} · {ev.source_name}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 font-serif-italic">{ev.title}</h3>
                  <p className="text-sm text-gray-500">{ev.venue} · {new Date(ev.date).toLocaleDateString('en-IN')}</p>
                  <p className="text-xs text-gray-400 mt-1">{ev.registration_count || 0} registrations</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerPanel;
