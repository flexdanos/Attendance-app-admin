"use client";

import { Suspense } from "react";
import { FaSpinner } from "react-icons/fa";

interface SearchParamsProviderProps {
  children: React.ReactNode;
}

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-burgundy-600" />
      </div>
    }>
      {children}
    </Suspense>
  );
};
