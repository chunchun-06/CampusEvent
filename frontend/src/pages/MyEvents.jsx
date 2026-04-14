import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/registrations/me')
      .then(({ data }) => setRegistrations(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif-italic text-gray-900">My Registrations</h1>
          <p className="text-gray-500 mt-1">Events you've signed up for</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-medium">No registrations yet</p>
            <p className="text-sm mt-1">Head to the dashboard to explore events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {registrations.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
