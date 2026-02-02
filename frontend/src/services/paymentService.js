import api from "./api";

export const createPayment = async (amount) => {
  const res = await api.post("/payments/create/", { amount });
  return res.data;
};
