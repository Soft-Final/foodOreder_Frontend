import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null); // ✅ Add this

  return (
    <CartContext.Provider value={{ cart, setCart, order, setOrder }}>
      {children}
    </CartContext.Provider>
  );
};
