


"use client";

import React, { useState, useEffect } from "react";
import { folderApi, Folder } from "../../utils/api";



const MyMove = () => {
  const [movies, setMovies] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      window.location.href = "/";
    }
  }, []);

  const fetchMovies = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId") || "user-123";

      const result = await folderApi.getMovieList({
        page,
        limit,
        userId: userId
      });

      if (result.success && result.data) {
        setMovies(result.data.folders || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalMovies(result.data.total || 0);
        setCurrentPage(result.data.page || 1);
      } else {
        setError(result.error || "Failed to fetch movies");
      }
    } catch (error) {
      setError("Network error occurred");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);



  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

    window.location.href = "/";
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <>
      {
        isMobile ? (
          <div className="pt-[80px] px-[24px]">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-2 text-white">Loading movies...</span>
              </div>
            )}
            {
              !loading && (
                <div className="flex items-center justify-between mb-[80px]">
                  <div className="flex items-center gap-4">
                    <h2
                      style={{
                        fontFamily: 'Montserrat',
                        fontWeight: 600,
                        fontSize: '32px',
                        lineHeight: '40px',
                        textAlign: 'left',
                        color: '#FFFFFF',
                        margin: 0
                      }}
                    >
                      My Move
                    </h2>
                    <img
                      src="/images/Group 24.svg"
                      alt="Bottom vector"
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '9px',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = '/add'}
                    />
                  </div>
                  <button
                    // onClick={() => fetchMovies(1, 10)}
                    // disabled={loading}
                    className="w-[32px] h-[32px] flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >

                    {/* <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg> */}
                    <img
                      src="/images/logout_black_24dp.svg"
                      alt="Logout"
                      className="w-5 h-5 ml-2"
                      style={{ marginTop: 0 }}
                    />
                  </button>
                </div>
              )
            }

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <div key={movie._id} className=" max-w-[180px] h-[334px] rounded-[12px] bg-[#092C39] mx-auto">
                  <div className="w-full h-[240px] bg-gray-600 rounded-t-[12px] flex items-center justify-center overflow-hidden">
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-t-[12px]"
                      />
                    ) : (
                      <span className="text-white text-xs">No Image</span>
                    )}
                  </div>

                  <div className="p-3 relative">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 flex items-start justify-between">
                      <span>{movie.title || movie.name}</span>
                      <button
                        className="ml-2 p-2 rounded hover:bg-gray-700 transition-colors"
                        title="Edit"
                        onClick={() => {
                          window.location.href = `/edit/${movie._id}`;
                        }}
                        style={{ lineHeight: 0 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-300 hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                          />
                        </svg>
                      </button>
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {movie.publishingYear || formatDate(movie.createdAt)} • {movie.status}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {!loading && !error && movies.length > 0 && (
              <div className="flex justify-center items-center mt-8 mb-8 space-x-4 ">

                <button
                  onClick={() => fetchMovies(currentPage - 1, 10)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                    textAlign: 'center'
                  }}
                >
                  Prev
                </button>


                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchMovies(pageNum, 10)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-[#2BD17E] text-white'
                            : 'bg-[#092C39] text-white border border-gray-600 hover:bg-gray-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        style={{
                          fontFamily: 'Montserrat',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '24px',
                          textAlign: 'center'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => fetchMovies(currentPage + 1, 10)}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                    textAlign: 'center'
                  }}
                >
                  Next
                </button>
              </div>
            )}




            {!loading && !error && movies.length === 0 && (
              <div className="flex flex-col items-center justify-center p-4 sm:p-20">
                <div className="flex flex-col items-center">
                  <h1 className="font-[Montserrat] font-semibold text-[#FFFFFF] text-[48px] leading-[56px] text-center mb-8 max-w-[600px] w-full">Your movie list is empty</h1>
                  <button className="bg-[#2BD17E] text-white rounded-[10px] w-[202px] h-[56px] flex items-center justify-center gap-[5px] px-[28px] py-[16px]  transition"
                    onClick={() => window.location.href = '/add'}
                  >
                    Add Movie
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-[50px] py-[50px]">
            {!loading && (
              <>
                <div className="flex items-center justify-between align-middle ">
                  <div className="flex items-center gap-4">
                    <h2 className="font-[Montserrat] font-semibold text-[48px] text-center text-white">
                      My Move
                    </h2>

                    <img
                      src="/images/Group 24.svg"
                      alt="Bottom vector"
                      className="w-[20px] h-[20px] mt-[9px]"
                      onClick={() => window.location.href = '/add'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => fetchMovies(1, 10)}
                      disabled={loading}
                      className="w-[32px] h-[32px] flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <svg
                        className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="font-[Montserrat] text-[#FFFFFF] font-bold text-[16px] leading-[24px] text-center w-[104px] h-[32px] flex items-center justify-center gap-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Logout
                      <img
                        src="/images/logout_black_24dp.svg"
                        alt="Logout"
                        className="w-5 h-5 ml-2"
                        style={{ marginTop: 0 }}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}


            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-2 text-white">Loading movies...</span>
              </div>
            )}


            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}



            {!loading && !error && movies.length > 0 && (
              <div className="mt-8 mb-8 grid grid-cols-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                  <div key={movie._id} className="max-w-[202px] h-[400px] rounded-[12px] bg-[#092C39] backdrop-blur-[200px] p-2 pb-4 flex flex-col gap-4">
                    <div className="w-full h-[300px] bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {movie.image ? (
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-white text-sm">No Image</span>
                      )}
                    </div>

                    <div className="px-2 flex items-start justify-between">
                      <div>
                        <p className="text-white font-semibold text-[16px] leading-[24px] line-clamp-2">
                          {movie.title || movie.name}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {movie.publishingYear || formatDate(movie.createdAt)} • {movie.status}
                        </p>
                      </div>
                      <button
                        className="ml-2 p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Edit"
                        onClick={() => {
                          window.location.href = `/edit/${movie._id}`;
                        }}
                        style={{ lineHeight: 0 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-300 hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}





            {!loading && !error && movies.length === 0 && (
              <div className="flex flex-col items-center justify-center p-4 sm:p-20">
                <div className="flex flex-col items-center">
                  <h1 className="font-[Montserrat] font-semibold text-[#FFFFFF] text-[48px] leading-[56px] text-center mb-8 max-w-[600px] w-full">Your movie list is empty</h1>
                  <button className="bg-[#2BD17E] text-white rounded-[10px] w-[202px] h-[56px] flex items-center justify-center gap-[5px] px-[28px] py-[16px] transition"
                    onClick={() => window.location.href = '/add'}
                  >
                    Add Movie
                  </button>
                </div>
              </div>
            )}
            {!loading && !error && movies.length > 0 && (
              <div className="flex justify-center items-center mt-8 mb-8 space-x-4 ">

                <button
                  onClick={() => fetchMovies(currentPage - 1, 10)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                    textAlign: 'center'
                  }}
                >
                  Prev
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchMovies(pageNum, 10)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-[#2BD17E] text-white'
                            : 'bg-[#092C39] text-white border border-gray-600 hover:bg-gray-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        style={{
                          fontFamily: 'Montserrat',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '24px',
                          textAlign: 'center'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>


                <button
                  onClick={() => fetchMovies(currentPage + 1, 10)}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '24px',
                    textAlign: 'center'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )

      }

    </>
  )
}

export default MyMove;