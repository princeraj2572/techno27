"use client";
import React from "react";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";

const FooterSection = () => {
  return (
    <footer className="w-full bg-black text-white px-6 sm:px-10 lg:px-16 py-14 lg:py-20">
      <div className="w-full h-px bg-white/20 mb-12"></div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
        <div className="flex flex-col gap-8">
          <div className="text-2xl font-bold tracking-wider">
            TECHNOROLLIX 2027
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base">
            <Link href="/about" className="hover:text-gray-400 transition">
              About
            </Link>
            <Link href="/gallery" className="hover:text-gray-400 transition">
              Gallery
            </Link>
            <Link href="/team" className="hover:text-gray-400 transition">
              Team
            </Link>
          </div>

          <div className="flex space-x-6">
            <Link href="https://www.facebook.com/share/15rh7M4fp4/" target="_blank">
              <FaFacebookF className="hover:text-red-400 transition" size={22} />
            </Link>
            <Link href="https://wa.me/+918839171099" target="_blank">
              <FaWhatsapp className="hover:text-red-400 transition" size={22} />
            </Link>
            <Link href="https://www.instagram.com/technoaimbiation/" target="_blank">
              <FaInstagram className="hover:text-red-400 transition" size={22} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-20 border-t border-white/10 pt-6 text-xs sm:text-sm text-gray-500">
        © 2027 TechnoAmbiation · Technorollix 2027. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
