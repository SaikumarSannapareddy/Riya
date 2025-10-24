import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import DropdownMenu from "./DropdownMenu";

const TopNavbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-indigo-600 shadow-lg text-white">
      {/* Centering the heading on small screens */}
      <div className="text-2xl font-bold md:text-left text-center flex-1">
        Riya Matrimony
      </div>
      <DropdownMenu />
    </div>
  );
};

export default TopNavbar;
