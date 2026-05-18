import { useState } from "react";
import { IoClose } from "react-icons/io5"; // Cross icon

const AddProductForm = ({ onClose, onAddProduct, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      type: "",
      stock: "",
      mrp: "",
      price: "",
      brand: "",
      description: "",
      image: null,
      returnEligible: "",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
      !formData.name ||
      !formData.type ||
      !formData.stock ||
      !formData.mrp ||
      !formData.price ||
      !formData.brand ||
      !formData.description
    ) {
      alert("Please fill all required fields");
      return;
    }
    onAddProduct(formData);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative mx-auto my-8 max-h-[80vh] overflow-y-auto" >
     
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold text-gray-700">
          {formData._id ? "Edit Product" : "Add Product"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <IoClose className="w-6 h-6" />
        </button>
      </div>

     
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Product Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter product name"
      />

     
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Product Type
      </label>
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select type</option>
        <option value="Food">Food</option>
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Other">Other</option>
      </select>

      
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Quantity Stock
      </label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter stock quantity"
      />

      
      <label className="block mb-2 text-sm font-medium text-gray-600">
        MRP
      </label>
      <input
        type="number"
        name="mrp"
        value={formData.mrp}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter MRP"
      />

      <label className="block mb-2 text-sm font-medium text-gray-600">
        Selling Price
      </label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter selling price"
      />

      
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Brand Name
      </label>
      <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter brand name"
      />

      
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Upload Product Images
      </label>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
      />

     
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Enter product description"
      />

      
      <label className="block mb-2 text-sm font-medium text-gray-600">
        Exchange or return eligibility
      </label>
      <select
        name="returnEligible"
        value={formData.returnEligible}
        onChange={handleChange}
        className="w-full border p-2 mb-6 rounded focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

    
      <div className="flex justify-end gap-3 sticky bottom-0 bg-white py-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {formData._id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
