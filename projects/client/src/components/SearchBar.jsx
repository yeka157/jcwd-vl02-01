import React from 'react'

export default function SearchBar({setFilters, inputValue, filters}) {
  return (
    <div className="flex">
      <div className="mb-3 xl:w-96">
        <div className="input-group relative flex flex-wrap items-stretch w-full">
          <div className='inline mt-5'>
            <input 
              style={{borderRadius: 0}}
              value={inputValue}
              type="search" 
              className="form-control relative flex-auto w-[200px] block px-3 py-1.5 text-sm font-normal text-gray-700 bg-bgWhite bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-bgWhite focus:border-borderHijau focus:outline-none" 
              placeholder="Search by product name" 
              aria-label="Search" 
              aria-describedby="button-addon3" 
              onChange={(e) => {
                setFilters(prev => ({...prev, product_name: e.target.value}));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
