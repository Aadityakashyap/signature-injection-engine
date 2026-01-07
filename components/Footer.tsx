import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-aaccent border-t border-light">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm text-border">
        <div>
          <h2 className="text-md font-bold uppercase text-white mb-3">
            Signature Injection Engine
          </h2>
          <ul className="space-y-2 text-white">
            <li>
              <Link href="#" className="hover:opacity-85">
                Why Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-md font-semibold uppercase text-text mb-3">
            Products
          </h2>
          <ul className="space-y-2 text-white">
            <li>
              <Link href="#" className="hover:opacity-85">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                Integrations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-md font-semibold uppercase text-text mb-3">
            Resources
          </h2>
          <ul className="space-y-2 text-white">
            <li>
              <Link href="#" className="hover:opacity-85">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                Case studies
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                Success stories
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-85">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <Link
            href="#"
            className="inline-flex bg-white border border-white text-black px-4 py-2 rounded-[calc(var(--radius)/2)] hover:bg-transparent transition justify-center font-semibold hover:text-white"
          >
            Start Signature Your PDF Free
          </Link>

          <div className="mt-4 flex gap-4 text-text flex-col justify-between">
            <Link href="#" className="hover:text-green">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-green">
              Instagram
            </Link>
            <Link href="#" className="hover:text-green">
              Twitter
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-6">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-text">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Signature Injection Engine"
                width="40"
                height="40"
                className="h-8 w-auto"
              />
            </Link>
            <span>Signature Injection Engine 2025. All rights reserved.</span>
          </div>

          <div className="flex text-white justify-between items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:opacity-85">
              Data Security & Privacy Policy
            </Link>
            <Link href="#" className="hover:opacity-85">
              Terms and Conditions
            </Link>
            <Link href="#" className="hover:opacity-85">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
