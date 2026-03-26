import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminProducts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    let allProducts = [];
    let url = "/products/";

    try {
      while (url) {
        const res = await api.get(url);
        const data = res.data;
        allProducts = allProducts.concat(data.results || []);
        url = data.next;
      }
      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}/`);

      alert("Product deleted");
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      <button
        onClick={() => navigate("/admin")}
        className="bg-gray-700 text-white px-4 py-2 rounded mb-4"
      >
        ← Back to Admin
      </button>

      <button
        onClick={() => navigate("/admin/products/new")}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 ml-3"
      >
        + Add Product
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 shadow rounded">
              <h3 className="font-bold">{p.name}</h3>
              <p>₹ {p.price}</p>
              <p className="text-sm text-gray-500">{p.category}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
