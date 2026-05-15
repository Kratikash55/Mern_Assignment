import { RiDeleteBin5Line } from "react-icons/ri";

const ProductCard = ({ product, onPublishToggle, onEdit, onDelete }) => {
  return (
    <div className="w-full max-w-sm border rounded-lg shadow bg-white flex flex-col overflow-hidden">
      {/* Product Image */}
      <img
        src={
          product.image
            ? `http://localhost:8000/uploads/${product.image}`
            : "/placeholder.png"
        }
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      {/* Product Details */}
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">Type</span>
          <span>{product.type}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">Stock</span>
          <span>{product.stock}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">MRP</span>
          <span>₹{product.mrp}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">Selling Price</span>
          <span>₹{product.price}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">Brand</span>
          <span>{product.brand}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-400">Exchange Eligible</span>
          <span>{product.returnEligible}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 border-t bg-gray-50">
        <button
          onClick={onPublishToggle}
          className={`flex-1 px-5 py-1 text-sm rounded text-white transition
            ${product.published 
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gradient-to-b from-[#000FB4] to-[#4050FF] hover:opacity-90"}`}
        >
          {product.published ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-5 py-1 text-sm rounded-md border border-gray-400 text-black hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-2 py-1 text-sm rounded-md border border-gray-400 text-gray-400 flex items-center justify-center"
        >
          <RiDeleteBin5Line />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
