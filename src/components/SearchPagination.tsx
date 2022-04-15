import React from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface Props {
  fetchData: (values: any) => void;
  totalPage: number;
}
const SearchPagination = ({ fetchData, totalPage }: Props) => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search).get("q");
  return (
    <>
      <ReactPaginate
        pageCount={totalPage}
        pageRangeDisplayed={3}
        marginPagesDisplayed={0}
        onPageChange={(data) => {
          window.scrollTo(0, 0);
          navigate(`/search/anime?q=${query}&page=${data.selected + 1}`);
          fetchData(data.selected + 1);
        }}
        activeClassName="bg-violet-500 text-white"
        pageClassName="text-gray-300 border-y border-r border-gray-400 py-2 px-4 h-10"
        breakClassName="hidden"
        className="outline-none mx-auto flex flex-row mt-5 max-w-sm h-10 items-center justify-center font-roboto"
        previousClassName="rounded-tl-lg rounded-bl-lg border border-gray-400 lowercase px-2 py-2 h-10 flex items-center"
        nextClassName="rounded-tr-lg rounded-br-lg border-y border-r border-gray-400 lowercase px-2 py-2 h-10 flex items-center"
        previousLabel={<MdNavigateBefore className="w-6 h-6 text-gray-300" />}
        nextLabel={<MdNavigateNext className="w-6 h-6 text-gray-300" />}
      />
    </>
  );
};

export default SearchPagination;
