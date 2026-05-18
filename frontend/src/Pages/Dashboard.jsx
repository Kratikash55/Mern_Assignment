import SideNav from "../Components/sideNav";
import TopNav from "../Components/TopNav";
import { useState, useEffect } from "react";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import ProductCard from "../Components/ProductCard";

const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);

  // ✅ Fetch products from backend
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

  // ✅ Filter products
  const publishedProducts = products.filter((p) => p.published);
  const unpublishedProducts = products.filter((p) => !p.published);

  return (
    <div className="flex min-h-screen overflow-y-auto">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <TopNav user={user} pageTitle="Dashboard" />

        {/* Page Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab("published")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "published"
                  ? "text-gray-700 border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Published ({publishedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab("unpublished")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "unpublished"
                  ? "text-gray-700 border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Unpublished ({unpublishedProducts.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "published" ? (
            publishedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-36">
                <HiOutlineSquaresPlus className="text-[#0d1361] text-8xl mb-4" />
                <h3 className="text-lg font-semibold">No Published Products</h3>
                <p className="text-gray-600">Your Published Products will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )
          ) : unpublishedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-36">
              <HiOutlineSquaresPlus className="text-[#0d1361] text-8xl mb-4" />
              <h3 className="text-lg font-semibold">No Unpublished Products</h3>
              <p className="text-gray-600">Your Unpublished Products will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpublishedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
