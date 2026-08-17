import React, {
    useEffect,
    useState,
} from "react";

import {
    Search,
    Plus,
    Pencil,
    Trash2,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
} from "lucide-react";

import Sidebar
    from "../../components/layout/Sidebar";

import AddAttractionModal
    from "../../components/forms/AddAttractionModal";

import {
    getAttractions,
    deleteAttraction,
} from "../../services/attractionService";


const categories = [
    "All",
    "Cultural Heritage",
    "Nature",
    "Historical Site",
    "Beach",
];


export default function AttractionsManagement() {

    const [attractions, setAttractions] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [category, setCategory] =
        useState("All");

    const [sortBy, setSortBy] =
        useState("name");

    const [sortOrder, setSortOrder] =
        useState("asc");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize] =
        useState(10);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalItems, setTotalItems] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingAttraction, setEditingAttraction] =
        useState(null);


    // ======================================================
    // Load attractions
    // ======================================================

    const loadAttractions = async () => {

        try {

            setLoading(true);
            setError("");

            const result =
                await getAttractions({
                    search: searchTerm,
                    category,
                    sortBy,
                    sortOrder,
                    page: currentPage,
                    pageSize,
                });

            setAttractions(
                result.data || []
            );

            setTotalPages(
                result.pagination?.totalPages || 1
            );

            setTotalItems(
                result.pagination?.totalItems || 0
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to load attractions."
            );

        } finally {

            setLoading(false);
        }
    };


    // ======================================================
    // Fetch when filters change
    // ======================================================

    useEffect(() => {

        const timer =
            setTimeout(() => {
                loadAttractions();
            }, 300);

        return () =>
            clearTimeout(timer);

    }, [
        searchTerm,
        category,
        sortBy,
        sortOrder,
        currentPage,
    ]);


    // ======================================================
    // Delete
    // ======================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this attraction?"
            );

        if (!confirmed)
            return;

        try {

            await deleteAttraction(id);

            if (
                attractions.length === 1 &&
                currentPage > 1
            ) {

                setCurrentPage(
                    currentPage - 1
                );

            } else {

                loadAttractions();

            }

        } catch (err) {

            alert(
                err.message ||
                "Failed to delete attraction."
            );
        }
    };


    // ======================================================
    // Add
    // ======================================================

    const handleAdd = () => {

        setEditingAttraction(null);

        setShowModal(true);
    };


    // ======================================================
    // Edit
    // ======================================================

    const handleEdit = (attraction) => {

        setEditingAttraction(
            attraction
        );

        setShowModal(true);
    };


    // ======================================================
    // Modal close
    // ======================================================

    const handleModalClose = () => {

        setShowModal(false);

        setEditingAttraction(null);
    };


    // ======================================================
    // After save
    // ======================================================

    const handleSaved = () => {

        handleModalClose();

        loadAttractions();
    };


    // ======================================================
    // Sort
    // ======================================================

    const handleSort = (field) => {

        if (sortBy === field) {

            setSortOrder(
                sortOrder === "asc"
                    ? "desc"
                    : "asc"
            );

        } else {

            setSortBy(field);

            setSortOrder("asc");
        }

        setCurrentPage(1);
    };


    // ======================================================
    // Pagination
    // ======================================================

    const goToPage = (page) => {

        if (
            page >= 1 &&
            page <= totalPages
        ) {

            setCurrentPage(page);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar />

            <main className="ml-64 p-6 md:p-10">

                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}

                    <div className="flex items-center justify-between">

                        <div>

                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Attractions Management
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage tourist attractions
                            </p>

                        </div>

                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                        >

                            <Plus className="w-4 h-4" />

                            Add Attraction

                        </button>

                    </div>


                    {/* Controls */}

                    <div className="flex flex-col md:flex-row gap-3">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={17}
                            />

                            <input
                                type="text"
                                placeholder="Search attractions..."
                                value={searchTerm}
                                onChange={(e) => {

                                    setSearchTerm(
                                        e.target.value
                                    );

                                    setCurrentPage(1);
                                }}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                            />

                        </div>


                        {/* Category */}

                        <select
                            value={category}
                            onChange={(e) => {

                                setCategory(
                                    e.target.value
                                );

                                setCurrentPage(1);
                            }}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                        >

                            {categories.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >

                                        {item === "All"
                                            ? "All Categories"
                                            : item}

                                    </option>

                                )
                            )}

                        </select>


                        {/* Sort */}

                        <select
                            value={sortBy}
                            onChange={(e) => {

                                setSortBy(
                                    e.target.value
                                );

                                setCurrentPage(1);
                            }}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                        >

                            <option value="name">
                                Name
                            </option>

                            <option value="category">
                                Category
                            </option>

                            <option value="location">
                                Location
                            </option>

                            <option value="createdat">
                                Created Date
                            </option>

                        </select>


                        {/* Order */}

                        <button
                            onClick={() => {

                                setSortOrder(
                                    sortOrder === "asc"
                                        ? "desc"
                                        : "asc"
                                );

                                setCurrentPage(1);
                            }}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center gap-2"
                        >

                            <ArrowUpDown
                                size={16}
                            />

                            {sortOrder === "asc"
                                ? "Ascending"
                                : "Descending"}

                        </button>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>

                    )}


                    {/* Table */}

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50 border-b">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold">
                                            Image
                                        </th>

                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold cursor-pointer"
                                            onClick={() =>
                                                handleSort("name")
                                            }
                                        >

                                            <div className="flex items-center gap-1">

                                                Name

                                                <ArrowUpDown size={13} />

                                            </div>

                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold">
                                            Location
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-12 text-slate-500"
                                            >
                                                Loading attractions...
                                            </td>

                                        </tr>

                                    ) : attractions.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-12 text-slate-500"
                                            >
                                                No attractions found.
                                            </td>

                                        </tr>

                                    ) : (

                                        attractions.map(
                                            (item) => (

                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="px-6 py-3">

                                                        <img
                                                            src={item.mainImageUrl}
                                                            alt={item.name}
                                                            className="w-20 h-12 object-cover rounded-md border"
                                                            onError={(e) => {

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                            }}
                                                        />

                                                    </td>


                                                    <td className="px-6 py-3 font-semibold text-slate-900">
                                                        {item.name}
                                                    </td>


                                                    <td className="px-6 py-3 text-slate-600">
                                                        {item.category}
                                                    </td>


                                                    <td className="px-6 py-3 text-slate-600">

                                                        <div className="flex items-center gap-2">

                                                            <MapPin
                                                                size={16}
                                                                className="text-slate-400"
                                                            />

                                                            {item.address}

                                                        </div>

                                                    </td>


                                                    <td className="px-6 py-3">

                                                        <div className="flex justify-end gap-2">

                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(item)
                                                                }
                                                                className="p-2 border rounded-md hover:text-teal-700"
                                                            >

                                                                <Pencil size={16} />

                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(item.id)
                                                                }
                                                                className="p-2 border border-red-200 text-red-500 rounded-md hover:bg-red-50"
                                                            >

                                                                <Trash2 size={16} />

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* Pagination */}

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-slate-500">
                            Total: {totalItems} attractions
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    goToPage(
                                        currentPage - 1
                                    )
                                }
                                className="p-2 border rounded-md disabled:opacity-40"
                            >

                                <ChevronLeft size={16} />

                            </button>


                            <span className="text-sm px-3">
                                Page {currentPage} of {totalPages}
                            </span>


                            <button
                                disabled={
                                    currentPage >=
                                    totalPages
                                }
                                onClick={() =>
                                    goToPage(
                                        currentPage + 1
                                    )
                                }
                                className="p-2 border rounded-md disabled:opacity-40"
                            >

                                <ChevronRight size={16} />

                            </button>

                        </div>

                    </div>

                </div>

            </main>


            {/* Add / Edit Modal */}

            {showModal && (

                <AddAttractionModal
                    isOpen={showModal}
                    onClose={handleModalClose}
                    attraction={editingAttraction}
                    onSaved={handleSaved}
                />

            )}

        </div>
    );
}