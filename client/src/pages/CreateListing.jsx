import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "organic",
    quantity: 1,
    unit: "Kg", // Updated default to Kg
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    nonGmo: false,
    nonperishable: false,
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === "organic" || e.target.id === "inorganic") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "nonGmo" ||
      e.target.id === "nonperishable" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.id === "unit") {
      setFormData({
        ...formData,
        unit: e.target.value, // Handle unit change
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discounted price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="30"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="organic"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "organic"}
              />
              <span>Organic</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="inorganic"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "inorganic"}
              />
              <span>Inorganic</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="nonGmo"
                className="w-5"
                onChange={handleChange}
                checked={formData.nonGmo}
              />
              <span>Non-GMO</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="nonperishable"
                className="w-5"
                onChange={handleChange}
                checked={formData.nonperishable}
              />
              <span>Non-perishable</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="quantity"
                min="1"
                max="1000"
                required
                onChange={handleChange}
                value={formData.quantity}
              />
              <p>Quantity</p>
            </div>

            {/* Unit selection dropdown */}
            <div className="flex items-center gap-2">
              <select
                className="p-3 border border-gray-300 rounded-lg"
                id="unit"
                required
                onChange={handleChange}
                value={formData.unit}
              >
                <option value="Kg">Kg</option>
                <option value="G">G</option>
              </select>
              <p>Unit</p>
            </div>

            <div className="flex items-center gap-2">
  <input
    className="p-3 border border-gray-300 rounded-lg"
    type="number"
    id="regularPrice"
    min="50"
    max="100000"
    required
    onChange={handleChange}
    value={formData.regularPrice}
  />
  <div className="flex flex-col items-center">
    <p>Price</p>
    <span className="text-xs">₹ / month</span> {/* Changed $ to ₹ */}
  </div>
</div>

{formData.offer && (
  <div className="flex items-center gap-2">
    <input
      className="p-3 border border-gray-300 rounded-lg"
      type="number"
      id="discountPrice"
      min="0"
      max="100000"
      required
      onChange={handleChange}
      value={formData.discountPrice}
    />
    <div className="flex flex-col items-center">
      <p>Discounted Price</p>
      <span className="text-xs">₹</span> {/* Changed $ to ₹ */}
    </div>
  </div>
)}

          
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
