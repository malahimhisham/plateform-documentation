import React from 'react';
import toast from 'react-hot-toast';

const DeleteSubCategorySession = ({ setIsDeleteSessionModalOpen, sessionToDelete, setSessionToDelete }) => {
    const handleDelete = async () => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
          }
      
          const token = getCookie('authToken');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategorysession1/delete/${sessionToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Section deleted successfully");
                setSessionToDelete(null);
                setIsDeleteSessionModalOpen(false);
            } else {
                toast.error(data.message || "Failed to delete Section");
                console.log(data.message);
            }
        } catch (error) {
            toast.error("Error deleting Section");
            console.log("Error deleting Section:", error);
        }finally{
            setIsDeleteSessionModalOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this session</p>
                <div className="flex justify-between mt-6">
                   
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setIsDeleteSessionModalOpen(false)}
                    >
                        No
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSubCategorySession;
