"use client"

export default function Loading() {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-black opacity-75 z-50 flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600 border-solid"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
}