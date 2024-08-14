'use client'
import Image from "next/image";
import { useState } from "react";
import RequestBuilder from "./RequestBuilder";
import Sidebar from "./Sidebar";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="relative overflow-x-hidden">
     <nav className={`fixed top-0 left-0 h-full w-64 bg-stone-500 transition-transform duration-300 ease-in-out transform ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-start items-center`}>
        <Image className="pt-10" src="/nose.png" alt="nose" width={64} height={64} />
        <Sidebar />
      </nav>  

      <main className={`flex min-h-screen flex-col bg-stone-800 items-left justify-start p-8 transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? 'transform translate-x-64' : ''
      }`}>
        <header className="flex items-center justify-between w-full">
          <div className="logo cursor-pointer" onClick={toggleDrawer}>
            <h1 className="text-stone-900 font-black text-[3em]">Sniffa</h1>
          </div>
        </header>
        <section className="content">
          <RequestBuilder />
        </section>
      </main>
    </div>
  );
}