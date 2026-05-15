import { MdOutlineShoppingBag } from "react-icons/md";

const TopNav = ({ user, pageTitle }) => {
  // ✅ Email ka first letter nikalna (agar email hai)
  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : "";

  return (
    <div className="w-full h-[64px] flex items-center justify-between px-6 border-b border-gray-300 
                    bg-gradient-to-r from-pink-100 via-yellow-50 to-blue-100">
      
      {/* Left side: Page Title + Icon */}
      <div className="flex items-center gap-2">
        {pageTitle === "Products" && (
          <>
            <MdOutlineShoppingBag className="w-6 h-6 text-gray-700" />
            <span className="text-lg font-semibold text-gray-700">Products</span>
          </>
        )}
      </div>

      {/* Right side: Profile */}
      <div className="flex items-center gap-2 cursor-pointer">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {firstLetter}
          </div>
        )}
        <span className="text-gray-700">▼</span>
      </div>
    </div>
  );
};

export default TopNav;
