import SideNav from "../Components/sideNav";
import TopNav from "../Components/TopNav";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import AddProductForm from "../Components/AddProductForm";
import ProductCard from "../Components/ProductCard";

const Products = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  
  const handleAddProduct = async (newProduct) => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("type", newProduct.type); // must be Food/Clothing/Electronics/Other
      formData.append("stock", newProduct.stock);
      formData.append("mrp", newProduct.mrp);
      formData.append("price", newProduct.price);
      formData.append("brand", newProduct.brand);
      formData.append("description", newProduct.description); // ✅ required
      formData.append("returnEligible", newProduct.returnEligible || "No");
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      // no headers, browser sets multipart/form-data with boundary
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        body: formData, // ✅ no headers, multer will parse
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }

      const savedProduct = await res.json();
      setProducts([...products, savedProduct]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update product (PUT request to backend)
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const saved = await res.json();
      setProducts(products.map(p => p._id === saved._id ? saved : p));
      setShowEditModal(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Toggle publish status
  const togglePublish = async (id, index) => {
    if (!id) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/publish`, {
        method: "PUT",
      });
      const updatedProduct = await res.json();
      const updated = [...products];
      updated[index] = updatedProduct;
      setProducts(updated);
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  //  Edit product
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  //  Delete product
  const handleDelete = async (id, index) => {
    if (!id) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { method: "DELETE" });
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-auto">
      <SideNav />
      <div className="flex-1">
        <TopNav user={user} pageTitle="Products" />

        <div className="p-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-32">
              <HiOutlineSquaresPlus className="text-[#0d1361] text-8xl mb-6" />
              <h3 className="text-lg font-semibold">Feels a little empty over here...</h3>
              <p className="text-gray-600">You can create products without connecting store</p>
              <p className="text-gray-600">You can add products to store anytime</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 px-6 py-2 rounded-md text-white 
                           bg-gradient-to-r from-[#000FB4] to-[#4050FF] hover:opacity-90 transition"
              >
                Add your Products
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 rounded-md text-gray-500 flex flex-row justify-end"
                >
                  <FaPlus className="mr-2" /> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, index) => (
                  <ProductCard
                    key={p._id || index}
                    product={p}
                    onPublishToggle={() => togglePublish(p._id, index)}
                    onEdit={() => handleEdit(p)}
                    onDelete={() => handleDelete(p._id, index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddProductForm
            onClose={() => setShowModal(false)}
            onAddProduct={handleAddProduct}
          />
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddProductForm
            onClose={() => setShowEditModal(false)}
            onAddProduct={handleUpdateProduct}
            initialData={editProduct}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
