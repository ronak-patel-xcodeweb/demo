"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Index() {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const blockGridRef = useRef<HTMLDivElement | null>(null);

  const rows = 12;
  const cols = 20;

  useEffect(() => {
    const blockGrid = blockGridRef.current;

    if (blockGrid) {
      for (let i = 0; i < rows * cols; i++) {
        const block = document.createElement('div');

        block.style.animationDelay = `${Math.random() * 2}s`;
        block.style.animationDuration = `${1 + Math.random() * 2}s`; 

        block.className = 'block'; 
        blockGrid.appendChild(block);
      }
    }
  }, []);
  
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-16 py-8">
        <div className="flex items-center space-x-2">
          <div className="h-10 border-l-12 border-black"></div>
          <span className="text-xl font-bold tracking-tight text-black">
            BLACK
            <br />
            MONOLITH
          </span>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center space-x-8 self-end text-base font-medium md:flex"
          style={{ fontFamily: "poppins" }}
        >
          <a href="#companies" className="text-gray-800 hover:font-bold hover:text-black">
            Companies
          </a>
          <a href="#government" className="text-gray-800 hover:font-bold hover:text-black">
            Government
          </a>
          <a href="#agent" className="text-gray-800 hover:font-bold hover:text-black">
            Agent
          </a>
          {/* Grid Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="none"
            stroke="black"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="8" height="8" />
            <rect x="13" y="3" width="8" height="8" />
            <rect x="3" y="13" width="8" height="8" />
            <rect x="13" y="13" width="8" height="8" />
          </svg>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-3 md:hidden">
          <button onClick={() => setMobileNavOpen(!isMobileNavOpen)} aria-label="Toggle navigation menu">
            {isMobileNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav Panel */}
        {isMobileNavOpen && (
          <div
            className="bg-opacity-95 fixed inset-0 z-20 mt-30 flex h-full flex-col items-center space-y-6 bg-white text-lg font-medium"
            style={{ fontFamily: "poppins" }}
          >
            <a href="#companies" onClick={() => setMobileNavOpen(false)} className="text-black hover:font-semibold">
              Companies
            </a>
            <a href="#government" onClick={() => setMobileNavOpen(false)} className="text-black hover:font-semibold">
              Government
            </a>
            <a href="#agent" onClick={() => setMobileNavOpen(false)} className="text-black hover:font-semibold">
              Agent
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative py-40 text-center text-white"
        style={{
          backgroundImage: `url('/images/Hero_image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="block-grid" ref={blockGridRef} id="blockGrid"></div>
        <div className="absolute inset-0 bg-black opacity-45"></div>
        <div className="relative z-10 px-6">
          <h1 className="mb-4 text-2xl leading-tight font-bold md:text-3xl" style={{ fontFamily: "raleway" }}>
            Intelligence. Access. Impact
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-sm font-medium md:text-base" style={{ fontFamily: "montserrat" }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industy's
          </p>
          <a
            href="#contact"
            className="inline-block border border-white px-6 py-2 text-base transition-colors duration-300 hover:bg-white hover:text-black"
            style={{ fontFamily: "poppins" }}
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="bg-gray-100 px-15 py-10 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-medium text-black md:text-2xl" style={{ fontFamily: "poppins" }}>
            Companies
          </h2>
          <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col overflow-hidden">
                <Image
                  src={`/images/Company${i}.jpg`}
                  alt={`Company ${i}`}
                  width={350}
                  height={200}
                  style={{ filter: "brightness(150%)" }}
                  className="h-64 object-cover"
                />
                <div className="flex flex-grow flex-col py-5">
                  <h3 className="mb-2 text-2xl font-semibold text-black" style={{ fontFamily: "raleway" }}>
                    Market Expansion &amp; Local Access
                  </h3>
                  <p
                    className="w-5/6 flex-grow text-base tracking-normal text-black"
                    style={{ fontFamily: "montserrat" }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                    Industry's standatd dummy text ever since the 1500s, when an unknown.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Section */}
      <section id="government" className="bg-white px-15 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-medium text-black md:text-2xl" style={{ fontFamily: "poppins" }}>
            Governments
          </h2>
          <div className="grid grid-cols-1 items-center gap-8 bg-[url(/images/Technology_Scouting_&_Innovation_Access.jpg)] bg-cover bg-center py-25 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-lg px-10 py-5 text-white">
              <h3 className="mb-4 text-3xl font-semibold" style={{ fontFamily: "raleway" }}>
                Technology Scouting &amp;
                <br />
                Innovation Access
              </h3>
              <p className="mb-6 text-sm" style={{ fontFamily: "montserrat" }}>
                Lorem Ipsum is simply dummy text of the printing <br></br> and typesetting industry. Lorem Ipsum has
                been
              </p>
              <a
                href="#"
                className="inline-block border border-white px-10 py-2 font-semibold transition-colors duration-300 hover:bg-white hover:text-black"
                style={{ fontFamily: "poppins" }}
              >
                Explore
              </a>
            </div>
            <div className="overflow-hidden"></div>
          </div>
        </div>
      </section>

      {/* How We Operate */}
      <section className="bg-gray-50 px-15 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-medium text-black md:text-2xl" style={{ fontFamily: "poppins" }}>
            How we operate
          </h2>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-square h-full">
              <div className="absolute inset-0 bg-[url('/images/Our_Expertise.jpg')] bg-cover bg-center" />
            </div>
            <div className="flex h-full w-full flex-col flex-wrap justify-center bg-white px-6 py-15 text-center align-middle">
              <h3 className="mb-2 text-3xl font-bold text-black" style={{ fontFamily: "raleway" }}>
                Our Expertise
              </h3>
              <p className="mb-4 text-base text-black" style={{ fontFamily: "montserrat" }}>
                Areas where we can help you.
              </p>
              <a
                href="#"
                className="w-fit self-center border border-black px-6 py-2 font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white"
                style={{ fontFamily: "poppins" }}
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Section */}
      <section id="agent" className="bg-black py-16 text-center text-white">
        <div className="px-4">
          <p
            className="mx-auto mb-8 w-2/3 max-w-3xl text-lg font-bold md:w-1/2 md:text-3xl"
            style={{ fontFamily: "raleway" }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <a
            href="#"
            className="inline-block border border-white px-10 py-2 font-semibold transition-colors duration-300 hover:bg-white hover:text-black"
            style={{ fontFamily: "poppins" }}
          >
            Join us as an Agent
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-15 py-12">
        <div className="container mx-auto grid grid-cols-1 items-start gap-16 px-4 text-sm md:grid-cols-2">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 border-l-12 border-black"></div>
              <span className="text-xl font-bold tracking-tight text-black">
                BLACK
                <br />
                MONOLITH
              </span>
            </div>
            <p className="text-base font-medium text-black" style={{ fontFamily: "montserrat" }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              {/* LinkedIn */}
              <a href="#" className="text-gray-700 hover:text-black" aria-label="LinkedIn">
                <Linkedin />
              </a>

              {/* YouTube */}
              <a href="#" className="text-gray-700 hover:text-black" aria-label="YouTube">
                <Youtube />
              </a>
              {/* Facebook */}
              <a href="#" className="text-gray-700 hover:text-black" aria-label="Facebook">
                <Facebook />
              </a>
              {/* Instagram */}

              {/* Instagram */}
              <a href="#" className="text-gray-700 hover:text-black" aria-label="Instagram">
                <Instagram />
              </a>
            </div>
          </div>

          <div className="flex justify-between max-[425]:flex-col md:ps-14 lg:ps-20">
            {/* Contact Us */}
            <div className="space-y-2" style={{ fontFamily: "poppins" }}>
              <h4 className="mb-3 text-2xl font-semibold text-black">Contact Us</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-base font-medium text-black hover:font-semibold">
                    Lorem Ipsum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base font-medium text-black hover:font-semibold">
                    Lorem Ipsum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base font-medium text-black hover:font-semibold">
                    Lorem
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-2" style={{ fontFamily: "poppins" }}>
              <h4 className="mb-3 text-2xl font-semibold text-black">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#companies" className="text-base font-medium text-black hover:font-semibold">
                    Companies
                  </a>
                </li>
                <li>
                  <a href="#government" className="text-base font-medium text-black hover:font-semibold">
                    Government
                  </a>
                </li>
                <li>
                  <a href="#agent" className="text-base font-medium text-black hover:font-semibold">
                    Agent
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
