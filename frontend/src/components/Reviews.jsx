import { useEffect, useState } from "react";

export default function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const token = localStorage.getItem("access");

    const fetchReviews = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/${productId}/`);
        const data = await res.json();
        setReviews(data);
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const submitReview = async () => {
        if (!token) {
            alert("Login required");
            return;
        }

  const res = await fetch(
    `http://127.0.0.1:8000/api/reviews/add/${productId}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        rating,
        comment
      })
    }
  )

  if (res.status === 201) {
    alert("Review added")
    loadReviews()
  } else {
    const data = await res.json()
    alert(data.error || "Failed")
  }
}


    return (
        <div style={{ marginTop: "60px" }}>
            <h2>Customer Reviews</h2>

            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((r, i) => (
                <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
                    <strong>{r.user}</strong> ⭐ {r.rating}/5
                    <p>{r.comment}</p>
                </div>
            ))}

            <div style={{ marginTop: "20px" }}>
                <h3>Add Review</h3>

                <select value={rating} onChange={e => setRating(e.target.value)}>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>

                <br /><br />

                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Write your review..."
                    rows="3"
                    style={{ width: "100%" }}
                />

                <br /><br />

                <button onClick={submitReview}>Submit Review</button>
            </div>
        </div>
    );
}
