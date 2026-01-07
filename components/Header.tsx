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
    <header className="sticky top-0 z-50 border-b border-light bg-aaccent shadow-sm">
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
              <ul className="nav-list w-40">
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-light">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-light">
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
              <ul className="nav-list w-48">
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-light">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-light">
                    Case studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-light">
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
            className="btn-full flex h-10 w-full items-center justify-center gap-2"
          >
            Signature Your PDF Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
