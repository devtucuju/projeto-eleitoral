"use client";
import React from "react";
import HeaderAlt from "@/components/example-layout/example-header/header-alt";
import SidebarFour from "@/components/example-layout/example-sidebar/sidebar-four";
import Backdrop from "@/layout/Backdrop";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const LayoutFourContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 xl:flex">
      <SidebarFour />
      <Backdrop />
      <div className="flex-1 transition-all duration-300">
        <HeaderAlt />
        <main className="flex-1 p-4 md:p-6 pb-20 w-full mx-auto max-w-screen-2xl">
          {/* Page content goes here */}
          <div className="space-y-6">
            <div className="grid auto-rows-min gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <div className="h-40 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"></div>
              <div className="h-40 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"></div>
              <div className="h-40 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"></div>
              <div className="h-40 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"></div>
            </div>
            <div className="grid auto-rows-min gap-6 lg:grid-cols-3">
              <div className="min-h-dvh rounded-xl border border-gray-200 bg-gray-50 lg:col-span-1 dark:border-gray-800 dark:bg-white/3"></div>
              <div className="min-h-dvh rounded-xl border border-gray-200 bg-gray-50 lg:col-span-1 dark:border-gray-800 dark:bg-white/3"></div>
              <div className="min-h-dvh rounded-xl border border-gray-200 bg-gray-50 lg:col-span-1 dark:border-gray-800 dark:bg-white/3"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function LayoutFour() {
  return (
    <>
      <SidebarProvider>
        <LayoutFourContent />
      </SidebarProvider>
    </>
  );
}
