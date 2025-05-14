import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Combobox } from '@headlessui/react';
import PizzaImg from '../assets/pizza.jpg';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive'),
  category: yup.string().required('Category is required'),
  image: yup.mixed().required('Image is required'),
});

const MenuManagement = () => {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Classic Pizza',
      description: 'Juicy beef Pizza with extra cheese',
      price: 12.99,
      category: 'Lunch',
      image: PizzaImg,
    },
  ]);

  const [categories, setCategories] = useState([
    'Breakfast',
    'Lunch',
    'Dinner',
    'Appetizers',
    'Desserts',
    'Beverages',
  ]);
  const [query, setQuery] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const filteredCategories =
    query === ''
      ? categories
      : categories.filter((category) =>
          category.toLowerCase().includes(query.toLowerCase())
        );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (editItem) {
        const updatedItems = menuItems.map((item) =>
          item.id === editItem.id
            ? { ...item, ...values, image: imagePreview || item.image }
            : item
        );
        setMenuItems(updatedItems);
      } else {
        const newItem = {
          id: menuItems.length + 1,
          ...values,
          image: imagePreview || '',
        };
        setMenuItems([...menuItems, newItem]);
      }
      handleClose();
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
        category: item.category,
        image: null,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setImagePreview(null);
    formik.resetForm();
    setQuery('');
  };

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
        <button
          onClick={() => handleOpen()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">${item.price}</span>
                <span className="text-sm text-gray-500">{item.category}</span>
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
                onClick={() => handleDelete(item.id)}
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
                {editItem ? 'Edit' : 'Add New'} Menu Item
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
                        ? 'border-red-500'
                        : 'border-gray-300'
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
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.description && formik.errors.description && (
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
                          ? 'border-red-500'
                          : 'border-gray-300'
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
                    <Combobox
                      value={formik.values.category}
                      onChange={(value) => {
                        if (!categories.includes(value)) {
                          setCategories([...categories, value]);
                        }
                        formik.setFieldValue('category', value);
                      }}
                    >
                      <div className="relative">
                        <Combobox.Input
                          className={`w-full px-3 py-2 border rounded-lg ${
                            formik.touched.category && formik.errors.category
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={(category) => category}
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {filteredCategories.map((category) => (
                            <Combobox.Option
                              key={category}
                              value={category}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-4 ${
                                  active
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-900'
                                }`
                              }
                            >
                              {category}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>
                    </Combobox>
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
                        formik.setFieldValue('image', file);
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
                  {editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;