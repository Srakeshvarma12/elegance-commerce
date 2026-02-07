import { useNavigate } from "react-router-dom";

export default function LoginToBuyModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] text-center">
        <h2 className="text-xl font-semibold mb-3">
          Sign in to continue
        </h2>

        <p className="text-gray-600 mb-6">
          You need to be logged in to add items to your cart or buy products.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full border border-black py-2 rounded-md"
          >
            Create your account
          </button>

          <button
            onClick={onClose}
            className="text-gray-500 mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
