import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

import margarita from "../../assets/margarita.jpg";
import salad from "../../assets/caesar.jpg";
import burger from "../../assets/beef-burger.jpg";
import spaghetti from "../../assets/spaghetti.jpeg";
import chicken from "../../assets/Grilled-Chicken.jpg";
import cake from "../../assets/chocolate-cake.jpg";

const MenuPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const { cart, setCart } = useCart();

  const toggleCategory = (cat) =>
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  const toggleExpandItem = (id) =>
    setExpandedItemId((prev) => (prev === id ? null : id));

  // Ensure we have a proper handler for adding items to cart
  const handleOrder = (item) => {
    console.log("Adding to cart:", item);
    setCart((prev) => [...prev, item]);
  };

  const categories = {
    Lunch: [
      {
        id: 1,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil.",
        price: 9.99,
        image: margarita,
      },
    ],
    Salad: [
      {
        id: 2,
        name: "Caesar Salad",
        description: "Romaine with Caesar dressing, croutons, and parmesan.",
        price: 7.49,
        image: salad,
      },
    ],
    Dinner: [
      {
        id: 3,
        name: "Beef Burger",
        description: "Grilled beef patty with lettuce, tomato, and cheese.",
        price: 11.25,
        image: burger,
      },
      {
        id: 5,
        name: "Grilled Chicken",
        description: "Grilled chicken breast with herbs and lemon.",
        price: 12.0,
        image: chicken,
      },
    ],
    Pasta: [
      {
        id: 4,
        name: "Spaghetti Bolognese",
        description: "Spaghetti with meat sauce and parmesan.",
        price: 10.5,
        image: spaghetti,
      },
    ],
    Dessert: [
      {
        id: 6,
        name: "Chocolate Cake",
        description: "Moist chocolate cake with creamy frosting.",
        price: 6.75,
        image: cake,
      },
    ],
  };

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

      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mb-10">
          <button
            className="w-full flex justify-between items-center px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200"
            onClick={() => toggleCategory(category)}
          >
            <div className="flex items-center gap-4">
              <span className="w-2 h-8 bg-coral-500 rounded-full" />
              <h2 className="text-2xl font-semibold text-slate-800">
                {category}
              </h2>
            </div>
            {expandedCategory === category ? (
              <ChevronUp className="text-slate-500" size={24} />
            ) : (
              <ChevronDown className="text-slate-500" size={24} />
            )}
          </button>

          {expandedCategory === category && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-52 object-cover cursor-pointer"
                      onClick={() => toggleExpandItem(item.id)}
                    />
                    <span className="absolute top-4 right-4 bg-white/90 text-slate-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      ${item.price.toFixed(2)}
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
                      className="bg-[#D94F3C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#bf3d2d] transition-colors flex items-center gap-2 w-fit"
                    >
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

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
