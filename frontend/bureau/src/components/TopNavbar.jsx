// src/components/TopNavbar.jsx
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import DropdownMenu from "./DropdownMenu";

const TopNavbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-indigo-600 shadow-lg text-white">
      <div className="text-2xl font-bold">Riya Matrimony</div>
      <DropdownMenu />
    </div>
  );
};

export default TopNavbar;
