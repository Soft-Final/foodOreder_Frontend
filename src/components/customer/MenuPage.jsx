import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { getCategories, getMenuItems } from "../api/menuApi";

import margarita from "../../assets/margarita.jpg";
import salad from "../../assets/caesar.jpg";
import burger from "../../assets/beef-burger.jpg";
import spaghetti from "../../assets/spaghetti.jpeg";
import chicken from "../../assets/Grilled-Chicken.jpg";
import cake from "../../assets/chocolate-cake.jpg";

const MenuPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [categoriesData, menuItemsData] = await Promise.all([
          getCategories(),
          getMenuItems()
        ]);
        
        
        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const toggleCategory = (cat) =>
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  const toggleExpandItem = (id) =>
    setExpandedItemId((prev) => (prev === id ? null : id));

  const handleOrder = (item) => {
    setCart((prev) => [...prev, item]);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Loading Menu...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen bg-slate-50">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-coral-600 to-peach-500 bg-clip-text text-transparent">
          Culinary Delights
        </h1>
        <p className="text-slate-600 text-lg">
          Fresh ingredients, crafted with passion
        </p>
      </header>

      {categories.map((category) => {

        const categoryItems = menuItems.filter(item => {
          const itemCatId = item.category_id !== undefined ? item.category_id : item.category?.id;
         
          return itemCatId === category.id;
        });

        
        return (
          <div key={category.id} className="mb-10">
            <button
              className="w-full flex justify-between items-center px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-8 bg-coral-500 rounded-full" />
                <h2 className="text-2xl font-semibold text-slate-800">
                  {category.name}
                </h2>
              </div>
              {expandedCategory === category.id ? (
                <ChevronUp className="text-slate-500" size={24} />
              ) : (
                <ChevronDown className="text-slate-500" size={24} />
              )}
            </button>

            {expandedCategory === category.id && categoryItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-52 object-cover cursor-pointer"
                          onClick={() => toggleExpandItem(item.id)}
                        />
                      ) : (
                        <div
                          className="w-full h-52 bg-gray-200 flex items-center justify-center cursor-pointer"
                          onClick={() => toggleExpandItem(item.id)}
                        >
                          <span className="text-gray-400 text-lg">No Image</span>
                        </div>
                      )}
                      <span className="absolute top-4 right-4 bg-white/90 text-slate-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 flex-wrap sm:flex-nowrap py-4 px-2">
                      <div className="flex-1">
                        <h3
                          className="text-xl font-semibold text-slate-800 cursor-pointer"
                          onClick={() => toggleExpandItem(item.id)}
                        >
                          {item.name}
                        </h3>
                        {expandedItemId === item.id && (
                          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleOrder(item)}
                        disabled={!item.is_available}
                        className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit ${
                          item.is_available
                            ? "bg-[#D94F3C] text-white hover:bg-[#bf3d2d] transition-colors"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <span>{item.is_available ? "Order Now" : "Unavailable"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {expandedCategory === category.id && categoryItems.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No items available in this category
              </div>
            )}
          </div>
        );
      })}

      {cart.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link
            to="/checkout"
            className="bg-[#D94F3C] text-white px-6 py-3 rounded-xl shadow-xl hover:bg-[#bf3d2d] hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Checkout</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-full text-sm">
              {cart.length}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
