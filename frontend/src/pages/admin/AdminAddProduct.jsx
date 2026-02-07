import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    navigate("/login");
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    if (image) data.append("image", image);

    try {
      await axios.post(`${BACKEND}/api/products/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

      <button
        onClick={() => navigate("/admin/products")}
        className="bg-gray-700 text-white px-4 py-2 rounded mb-4"
      >
        ← Back
      </button>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded max-w-xl">
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full p-2 border mb-3"
          required
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-4"
          accept="image/*"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
