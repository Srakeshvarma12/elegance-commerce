import { demoProducts } from "../utils/demoData";

/**
 * Frontend-only product service.
 * All data is served directly from demoData — no backend required.
 */

export async function fetchProducts(params = {}) {
  let filtered = [...demoProducts];

  // Search
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Category
  if (params.category && params.category !== "all") {
    filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }

  // Price range
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

export async function getFeaturedProducts() {
  return { results: demoProducts.filter(p => p.featured) };
}

export async function getLatestProducts() {
  return { results: demoProducts.slice(0, 4) };
}

export async function getProductById(id) {
  const product = demoProducts.find(p => p.id === Number(id));
  if (product) return product;
  throw new Error(`Product ${id} not found`);
}