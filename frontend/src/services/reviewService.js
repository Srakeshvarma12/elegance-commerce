const API = "http://127.0.0.1:8000/api/reviews/";

export const getReviews = async (productId) => {
  const res = await fetch(`${API}${productId}/`);
  return res.json();
};

export const addReview = async (productId, data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${productId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};
