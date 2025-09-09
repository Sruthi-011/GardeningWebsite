import React, { useState } from 'react';

const VisitBooking = () => {
    const [visitDate, setVisitDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [message, setMessage] = useState('');

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return setMessage('Please login first');

        if (!visitDate || !timeSlot) {
            setMessage('Please select a date and time slot');
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
            } else {
                setMessage(data.error || '❌ Booking failed');
            }
        } catch (err) {
            console.log(err);
            setMessage('❌ Server error. Please try again.');
        }
    };

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '20px' }}>Book a Visit 🌿</h2>
            {message && <p style={{ marginBottom: '15px', color: message.includes('❌') ? 'red' : 'green' }}>{message}</p>}
            <form onSubmit={handleBooking} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '400px',
                gap: '15px',
                backgroundColor: '#f7f7f7',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <input 
                    type="date" 
                    value={visitDate} 
                    onChange={e => setVisitDate(e.target.value)} 
                    required 
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%'
                    }}
                />
                <select 
                    value={timeSlot} 
                    onChange={e => setTimeSlot(e.target.value)} 
                    required
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%'
                    }}
                >
                    <option value="">Select Time Slot</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                    <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                </select>
                <button 
                    type="submit" 
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Book Visit
                </button>
            </form>
        </div>
    );
};

export default VisitBooking;
