import axios from 'axios';
import React, { useState, useEffect } from 'react';
 
export default function Pagination({ totalData, itemsPerPage, currentPage, setCurrentPage, getProductData }) {
	const [range, setRange] = useState({ start: 1, end: itemsPerPage });

  const totalPage = Math.ceil(totalData / itemsPerPage);

  const loopPagination = (totalPage) => {
    let result = [];
    for (let i = 0; i < totalPage; i ++) {
      result.push(
        <button 
          key={i}
          aria-current="page" 
          className={`relative inline-flex items-center border ${currentPage === i + 1 ? 'z-10 font-bold border-borderHijau bg-borderHijau text-white' : 'border-gray-300 border-y hover:bg-muted hover:text-gray-700' }  px-4 py-2 text-sm font-medium focus:z-20`}
					onClick={() => {
						if (i + 1 > currentPage && i + 1 !== currentPage) {
							setCurrentPage(prev => i + 1);
							// getProductData();
						}

						if (i + 1 < currentPage && i + 1 !== currentPage) {
							setCurrentPage(prev => i + 1);
							// getProductData();
						}
					}}
				>
          {i + 1}
        </button>
      ) 
    }

    return result.map(val => {
      return val
    })
  }

	return (
		<div className="container items-center justify-between border-t border-gray-300 px-5 py-5 sm:px-6">
			<div className="flex-1 justify-between sm:hidden">
				<button 
					className={`${currentPage === '1' ? 'disabled cursor-default hover:disabled' : ''} relative inline-flex items-center border hover:bg-muted hover:text-gray-700 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700`}
					onClick={() => {
						if (currentPage !== 1) {
							setCurrentPage(prev => prev -= 1)
							// getProductData();
						}
					}}
				>
					Previous
				</button>
				<button 
					className={`${currentPage === totalPage ? 'disabled cursor-default hover:disabled' : ''} relative inline-flex items-center border hover:bg-muted hover:text-gray-700 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700`}
					onClick={() => {
						if (currentPage !== totalPage) {
							setCurrentPage(prev => prev += 1)
							// getProductData();
						}
					}}
				>
					Next
				</button>
			</div>
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-md text-gray-500">
						Showing
						<span className="font-bold"> { totalData ? range.start + (itemsPerPage * (currentPage - 1)) : 0} </span>
						to
						<span className="font-bold"> {totalData >= itemsPerPage &&  itemsPerPage * currentPage < totalData ? itemsPerPage * currentPage : totalData} </span>
						of
						<span className="font-bold"> {totalData} </span>
						results
					</p>
				</div>
				
				<div>
					<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
						<button 
							className={`${currentPage == 1 ? 'disabled cursor-not-allowed hover:disabled' : 'hover:bg-muted hover:text-gray-700'} relative inline-flex items-center border border-gray-300 px-2 py-2 text-sm font-medium text-gray-500 focus:z-20`}
							onClick={() => {
								if (currentPage !== 1) {
									setCurrentPage(prev => prev -= 1)
									// getProductData();
								}
							}}
						>
							<span className="sr-only">Previous</span>
							<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
							</svg>
						</button>

						{loopPagination(totalPage)}
						
						{/* <span className="relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">...</span> */}
						
						<button 
							className={`${currentPage == totalPage ? 'disabled cursor-not-allowed hover:disabled' : 'hover:bg-muted hover:text-gray-700'} relative inline-flex items-center border border-gray-300 px-2 py-2 text-sm font-medium text-gray-500 focus:z-20`}
							onClick={() => {
								if (currentPage !== totalPage) {
									setCurrentPage(prev => prev += 1);
									// getProductData();
								}
							}}
						>
							<span className="sr-only">Next</span>
							<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
							</svg>
						</button>
					</nav>
				</div>
				
			</div>
		</div>
	);
}
