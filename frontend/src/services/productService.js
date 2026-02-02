export async function fetchProducts() {
  const res = await fetch("http://127.0.0.1:8000/api/products/")
  return await res.json()
}
