"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-text-light bg-main-accent shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="block">
            <Image
              src="/logo.svg"
              alt="Signature Injection Engine"
              width="40"
              height="40"
              className="h-10 w-auto"
            />
          </Link>
          <Link href="/" className="text-lg font-semibold text-white">
            Signature Injection Engine
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <div className="relative">
            <button
              onClick={() => toggleMenu("product")}
              className="hover:text-green flex items-center gap-1"
            >
              Product
              <svg className="w-3 h-3" viewBox="0 0 15 15" fill="currentColor">
                <path d="M2.1,3.2l5.4,5.4l5.4-5.4L15,4.3l-7.5,7.5L0,4.3L2.1,3.2z" />
              </svg>
            </button>
            {openMenu === "product" && (
              <ul className="absolute top-full left-0 mt-2 bg-white border border-text-light rounded shadow-md w-40 z-10 text-logo">
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 hover:bg-text-light"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 hover:bg-text-light"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <Link href="#" className="hover:text-green">
            Pricing
          </Link>

          <div className="relative">
            <button
              onClick={() => toggleMenu("resources")}
              className="hover:text-green flex items-center gap-1"
            >
              Resources
              <svg className="w-3 h-3" viewBox="0 0 15 15" fill="currentColor">
                <path d="M2.1,3.2l5.4,5.4l5.4-5.4L15,4.3l-7.5,7.5L0,4.3L2.1,3.2z" />
              </svg>
            </button>
            {openMenu === "resources" && (
              <ul className="absolute top-full left-0 mt-2 bg-white border border-text-light rounded shadow-md w-48 z-10 text-logo">
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 hover:bg-text-light"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 hover:bg-text-light"
                  >
                    Case studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 hover:bg-text-light"
                  >
                    Success stories
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <Link href="#" className="hover:text-green">
            Contact Us
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link
            href="#"
            rel="noopener noreferrer"
            className="px-4 py-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#e179af] bg-[#da589b] text-sm font-medium text-white transition hover:bg-[#c82c7d]"
          >
            Signature Your PDF Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
