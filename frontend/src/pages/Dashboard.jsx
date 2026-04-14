import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    api.get('/departments').then(({ data }) => setDepartments(data));
    api.get('/clubs').then(({ data }) => setClubs(data));
  }, []);

  const handleSelect = async (id, type) => {
    setSelectedId(id);
    setLoadingEvents(true);
    try {
      const { data } = await api.get('/events', { params: { type, ref_id: id } });
      setEvents(data);
    } catch {
      toast.error('Failed to load events.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSelectedId(null);
    setLoadingEvents(true);
    try {
      const { data } = await api.get('/events', { params: { search } });
      setEvents(data);
    } catch {
      toast.error('Search failed.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const currentList = activeTab === 'departments' ? departments : clubs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif-italic text-gray-900">Explore Events</h1>
          <p className="text-gray-500 mt-1">Browse events by department or club</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1 max-w-md"
          />
          <button type="submit" className="btn-primary px-6">Search</button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setEvents([]); setSelectedId(null); }}
              className="btn-secondary px-4"
            >
              Clear
            </button>
          )}
        </form>

        {/* Toggle Tabs */}
        <div className="flex gap-2 mb-6">
          {['departments', 'clubs'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedId(null); setEvents([]); }}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-cyan-400'
              }`}
            >
              {tab === 'departments' ? '🎓 Departments' : '🏆 Clubs'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Dept/Club list */}
          <div className="lg:col-span-1">
            <div className="card p-3 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                {activeTab === 'departments' ? 'Departments' : 'Clubs'}
              </p>
              {currentList.length === 0 ? (
                <p className="text-sm text-gray-400 px-2 py-4">Nothing found.</p>
              ) : (
                currentList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id, activeTab === 'departments' ? 'department' : 'club')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      selectedId === item.id
                        ? 'bg-cyan-500 text-white font-medium'
                        : 'text-gray-700 hover:bg-cyan-50'
                    }`}
                  >
                    {item.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main: Events grid */}
          <div className="lg:col-span-3">
            {!selectedId && events.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg font-medium">Select a {activeTab === 'departments' ? 'department' : 'club'} to browse events</p>
              </div>
            ) : loadingEvents ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p>No events found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
