import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";
import { NavLink } from "react-router-dom";


const SideNav = () => {
  
  return (
        <div className="h-screen bg-[#1D222B] text-white flex flex-col border-r-[0.5px] border-b-[0.5px] border-gray-700">
    <div className="flex flex-col px-4 border-b border-gray-700">
  {/* Logo */}
  <div className="flex items-center h-16">
    <img
      src="/assets/logo.png"
      alt="Productr Logo"
      className="w-[130.66px] h-[30px]"
    />
  </div>

 <div className="px-4 py-3 border-b border-gray-700">
  <div className="relative w-[224px] h-[34px]">
    {/* Icon inside input */}
    <IoIosSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />

    {/* Input */}
    <input
      type="text"
      placeholder="Search"
      className="w-full h-full pl-8 pr-2 rounded-[4px] bg-[#2A2F38] text-sm text-gray-200
      focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
</div>
</div>


      {/* Navigation Items */}
       <nav className="flex-1 px-2 w-[224px] mt-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 w-[224px] h-[34px] px-2 py-2 rounded-[4px] transition ${
              isActive ? "text-white bg-[#2A2F38]" : "text-gray-400 hover:bg-[#2A2F38]"
            }`
          }
        >
          <GoHome className="w-5 h-5" />
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-2 w-[224px] h-[34px] px-2 py-2 rounded-[4px] transition ${
              isActive ? "text-white bg-[#2A2F38]" : "text-gray-400 hover:bg-[#2A2F38]"
            }`
          }
        >
          <MdOutlineShoppingBag className="w-5 h-5" />
          Products
        </NavLink>
      </nav>
    </div>
  );
};

export default SideNav;
