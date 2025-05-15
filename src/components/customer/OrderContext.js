import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [order, setOrder] = useState([
    { id: 1, name: 'Pasta', quantity: 1, price: 500 },
    { id: 2, name: 'Coke 1.5L', quantity: 1, price: 140 }
  ]);

  const updateOrder = (newOrder) => {
    setOrder(newOrder);
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}