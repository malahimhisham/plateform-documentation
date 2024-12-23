"use client";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import AddCategoryPopup from "./AddCategoryPopup";
import DeleteCategoryPopup from "./DeleteCategoryPopup";
import UpdateCategoryPopup from "./UpdateCategory";
import SubCategory from "./SubCategory";

const HowTo = () => {
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Delete Category
  const [isCategoryModelOpen, setIsCategoryModelOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Update Category
  const [updateCategory, setUpdateCategory] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);

  //SubCategory 
  const [isSubCategory , setIsSubCategory] = useState(false)
  const [category , setCategory] = useState(null)

  // Fetch Categories from API
  const fetchCategories = async () => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    const token = getCookie('authToken');
    setLoading(true); // Start loading spinner
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pcategory1/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log("Network error:", error);
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isAddCategory, isCategoryModelOpen, updateCategory , isSubCategory]);

  // Filter Categories
  const filterCategories = () => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubCategory !== "") {
      filtered = filtered.filter(
        (category) => category.hasSubCategory === JSON.parse(selectedSubCategory)
      );
    }

    setFilteredCategories(filtered);
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubCategory("");
    setFilteredCategories(categories);
  };

  useEffect(() => {
    filterCategories();
  }, [searchTerm, selectedSubCategory]);

  const renderCategory = (categoryList) => {
    if (!categoryList || categoryList.length === 0) {
      return (
        <div className="p-4 text-center text-purple-500 italic">
          No categories found
        </div>
      );
    }

    return categoryList.map((category) => (
      <div
        key={category._id}
        className="p-4 border rounded-lg shadow-md mb-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer relative"
      >
        <div onClick={()=> {setCategory(category) ; setIsSubCategory(true)}}>
          <h3 className="text-lg font-bold text-primary">{category.name}</h3>
          <p className="text-gray-700 mt-2">
            <span className="font-bold">Has Subcategory:</span>{" "}
            {category.hasSubCategory ? "Yes" : "No"}
          </p>
        </div>

        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            title="Edit User"
            className="text-purple-600 hover:text-purple-800"
            onClick={() => {
              setCategoryToUpdate(category);
              setUpdateCategory(true);
            }}
          >
            <FiEdit />
          </button>
          <button
            title="Delete"
            className="text-red-600 hover:text-red-800"
            onClick={() => {
              setCategoryToDelete(category);
              setIsCategoryModelOpen(true);
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
      {!isSubCategory ? (
        <div className="lg:mt-auto mt-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">How To</h2>
  
          {/* Filter Section */}
          <div className="bg-primary p-4 rounded-md shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by category name"
                className="px-4 py-2 rounded-md text-primary placeholder-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 rounded-md text-primary"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                <option value="">Select Has SubCategory</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
  
          {/* Buttons Section */}
          <div className="mb-4">
            <button
              onClick={() => setIsAddCategory(true)}
              className="px-4 mr-2 font-bold py-2 bg-primary text-white rounded shadow hover:bg-[#2c234d] transition"
            >
              Add Category
            </button>
          </div>
  
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-8 w-8 border-t-4 border-primary border-solid rounded-full"></div>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderCategory(filteredCategories)}
              </div>
            </div>
          )}
  
          {/* Popups */}
          {isAddCategory && <AddCategoryPopup setIsAddCategory={setIsAddCategory} />}
          {isCategoryModelOpen && categoryToDelete && (
            <DeleteCategoryPopup
              setIsDeleteCategoryModalOpen={setIsCategoryModelOpen}
              categoryToDelete={categoryToDelete}
              setCategoryToDelete={setCategoryToDelete}
            />
          )}
  
          {updateCategory && categoryToUpdate && (
            <UpdateCategoryPopup
              setUpdateCategory={setUpdateCategory}
              categoryToUpdate={categoryToUpdate}
              setCategoryToUpdate={setCategoryToUpdate}
            />
          )}
        </div>
      ) : (
        <SubCategory setIsSubCategory={setIsSubCategory} category={category}/>
      )}
    </>
  );
}

export default HowTo;
