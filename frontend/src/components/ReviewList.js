import React, { useEffect, useState } from 'react';

const ReviewList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/reviews/${productId}`);
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    if (loading) return <p>Loading reviews...</p>;

    if (reviews.length === 0) return <p>No reviews yet. Be the first to review! 🌱</p>;

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Customer Reviews ⭐</h3>
            {reviews.map(review => (
                <div key={review.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                    <strong>{review.user_name}</strong> – {review.rating}/5
                    <p>{review.comment}</p>
                    <small>{new Date(review.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
