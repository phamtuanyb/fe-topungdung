"use client"

import { useState } from "react";

const Pagination = () => {
  const [active, setActive] = useState<number>(1);
  const pages: number[] = [1, 2, 3, 10];

  return (
    <div className="flex items-center justify-center gap-1.5 mt-11">
      <button
        disabled
        className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 text-sm font-semibold opacity-35 cursor-not-allowed"
      >‹</button>
      {pages.map((p, i) => (
        <>
          {i === 3 && (
            <span key="dots" className="text-gray-400 px-1">…</span>
          )}
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-md border text-sm font-semibold transition-all duration-150 ${
              active === p
                ? "bg-[#1E5BC6] border-[#1E5BC6] text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#1E5BC6] hover:text-[#1E5BC6]"
            }`}
          >
            {p}
          </button>
        </>
      ))}
      <button className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 text-sm font-semibold hover:border-[#1E5BC6] hover:text-[#1E5BC6] transition-all duration-150">
        ›
      </button>
    </div>
  );
}

export default Pagination