import React from 'react';

function Page({ pageNumber, nextPageFN, prevPageFn }) {
  return (
    <div className="flex justify-center items-center my-6  ">
      <div className="flex items-center bg-blue-400 rounded-lg shadow-md overflow-hidden">
        <button 
          onClick={prevPageFn}
          disabled={pageNumber <= 1}
          className={`px-4 py-2 flex items-center justify-center text-lg md:text-xl transition-all duration-300 h-12 w-12 md:h-14 md:w-14 ${
            pageNumber <= 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
          }`}
          aria-label="Previous Page"
        >
          <span className="text-2xl font-bold text-black">←</span>
        </button>
        
        <div className="flex items-center justify-center h-12 md:h-14 px-6 border-x bg-gray-50 min-w-14">
          <span className="font-semibold text-lg md:text-xl text-gray-800">{pageNumber}</span>
        </div>
        
        <button 
          onClick={nextPageFN}
          className="px-4 py-2 flex items-center justify-center text-lg md:text-xl text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 h-12 w-12 md:h-14 md:w-14 cursor-pointer"
          aria-label="Next Page"
        >
          <span className="text-2xl font-bold tex-black text-black">→</span>
        </button>
      </div>
    </div>
  );
}

export default Page;