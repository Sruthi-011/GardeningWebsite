import React, { useState } from 'react';

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login to submit a review');

        try {
            const res = await fetch('http://localhost:5001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId, rating, comment }),
            });

            const data = await res.json();
            if (data.message) {
                setMessage('✅ Review submitted!');
                setRating(5);
                setComment('');
                onReviewAdded(); 
            } else {
                setMessage('❌ Failed to submit review');
            }
        } catch (err) {
            console.log(err);
            setMessage('❌ Server error');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <h3>Leave a Review 🌿</h3>
            <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[5,4,3,2,1].map(star => (
                        <option key={star} value={star}>{star}</option>
                    ))}
                </select>
            </label>
            <br /><br />
            <textarea
                placeholder="Your comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
            />
            <br /><br />
            <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '5px' }}>
                Submit Review
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ReviewForm;
