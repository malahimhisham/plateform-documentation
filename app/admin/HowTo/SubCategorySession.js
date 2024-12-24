"use client"
import React, { useEffect, useState } from 'react'
import CategoryDraggableSession from './CategoryDragableSection';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddCategorySession from './AddCategorySession';
import toast from 'react-hot-toast';
import UpdateSubCategorySession from './UpdateSubCategorySession';
import DeleteSubCategorySession from './DeleteSubCategorySession';
import AddSubCategorySession from './AddSubCategorySession';

const SubCategorySession = ({subCategory, category, setIsSubCategory , setIsSessionOpen }) => {

    const [isSession, setIsSession] = useState(false)
    const [session, setSession] = useState([])
    const [updateSessionPopup, setUpdateSessionPopup] = useState(false)
    const [sessionData, setSessionData] = useState(null)

    //Delete Section
    const [isSectionModelOpen, setIsDeleteSessionModalOpen] = useState(false)
    const [sessionToDelete, setSessionToDelete] = useState(null)

    //loading 
    const [loading, setLoading] = useState(false);

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
            console.log("selectedCourse._id", subCategory._id)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategorysession1/search/${subCategory._id}`, {
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
    }, [isSession, updateSessionPopup , isSectionModelOpen]);

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategorysession1/update-order`, {
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

    return (
        <>
            <div className="lg:mt-auto mt-12">
                {/* Breadcrumb Navigation */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center space-x-2 font-medium text-sm sm:text-base">
                        <li>
                            <button
                                onClick={() => { setIsSessionOpen(false); setIsSubCategory(false) }}
                                className="cursor-pointer transition hover:underline truncate"
                                title={"category"}
                            >
                                {category.name}
                            </button>
                        </li>
                        <li>
                            <span className="mx-2 hidden sm:inline">&gt;</span>
                        </li>
                        <li>
                            <button
                                onClick={() => { setIsSessionOpen(false); }}
                                className="cursor-pointer transition hover:underline truncate"
                                title={"sub category"}
                            >
                                {subCategory.name}
                            </button>
                        </li>
                        <li>
                            <span className="mx-2 hidden sm:inline">&gt;</span>
                        </li>
                        <li className="text-primary font-bold truncate">Sections</li>
                    </ol>
                </nav>


                {/* <h2 className="text-2xl font-bold mb-6 text-primary">{`${selectedCourse.name} - ${selectedLesson.name} `}</h2> */}

                <div className="mb-4">
                    <button
                        onClick={() => setIsSession(true)}
                        className="px-4 mr-2 py-2 font-bold bg-primary text-white rounded shadow hover:bg-[#2c234d] transition"
                    >
                        Add Section
                    </button>
                </div>

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

            </div>

            {isSession && <AddSubCategorySession setIsSession={setIsSession} category={subCategory} />}
            {updateSessionPopup && sessionData && <UpdateSubCategorySession sessionData={sessionData} setUpdateSessionPopup={setUpdateSessionPopup} />}
            {isSectionModelOpen && sessionToDelete && <DeleteSubCategorySession setIsDeleteSessionModalOpen={setIsDeleteSessionModalOpen} sessionToDelete={sessionToDelete} setSessionToDelete={setSessionToDelete} />}
        </>
    )
}

export default SubCategorySession