import React, { useState } from "react";
import toast from "react-hot-toast";

const AddSubCategoryPopup = ({ setIsAddSubCategory, category }) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  // Function to get auth token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setIsLoading(true); // Set loading state

    const token = getCookie("authToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/psubcategory1/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, categoryAssign: category._id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("SubCategory added successfully");
        setIsAddSubCategory(false);
      } else {
        toast.error(data.message || "Failed to add SubCategory");
      }
    } catch (error) {
      toast.error("Error adding SubCategory");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-300 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-[40vw] md:w-[50vw] lg:w-[60vw]">
        <h3 className="text-lg font-bold mb-4">Add SubCategory</h3>

       

        <div className="mb-4">
          <label htmlFor="subCategoryName" className="block text-sm font-semibold mb-1">
            SubCategory Name
          </label>
          <input
            type="text"
            id="subCategoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg w-full p-2 text-sm"
            required
          />
        </div>


        <div className="flex justify-end space-x-2 mt-4">
         
          <button
            onClick={() => setIsAddSubCategory(false)}
            className="border rounded mr-2 px-4 py-2 hover:bg-gray-200 transition"
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
              "Add SubCategory"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPopup;
