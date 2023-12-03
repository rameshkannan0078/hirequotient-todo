import React from 'react';
import { HrIconButton } from '../HrIconButton/HrIconButton';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const HrPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const itemsPerPage = 10;

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const fastBackward = () => {
    onPageChange(1);
  };

  const fastForward = () => {
    onPageChange(totalPages);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const shouldShowPagination = totalPages > 1;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return shouldShowPagination ? (
    <div className="flex justify-center mt-4">
      <div className='bg-blue-700'>
      <button
        className=" hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={fastBackward}
      >
        <HrIconButton icon='ChevronsLeft' />
      </button>
      <button
        className=" hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={prevPage}
      >
        <HrIconButton icon='ChevronLeft' />
      </button>
      </div>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`${currentPage === number
            ? 'bg-blue-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } py-2 px-4`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <div className='bg-blue-700'>
      <button
        className=" hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={nextPage}
      >
        <HrIconButton icon='ChevronRight' />
      </button>
      <button
        className=" hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={fastForward}
      >
        <HrIconButton icon='ChevronsRight' />
      </button>
      </div>
    </div>
  ) : null;
};

export default HrPagination;
