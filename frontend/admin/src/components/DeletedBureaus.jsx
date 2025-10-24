import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints, Uploads } from "./Apis";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineCalendar
} from "react-icons/ai";
import Loader from "./Loader";

const DeletedBureaus = () => {
  const [bureaus, setBureaus] = useState([]);
  const [filteredBureaus, setFilteredBureaus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 30;

  const fetchBureaus = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.BureauManage);
      const data = response.data;
      const list = Array.isArray(data?.bureauProfiles) ? data.bureauProfiles : [];
      const deleted = list.filter(b => b.deleted == 1);
      setBureaus(deleted);
      filterAndPaginateBureaus(deleted, searchQuery, currentPage);
    } catch (error) {
      console.error("Error fetching deleted bureaus:", error);
      setBureaus([]);
      setFilteredBureaus([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateBureaus = (bureauList, query, page) => {
    const filtered = query.trim() === ""
      ? bureauList
      : bureauList.filter((bureau) =>
          (bureau.ownerName && bureau.ownerName.toLowerCase().includes(query.toLowerCase())) ||
          (bureau.email && bureau.email.toLowerCase().includes(query.toLowerCase())) ||
          (bureau.bureauName && bureau.bureauName.toLowerCase().includes(query.toLowerCase())) ||
          (bureau.mobileNumber && bureau.mobileNumber.toLowerCase().includes(query.toLowerCase())) ||
          (bureau.bureauId && bureau.bureauId.toLowerCase().includes(query.toLowerCase()))
        );

    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount);

    const validPage = page > totalPagesCount ? 1 : page;

    const start = (validPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedResults = filtered.slice(start, end);

    setFilteredBureaus(paginatedResults);
    if (validPage !== page) setCurrentPage(validPage);
  };

  useEffect(() => { fetchBureaus(); }, []);
  useEffect(() => { filterAndPaginateBureaus(bureaus, searchQuery, currentPage); }, [searchQuery, currentPage, bureaus]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dt = new Date(dateString);
    return isNaN(dt.getTime()) ? dateString : dt.toLocaleDateString();
  };

  const restoreBureau = async (bureau) => {
    try {
      await apiClient.put(apiEndpoints.Bureauupdate, { bureauId: bureau.bureauId, deleted: 0 });
      const updated = bureaus.filter(b => b.bureauId !== bureau.bureauId);
      setBureaus(updated);
      filterAndPaginateBureaus(updated, searchQuery, currentPage);
      alert("Bureau restored successfully!");
    } catch (error) {
      console.error("Error restoring bureau:", error);
      alert("Error restoring bureau. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Deleted Bureaus</h1>
        <div className="w-full sm:w-1/2">
          <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search by Bureau ID, Name, Email, Company, or Mobile" className="border px-4 py-2 w-full rounded-lg shadow-sm" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBureaus.length > 0 ? (
              filteredBureaus.map((bureau) => (
                <div key={bureau.bureauId} className={`border rounded-lg shadow-md p-4 bg-white flex flex-col relative hover:shadow-lg transition-shadow duration-300 border-red-300 bg-red-50`}>
                  <div className={`absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full`}>Deleted</div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start mt-6">
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                      <img src={bureau.image ? `${Uploads}/${bureau.image}` : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"} alt={bureau.ownerName} className={`w-20 h-20 object-cover rounded-lg border opacity-50`} />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="mb-2 flex items-start"><AiOutlineUser className="text-gray-600 mr-2 mt-1 flex-shrink-0" /><div className="min-w-0"><h3 className="font-bold text-sm text-gray-800">Bureau Id</h3><p className="text-gray-600 truncate">{bureau.bureauId}</p></div></div>
                      <div className="mb-2 flex items-start"><AiOutlineShop className="text-gray-600 mr-2 mt-1 flex-shrink-0" /><div className="min-w-0"><h3 className="font-bold text-sm text-gray-800">Bureau Name</h3><p className="text-gray-600 truncate">{bureau.bureauName}</p></div></div>
                      <div className="mb-2 flex items-start"><AiOutlineMail className="text-gray-600 mr-2 mt-1 flex-shrink-0" /><div className="min-w-0"><h3 className="font-bold text-sm text-gray-800">Email</h3><p className="text-gray-600 truncate">{bureau.email}</p></div></div>
                      <div className="mb-2 flex items-start"><AiOutlinePhone className="text-gray-600 mr-2 mt-1 flex-shrink-0" /><div className="min-w-0"><h3 className="font-bold text-sm text-gray-800">Mobile</h3><p className="text-gray-600 truncate">{bureau.mobileNumber}</p></div></div>
                      <div className="mb-2 flex items-start"><AiOutlineCalendar className="text-gray-600 mr-2 mt-1 flex-shrink-0" /><div className="min-w-0"><h3 className="font-bold text-sm text-gray-800">Created</h3><p className="text-gray-600 truncate">{formatDate(bureau.createdAt)}</p></div></div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-between">
                    <button className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded flex items-center justify-center transition-colors text-sm`} onClick={() => restoreBureau(bureau)}>
                      <AiOutlineEye className="mr-1" /> Restore
                    </button>
                    <button className="flex-1 bg-gray-400 text-white px-2 py-1.5 rounded flex items-center justify-center text-sm" disabled>
                      <AiOutlineDelete className="mr-1" /> Deleted
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8"><p className="text-gray-500 text-lg">No deleted bureaus found.</p></div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 border rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-50"}`}>{page}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeletedBureaus; 