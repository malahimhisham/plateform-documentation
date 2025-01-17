"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

const DeleteCategoryPopup = ({ setIsDeleteCategoryModalOpen, categoryToDelete, setCategoryToDelete }) => {
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleDelete = async () => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
          }
      
          const token = getCookie('authToken');

        try {
            setIsLoading(true); // Start loader
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/pcategory1/delete/${categoryToDelete._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                toast.success("Category deleted successfully");
                setCategoryToDelete(null);
                setIsDeleteCategoryModalOpen(false); // Close the modal after success
            } else {
                toast.error(data.message || "Failed to delete category");
                console.log(data.message);
            }
        } catch (error) {
            toast.error("Error deleting category");
            console.log("Error deleting category:", error);
        } finally {
            setIsLoading(false); // Stop loader
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p>
                    Are you sure you want to delete the category &quot;{categoryToDelete?.name || "Unknown"}&quot;?
                </p>
                <div className="flex justify-between mt-6">
                    
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setIsDeleteCategoryModalOpen(false)}
                        disabled={isLoading} // Disable cancel button while loading
                    >
                        No
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Spinner
                        ) : (
                            "Yes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryPopup;
