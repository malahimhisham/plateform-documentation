import React, { useState } from "react";
import toast from "react-hot-toast";

const AddCategoryPopup = ({ setIsAddCategory }) => {
  const [name, setName] = useState("");
  // const [hasSubCategory, setHasSubCategory] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setIsLoading(true); 
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      }
  
      const token = getCookie('authToken');
  

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategory2/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name}),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Category added successfully");
        setIsAddCategory(false); // Close the modal
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      toast.error("Error adding category");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
        <h3 className="text-lg font-bold mb-4">Add Category</h3>

        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-semibold mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg w-full p-2 text-sm"
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Has Subcategory</label>
          <input
            type="checkbox"
            checked={hasSubCategory}
            onChange={() => setHasSubCategory(!hasSubCategory)}
            className="w-4 h-4 accent-primary"
          />
        </div> */}

        <div className="flex justify-end space-x-2 mt-4">
         
          <button
            onClick={() => setIsAddCategory(false)}
            className="border mr-2  rounded px-4 py-2 hover:bg-gray-200 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white rounded px-4 py-2 hover:bg-[#2c234d] transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div> // Spinner
            ) : (
              "Add Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPopup;
