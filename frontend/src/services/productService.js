import api from "./api";
import { demoProducts } from "../utils/demoData";

export async function fetchProducts(params = {}) {
  try {
    const res = await api.get("products/", { params });
    return res.data;
  } catch (err) {
    console.warn("Backend unavailable, using demo products with local filtering.");
    
    let filtered = [...demoProducts];
    
    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    // Category
    if (params.category && params.category !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    
    // Price
    if (params.min) filtered = filtered.filter(p => parseFloat(p.price.replace(/,/g, "")) >= parseFloat(params.min));
    if (params.max) filtered = filtered.filter(p => parseFloat(p.price.replace(/,/g, "")) <= parseFloat(params.max));
    
    // Sort
    if (params.sort) {
      if (params.sort === "price_low") filtered.sort((a, b) => parseFloat(a.price.replace(/,/g, "")) - parseFloat(b.price.replace(/,/g, "")));
      else if (params.sort === "price_high") filtered.sort((a, b) => parseFloat(b.price.replace(/,/g, "")) - parseFloat(a.price.replace(/,/g, "")));
      else if (params.sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return { 
      results: filtered, 
      count: filtered.length,
      next: null,
      previous: null
    };
  }
}

export async function getFeaturedProducts() {
  try {
    const res = await api.get("products/featured/");
    return res.data;
  } catch (err) {
    console.warn("Backend unavailable, using featured demo products.");
    return { results: demoProducts.filter(p => p.featured) };
  }
}

export async function getLatestProducts() {
  try {
    const res = await api.get("products/latest/");
    return res.data;
  } catch (err) {
    console.warn("Backend unavailable, using latest demo products.");
    return { results: demoProducts.slice(0, 4) };
  }
}

export async function getProductById(id) {
  try {
    const res = await api.get(`products/${id}/`);
    return res.data;
  } catch (err) {
    console.warn(`Product ${id} not found in backend, searching in demo data.`);
    const demo = demoProducts.find(p => p.id === Number(id));
    if (demo) return demo;
    throw err;
  }
}