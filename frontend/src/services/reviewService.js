import api from "./api";

export const getReviews = async (productId) => {
  const res = await api.get(`/reviews/product/${productId}/`);
  return res.data;
};

export const addReview = async (productId, data) => {
  try {
    const res = await api.post(`/reviews/product/${productId}/add/`, data);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "Failed to add review"
    );
  }
};
