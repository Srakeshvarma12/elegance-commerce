import api from "./api";

export async function fetchProducts() {
  const res = await api.get("/products/");
  return res.data;
}

export async function getFeaturedProducts() {
  const res = await api.get("/products/featured/");
  return res.data;
}

export async function getLatestProducts() {
  const res = await api.get("/products/latest/");
  return res.data;
}