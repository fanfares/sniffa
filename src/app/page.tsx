'use client'
import { useEffect, useState } from "react";
import RequestBuilder from "./RequestBuilder";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        setIsDrawerOpen(!isDrawerOpen)
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  },[isDrawerOpen])

  return (
    <div className="relative overflow-x-hidden">
     <nav className={`fixed top-0 left-0 h-full w-64 bg-stone-500 transition-transform duration-300 ease-in-out transform ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-start items-center`}>
        <Sidebar />
      </nav>  

      <main className={`flex min-h-screen flex-col bg-stone-800 items-left justify-start p-4 transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? 'transform translate-x-64' : ''
      }`}>
        <header className="flex items-center justify-between w-full">
          <div className="logo cursor-pointer flex items-center" onClick={toggleDrawer}>
            <button 
              className="hamburger-button mr-4 mt-[-0.5em] p-2 focus:outline-none"
              onClick={toggleDrawer}
            >
              <div className="w-6 h-0.5 bg-stone-950 mb-1"></div>
              <div className="w-6 h-0.5 bg-stone-950 mb-1"></div>
              <div className="w-6 h-0.5 bg-stone-950"></div>
            </button>
            <h1 className="text-stone-900 font-black text-[3em]">Sniffa</h1>
          </div>
        </header>
        <section className="content">
          <RequestBuilder />
          <ScrollToTop />
          <hr className="my-8 border-stone-600" />
          <footer className="mt-4 text-stone-400 text-sm">
            <p>by&nbsp;
              <a className="" href="https://primal.net/p/npub1arkn0xxxll4llgy9qxkrncn3vc4l69s0dz8ef3zadykcwe7ax3dqrrh43w" target="_blank" rel="noreferrer noopener">
                <img className="rounded-full inline" src="https://avatars.githubusercontent.com/u/99223753?v=4" width="24" height="24" alt="arkinox profile picture"/>&nbsp;
                arkinox@team.fanfares.io 
              </a>
              <hr className="my-2 block border-transparent" />
              <a className="" href="https://fanfares.io/" target="_blank" rel="noopener noreferrer">
                <img className="ml-[-0.5em] rounded-full inline" src="/fanfares-logo.png" width="38" height="38" alt="FanFares logo"/>
                FanFares.io - Better Podcasts on Nostr
              </a>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}