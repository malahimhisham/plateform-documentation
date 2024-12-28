"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const UpdateSubCategoryPopup = ({subCategory, setUpdateSubCategory}) => {
    const [name, setName] = useState(subCategory?.name || "");
    const [isLoading, setIsLoading] = useState(false); 
      
    const handleUpdateSubCategory = async () => {
        try {
            setIsLoading(true); // Start loading state

            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
                return null;
              }
          
              const token = getCookie('authToken');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/psubcategory3/${subCategory._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return toast.error(data.message || "Failed to update sub category.");
            }

            toast.success("Sub Category updated successfully!");
            setUpdateSubCategory(false); // Close the popup
        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoading(false); // End loading state
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-300 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
                <h3 className="text-lg font-bold mb-4">
                    Update Category
                </h3>

                

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg w-full p-2"
                        required
                    />
                </div>

                <div className="flex justify-end">
                   
                    <button
                        onClick={() => setUpdateSubCategory(false)}
                        className="mr-2 border rounded px-4 py-2 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateSubCategory}
                        className={`${
                            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
                        } text-white rounded px-4 py-2 hover:bg-[#2c234d] transition`}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? (
                            <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Spinner
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default UpdateSubCategoryPopup