"use client"
import { useState } from "react";
import Link from "next/link";
import {FaBars} from 'react-icons/fa'
import { IoCloseSharp } from "react-icons/io5";
import CustomButton from "./CustomButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between h-full bg-dark-blue text-white items-center px-8 py-4">
      <Link href={"/"}>
        <p className="py-4 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#AE62EE] to-[#FE8A7C]">Dtipify</p>
      </Link>
      <div className="flex items-center text-light-purple text-lg">
        <div className="hidden md:flex">
          <Link href={"/#about"}>
            <p className="mx-2 my-4 hover:text-purple-300 ">About </p>
          </Link>
          <Link href={"/#creators"}>
            <p className="mx-2 my-4 hover:text-purple-300">Featured Creators </p>
          </Link>
          <Link href={"/pages/CreatorForm"}>
            <p className="mx-2 my-4 hover:text-purple-300 ">Create Account </p>
          </Link>
          <Link href={"/pages/Profile"}>
            <p className="mx-2 my-4 hover:text-purple-300 ">Profile</p>
          </Link>
          <div className="my-2">
            <CustomButton />
          </div>
        </div>
        <div className="md:hidden w-full z-50">
          <button onClick={toggleMenu}>
            {!isMenuOpen &&
              <FaBars/>
            }
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black p-8 z-50">
          {isMenuOpen && 
          <div className="flex justify-between">
            <p className="py-4 text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#AE62EE] to-[#FE8A7C]" onClick={toggleMenu}>Dtipify</p>
            <IoCloseSharp onClick={toggleMenu}  color="white"/>
          </div>
          }       
          <div className="flex flex-col mt-16">
          <Link href={"/#about"}>
            <p className="mx-2 my-4 hover:text-purple-300" onClick={toggleMenu}>About</p>
          </Link>
          <Link href={"/#creators"}>
            <p className="mx-2 my-4 hover:text-purple-300" onClick={toggleMenu}>Featured Creators</p>
          </Link>
          <Link href={"/pages/CreatorForm"}>
            <p className="mx-2 my-4 hover:text-purple-300" onClick={toggleMenu}>Create Profile</p>
          </Link>
          <Link href={"/pages/Profile"}>
            <p className="mx-2 my-4 hover:text-purple-300" onClick={toggleMenu}>Profile</p>
          </Link>
            <div className="my-4">
            <CustomButton />
          </div>          
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;