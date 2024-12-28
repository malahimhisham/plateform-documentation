"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import AddSubCategoryPopup from "./AddSubCategoryPopup";
import UpdateSubCategoryPopup from "./UpdateSubCategoryPopup";
import DeleteSubCategoryPopup from "./DeleteSubCategoryPopup";
import SubCategorySession from "./SubCategorySession";
import CategoryDraggableSession from "./CategoryDragableSection";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddCategorySession from "./AddCategorySession";
import UpdateCategorySession from "./UpdateCategorySession";
import DeleteCategorySession from "./DeleteCategorySession";

const SubCategory = ({ category, setIsSubCategory }) => {
    const [isAddSubCategory, setIsAddSubCategory] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryAssign, setSelectedCategoryAssign] = useState(""); // For filtering by categoryAssign.name

    // Delete SubCategory
    const [isSubCategoryModelOpen, setIsSubCategoryModelOpen] = useState(false);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

    // Update SubCategory
    const [updateSubCategory, setUpdateSubCategory] = useState(false);
    const [subCategoryToUpdate, setSubCategoryToUpdate] = useState(null);

    const [isSessionOpen, setIsSessionOpen] = useState(false)
    const [subCategory, setSubCategory] = useState(null)

    //Category Section
    const [isSession, setIsSession] = useState(false)
    const [session, setSession] = useState([])
    const [updateSessionPopup, setUpdateSessionPopup] = useState(false)
    const [sessionData, setSessionData] = useState(null)

    //Delete Section
    const [isSectionModelOpen, setIsDeleteSessionModalOpen] = useState(false)
    const [sessionToDelete, setSessionToDelete] = useState(null)

    const fetchSessions = async () => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        const token = getCookie('authToken');
        setLoading(true)
        try {
            console.log("selectedCourse._id", category._id)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategorysession3/search/${category._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {

                setSession(data.sessions);

                console.log("data.sessions", data.sessions)
            } else {
                setSession([])
            }
        } catch (error) {
            console.log("Network error:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchSessions()
    }, [isSession, updateSessionPopup, isSectionModelOpen]);



    const moveSession = async (draggedId, targetId) => {
        console.log("error")
        console.log("draggedId", draggedId)
        console.log("targetId", targetId)
        const draggedIndex = session.findIndex((sess) => sess._id === draggedId);
        const targetIndex = session.findIndex((sess) => sess._id === targetId);

        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
            return; // Invalid move or same item
        }

        const updatedSessions = [...session];
        const [draggedItem] = updatedSessions.splice(draggedIndex, 1); // Remove the dragged item
        updatedSessions.splice(targetIndex, 0, draggedItem); // Insert at the target position

        setSession(updatedSessions);

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        const token = getCookie('authToken');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategorysession3/update-order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ draggedId, targetId }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Session order updated successfully:', data);
            } else {
                console.log('Failed to update session order:', response.statusText);
            }
        } catch (error) {
            console.log('Error updating session order:', error);
        }
    };

    const renderSession = (sessionList) => {
        if (!sessionList || sessionList.length === 0) {
            return (
                <div className="p-4 text-center text-purple-500 italic">
                    No session found
                </div>
            );
        }

        return (
            <>
                {sessionList.map((session, index) => (
                    <CategoryDraggableSession
                        key={session._id}
                        session={session}
                        moveSession={moveSession}
                        index={index}
                        setUpdateSessionPopup={setUpdateSessionPopup}
                        setSessionData={setSessionData}
                        setIsDeleteSessionModalOpen={setIsDeleteSessionModalOpen}
                        setSessionToDelete={setSessionToDelete}
                    />
                ))}

            </>
        );
    };


    // Fetch SubCategories from API
    const fetchSubCategories = async () => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        }

        const token = getCookie("authToken");
        setLoading(true); // Start loading spinner
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategory3/all?categoryAssign=${category._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setSubCategories(data.pSubCategory3s);
                setFilteredSubCategories(data.pSubCategory3s);
            } else {
                setSubCategories([]);
            }
        } catch (error) {
            console.log("Network error:", error);
        } finally {
            setLoading(false); // End loading spinner
        }
    };



    useEffect(() => {
        fetchSubCategories();
    }, [isAddSubCategory, isSubCategoryModelOpen, updateSubCategory]);

    // Filter SubCategories
    const filterSubCategories = () => {
        let filtered = subCategories;

        if (searchTerm) {
            filtered = filtered.filter(
                (subCategory) =>
                    subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }


        setFilteredSubCategories(filtered);
    };

    // Reset Filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategoryAssign("");
        setFilteredSubCategories(subCategories);
    };

    useEffect(() => {
        filterSubCategories();
    }, [searchTerm, selectedCategoryAssign]);

    const renderSubCategory = (subCategoryList) => {
        if (!subCategoryList || subCategoryList.length === 0) {
            return (
                <div className="p-4 text-center text-purple-500 italic">
                    No subcategories found
                </div>
            );
        }

        return subCategoryList.map((subCategory) => (
            <div
                key={subCategory._id}
                className="p-4 border rounded-lg shadow-md mb-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer relative"
            >
                <div onClick={() => { setIsSessionOpen(true); setSubCategory(subCategory) }}>
                    <h3 className="text-lg font-bold text-primary">{subCategory.name}</h3>
                    <p className="text-gray-700 mt-2">
                        <span className="font-bold">Category: </span>
                        {subCategory.categoryAssign.name}
                    </p>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => {
                            setSubCategoryToUpdate(subCategory);
                            setUpdateSubCategory(true);
                        }}
                    >
                        <FiEdit />
                    </button>
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                            setSubCategoryToDelete(subCategory);
                            setIsSubCategoryModelOpen(true);
                        }}
                    >
                        <FiTrash />
                    </button>
                </div>
            </div>
        ));
    };

    return (

        <>
            {!isSessionOpen ? (
                <div className="lg:mt-auto mt-12">

                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center space-x-2 font-medium text-sm sm:text-base">
                            <li >
                                <button className="hover:underline" onClick={() => setIsSubCategory(false)}>
                                    {category.name}
                                </button>
                            </li>
                            <li>
                                <span className="mx-2 hidden sm:inline">&gt;</span>
                            </li>
                            <li className="text-primary font-bold truncate">Sub Categories</li>
                        </ol>
                    </nav>


                    {/* <h2 className="text-2xl font-bold mb-6 text-primary">Sub Categories</h2> */}

                    {/* Filters */}
                    <div className="bg-primary p-4 rounded-md shadow-md mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search by category name"
                                className="px-4 py-2 rounded-md text-primary placeholder-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />


                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Add SubCategory Button */}
                    <button
                        onClick={() => setIsAddSubCategory(true)}
                        className="p-3 bg-primary mr-3 text-white rounded-md mb-6"
                    >
                        Add SubCategory
                    </button>
                    <button
                        onClick={() => setIsSession(true)}
                        className="p-3 bg-primary text-white rounded-md mb-6"
                    >
                        Add Section
                    </button>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-t-4 border-primary border-solid rounded-full"></div>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Sections</h3>
                            <div className="grid  overflow-y-auto w-full grid-cols-1 ">
                                <DndProvider backend={HTML5Backend}>
                                    {renderSession(session)}
                                </DndProvider>
                            </div>
                        </div>
                    )}



                    {/* SubCategories List */}
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-t-4 border-primary border-solid rounded-full"></div>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Sub Categories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {renderSubCategory(filteredSubCategories)}
                            </div>
                        </div>
                    )}


                    {/* Popup Modals */}
                    {isAddSubCategory && <AddSubCategoryPopup category={category} setIsAddSubCategory={setIsAddSubCategory} />}
                    {isSubCategoryModelOpen && (
                        <DeleteSubCategoryPopup
                            subCategoryToDelete={subCategoryToDelete}
                            setIsSubCategoryModelOpen={setIsSubCategoryModelOpen}
                            setSubCategoryToDelete={setSubCategoryToDelete}
                        />
                    )}
                    {updateSubCategory && (
                        <UpdateSubCategoryPopup
                            subCategory={subCategoryToUpdate}
                            setUpdateSubCategory={setUpdateSubCategory}
                        />
                    )}

                    {isSession && <AddCategorySession setIsSession={setIsSession} category={category} />}
                    {updateSessionPopup && sessionData && <UpdateCategorySession sessionData={sessionData} setUpdateSessionPopup={setUpdateSessionPopup} />}
                    {isSectionModelOpen && sessionToDelete && <DeleteCategorySession setIsDeleteSessionModalOpen={setIsDeleteSessionModalOpen} sessionToDelete={sessionToDelete} setSessionToDelete={setSessionToDelete} />}
                </div>
           


            ) : (
                <SubCategorySession category={category} setIsSubCategory={setIsSubCategory} subCategory={subCategory} setIsSessionOpen={setIsSessionOpen} />
            )}

        </>
    );
};

export default SubCategory;
