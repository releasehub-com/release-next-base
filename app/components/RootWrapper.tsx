"use client";

import { useEffect } from "react";
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Create a global store for sidebar state
const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((state) => state.isOpen);

  useEffect(() => {
    const updateScrollBehavior = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    };

    if (typeof window !== 'undefined') {
      // Initial check
      updateScrollBehavior();
      
      // Add resize listener
      window.addEventListener('resize', updateScrollBehavior);
      
      // Cleanup
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('resize', updateScrollBehavior);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative h-screen flex">
      <main
        className={`overflow-auto flex-1 transition-all duration-300 ease-in-out
          ${isOpen ? "md:mr-[400px]" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}

// Export the store for other components to use
export { useSidebarStore }; 