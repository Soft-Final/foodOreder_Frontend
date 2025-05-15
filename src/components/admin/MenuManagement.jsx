import { useState, useEffect, useCallback } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { Combobox } from "@headlessui/react";
import PizzaImg from "../../assets/pizza.jpg";
import { createMenuItem, addCategory, getCategories, getMenuItems, deleteMenuItem, updateMenuItem } from "../api/menuApi";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  category: yup.string().required("Category is required"),
  image: yup.mixed(),
});

const MenuManagement = () => {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      is_available: true,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category_id", values.category);
        formData.append("is_available", values.is_available);
        
        if (values.image && values.image !== "") {
          formData.append("image", values.image);
        }

        let response;
        if (editItem) {
          response = await updateMenuItem(editItem.id, formData);
          setMenuItems(menuItems.map(item => 
            item.id === editItem.id ? {
              ...response,
              image: values.image ? URL.createObjectURL(values.image) : item.image
            } : item
          ));
        } else {
          response = await createMenuItem(formData);
          setMenuItems([...menuItems, {
            ...response,
            image: values.image ? URL.createObjectURL(values.image) : null,
          }]);
        }
        
        handleClose();
      } catch (error) {
        console.error("Failed to save item. Full error:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        if (error.response) {
          console.error("Error response:", error.response);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpen = (item = null) => {
    setOpen(true);
    if (item) {
      setEditItem(item);
      setImagePreview(item.image);
      formik.setValues({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category_id || item.category?.id,
        image: null,
        is_available: item.is_available ?? true,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setImagePreview(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Category
          </button>
          <button
            onClick={() => handleOpen()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Menu Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-600 font-bold">${item.price}</span>
                <span className="text-sm text-gray-500">
                  {typeof item.category === 'object' ? item.category.name : item.category}
                </span>
              </div>
              <div className="text-sm">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-white ${
                    item.is_available ? "bg-green-600" : "bg-red-500"
                  }`}
                >
                  {item.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex space-x-2">
              <button
                onClick={() => handleOpen(item)}
                className="text-blue-600 hover:text-blue-800 p-2"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setItemToDelete(item.id);
                }}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editItem ? "Edit" : "Add New"} Menu Item
              </h2>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.description &&
                    formik.errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.description}
                      </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        formik.touched.price && formik.errors.price
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      disabled={isLoadingCategories}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        formik.touched.category && formik.errors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${isLoadingCategories ? "bg-gray-100" : ""}`}
                    >
                      <option value="">
                        {isLoadingCategories ? "Loading categories..." : "Select a category"}
                      </option>
                      {!isLoadingCategories && categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        formik.setFieldValue("image", file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  />
                  {formik.touched.image && formik.errors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.image}
                    </p>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Available
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "is_available",
                        !formik.values.is_available
                      )
                    }
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                      formik.values.is_available
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                        formik.values.is_available
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Add New Category</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      setCategoryError("");
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      categoryError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter category name"
                  />
                  {categoryError && (
                    <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newCategory.trim()) {
                      setCategoryError("Category name is required");
                      return;
                    }
                    
                    setIsAddingCategory(true);
                    setCategoryError("");
                    
                    try {
                     
                      const newCat = await addCategory(newCategory.trim());
                      setCategories((prev) => [...prev, newCat]);
                      setShowAddCategory(false);
                      setNewCategory("");
                    } catch (error) {
                      console.error("Error adding category:", error);
                      setCategoryError(error.message || "Failed to add category. Please try again.");
                    } finally {
                      setIsAddingCategory(false);
                    }
                  }}
                  disabled={isAddingCategory}
                  className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                    isAddingCategory ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isAddingCategory ? "Adding..." : "Add Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete menu item</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  try {
                    await deleteMenuItem(itemToDelete);
                    setMenuItems(menuItems.filter((item) => item.id !== itemToDelete));
                  } catch (error) {
                    alert('Failed to delete item.');
                  } finally {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
