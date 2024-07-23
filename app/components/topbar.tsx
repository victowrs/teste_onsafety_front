import { FaBars } from "react-icons/fa";

const Topbar = ({ toggleSidebar }) => (
  <div className="bg-gray-700 text-white p-4 shadow-md flex items-center justify-between">
    <div className="flex justify-center">
      <span className="text-3xl text-black">On</span>
      <span className="text-3xl text-green-500">Safety</span>
    </div>
    <button className="md:hidden mr-4" onClick={toggleSidebar}>
      <FaBars size={24} />
    </button>
  </div>
);

export default Topbar;
