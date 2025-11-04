import React, { useState, useEffect } from 'react';

const VisitBooking = () => {
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [myBookings, setMyBookings] = useState([]);

  const timeOptions = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM"
  ];

  /* -------------------------------------------------------------------------- */
  /* 📋 Fetch user's own bookings */
  /* -------------------------------------------------------------------------- */
  const fetchMyBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5001/api/visit-bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMyBookings(data);
    } catch (err) {
      console.error('Error fetching my bookings:', err);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🪴 Handle booking submission */
  /* -------------------------------------------------------------------------- */
  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setMessage('⚠️ Please login first');

    if (!visitDate || !timeSlot) {
      setMessage('⚠️ Please select a date and time slot');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/visit-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visit_date: visitDate, time_slot: timeSlot })
      });

      const data = await res.json();
      if (data.bookingId) {
        setMessage('✅ Visit booked successfully!');
        setVisitDate('');
        setTimeSlot('');
        fetchMyBookings(); // 🔄 Refresh user's bookings
      } else {
        setMessage(data.error || '❌ Booking failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundImage: 'url("http://localhost:5001/uploads/Visit.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Booking Form */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#2e7d32' }}>🌿 Book a Visit</h2>

        {message && (
          <p style={{
            marginBottom: '20px',
            color: message.includes('❌') || message.includes('⚠️') ? '#d32f2f' : '#388e3c',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}

        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="date"
            value={visitDate}
            onChange={e => setVisitDate(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          <select
            value={timeSlot}
            onChange={e => setTimeSlot(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          >
            <option value="">Select Time Slot</option>
            {timeOptions.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            Book Visit
          </button>
        </form>
      </div>

      {/* My Bookings Section */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>📋 My Bookings</h3>
        {myBookings.length === 0 ? (
          <p style={{ color: '#555' }}>No bookings yet.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                <th style={{ padding: '10px', borderBottom: '2px solid #c8e6c9' }}>Date</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #c8e6c9' }}>Time Slot</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #c8e6c9' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{b.visit_date}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{b.time_slot}</td>
                  <td style={{
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                    fontWeight: 'bold',
                    color: b.status === 'Approved' ? '#2e7d32'
                      : b.status === 'Denied' ? '#c62828'
                      : '#f9a825'
                  }}>
                    {b.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VisitBooking;
