import { FaUsers } from "react-icons/fa";

// Componente Sidebar
const Sidebar = ({ open }) => (
  <div
    className={`w-60 bg-gray-600 p-6 h-screen shadow-md ${
      open ? "block" : "hidden"
    } md:block`}
  >
    <ul>
      <li className="mb-4 mt-4 justify-center items-center">
        <a
          href="/"
          className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded-md text-white text-xl font-medium hover:text-green-500"
        >
          <FaUsers className="mr-2 text-xl" />
          Pessoas
        </a>
      </li>
    </ul>
  </div>
);

export default Sidebar;
