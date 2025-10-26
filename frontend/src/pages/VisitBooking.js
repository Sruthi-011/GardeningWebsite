import React, { useState } from 'react';

const VisitBooking = () => {
    const [visitDate, setVisitDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [message, setMessage] = useState('');

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
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("http://localhost:5001/uploads/Visit.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            fontFamily: 'Arial, sans-serif',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                textAlign: 'center'
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
                            transition: '0.3s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#4CAF50'}
                        onBlur={e => e.target.style.borderColor = '#ccc'}
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
                            transition: '0.3s'
                        }}
                        onFocus={e => e.target.style.borderColor = '#4CAF50'}
                        onBlur={e => e.target.style.borderColor = '#ccc'}
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
                            padding: '12px 0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                        onMouseOver={e => {
                            e.target.style.backgroundColor = '#45a049';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={e => {
                            e.target.style.backgroundColor = '#4CAF50';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        Book Visit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisitBooking;
