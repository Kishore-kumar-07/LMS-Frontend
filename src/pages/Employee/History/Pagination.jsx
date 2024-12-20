import React from 'react';
import { HiArrowCircleRight, HiArrowCircleLeft } from 'react-icons/hi';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,   
    totalPages: PropTypes.number.isRequired,    
    onPageChange: PropTypes.func.isRequired,    
  };

  const handleClick = (page) => {
    if (page !== '...') {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3; // Number of page numbers to show at the start
    const showEllipsis = totalPages > (maxPagesToShow + 2); // Show ellipsis if there are more pages

    // Always show the first 3 pages
    for (let i = 1; i <= Math.min(maxPagesToShow, totalPages); i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (showEllipsis && currentPage > maxPagesToShow) {
      pageNumbers.push('...');
    }

    // Show current page and its neighbors
    if (currentPage > maxPagesToShow && currentPage < totalPages - 1) {
      pageNumbers.push(currentPage);
      if (currentPage < totalPages - 2) {
        pageNumbers.push(currentPage + 1);
      }
    }

    // Always show the last page if it's not already shown
    if (showEllipsis && currentPage < totalPages - 1) {
      pageNumbers.push(totalPages);
    }

    // Remove duplicate page numbers
    return Array.from(new Set(pageNumbers));
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-l-lg bg-white hover:bg-gray-100"
      >
        <HiArrowCircleLeft />
      </button>
      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          onClick={() => handleClick(pageNumber)}
          className={`px-3 py-2 border-t border-b border-gray-300 ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'} `}
          disabled={pageNumber === '...'}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-r-lg bg-white hover:bg-gray-100"
      >
        <HiArrowCircleRight />
      </button>
    </div>
  );
};

export default Pagination;
