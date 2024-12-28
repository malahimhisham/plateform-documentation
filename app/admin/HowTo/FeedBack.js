"use client";
import React, { useEffect, useState } from "react";

const FeedBack = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch Categories from API
  const fetchCategories = async () => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }

    const token = getCookie("authToken");
    setLoading(true); // Start loading spinner
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/pfeedback1/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        // Separate categories and subcategories
        const categoryList = data.data.filter((item) => item.CategoryAssign);
        const subCategoryList = data.data.filter((item) => item.SubCategoryAssign);

        setCategories(categoryList);
        setSubCategories(subCategoryList);
      } else {
        setCategories([]);
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false); // End loading spinner
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderFeedback = (item) => {
    if (item.userAssign.length > 0) {
      return (
        <div>
          <p className="text-green-600">Positive Feedback: {item.Positive}</p>
          <p className="text-red-600">Negative Feedback: {item.Negative}</p>
        </div>
      );
    }
    return <p className="text-gray-600 italic">No feedback given</p>;
  };

  const renderCategories = (categoryList) => {
    if (!categoryList || categoryList.length === 0) {
      return (
        <div className="p-4 text-center text-purple-500 italic">
          No items found
        </div>
      );
    }

    return categoryList.map((item) => (
      <div
        key={item._id}
        className="p-4 border rounded-lg shadow-md mb-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer relative"
      >
        <h3 className="text-lg font-bold text-primary">Category: {" "}
        {item.CategoryAssign ? item.CategoryAssign.name : "Unknown"}
        </h3>
        <div>{renderFeedback(item)}</div>
      </div>
    ));
  };
  const renderSubCategories = (categoryList) => {
    if (!categoryList || categoryList.length === 0) {
      return (
        <div className="p-4 text-center text-purple-500 italic">
          No items found
        </div>
      );
    }

    return categoryList.map((item) => (
      <div
        key={item._id}
        className="p-4 border rounded-lg shadow-md mb-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer relative"
      >
        <h3 className="text-lg font-bold text-primary">Category: {" "}
          {item.SubCategoryAssign ? item.SubCategoryAssign.categoryAssign.name : "Unknown"}
        </h3>
        <h3 className="text-lg font-bold text-primary">SubCategory: {" "}
          {item.SubCategoryAssign ? item.SubCategoryAssign.name : "Unknown"}
        </h3>
        <div>{renderFeedback(item)}</div>
      </div>
    ));
  };

  return (
    <div className="lg:mt-auto mt-12">
      <h2 className="text-2xl font-bold mb-6 text-primary">Feed Backs</h2>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-t-4 border-primary border-solid rounded-full"></div>
        </div>
      ) : (
        <div className="mb-8">
          {/* Categories */}
          {categories.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderCategories(categories)}
              </div>
            </>
          )}

          {/* Subcategories */}
          {subCategories.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-8 mb-4">Subcategories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderSubCategories(subCategories)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedBack;
