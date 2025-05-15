const API_BASE_URL = "http://165.22.74.5:8000";

// Utility to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Access token not found in localStorage");
  }
  return {
    Authorization: `Token ${token}`,
  };
};

export const createMenuItem = async (formData) => {
  for (let pair of formData.entries()) {
  }

  const response = await fetch(`${API_BASE_URL}/menu/items/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData
    });
    throw new Error(errorData.detail || "Failed to create menu item");
  }

  return response.json();
};

export const addCategory = async (categoryName) => {
  const response = await fetch(`${API_BASE_URL}/menu/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name: categoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to add category");
  }

  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/menu/categories/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const getMenuItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/items/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch menu items:", response.status, response.statusText);
      throw new Error("Failed to fetch menu items");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getMenuItems:", error);
    throw error;
  }
};

export const deleteMenuItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/menu/items/${id}/`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (response.status !== 204 && !response.ok) {
    throw new Error("Failed to delete menu item");
  }
};

export const updateMenuItem = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/menu/items/${id}/`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData
    });
    throw new Error(errorData.detail || "Failed to update menu item");
  }

  return response.json();
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log('Updating order status:', { orderId, status });
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };
    console.log('Request headers:', headers);

    const response = await fetch(`${API_BASE_URL}/order/update-status/${orderId}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: { orderId, status }
      });
      throw new Error(errorData.detail || "Failed to update order status");
    }

    const data = await response.json();
    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};

export const createOrder = async (itemIds) => {
  // Extract just the IDs from the items
  const items = itemIds.map(item => item.id);

  console.log('Raw items received:', itemIds);
  console.log('Processed items being sent:', items);
  console.log('Full request body:', JSON.stringify({ items }, null, 2));

  const response = await fetch(`${API_BASE_URL}/order/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData,
      requestData: { items },
      requestBody: JSON.stringify({ items }, null, 2)
    });
    throw new Error(errorData.detail || JSON.stringify(errorData) || "Failed to create order");
  }

  return response.json();
};

export const getOrders = async () => {
  console.log('Making API call to:', `${API_BASE_URL}/order/orders/`);
  const response = await fetch(`${API_BASE_URL}/order/orders/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  console.log('API Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData
    });
    throw new Error(errorData.detail || "Failed to fetch orders");
  }

  const data = await response.json();
  console.log('API Response data:', data);
  return data;
};

export const getWeeklySales = async () => {
  try {
    console.log('Fetching weekly sales data...');
    const response = await fetch(`${API_BASE_URL}/analytics/weekly-sales/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Weekly sales response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to fetch weekly sales");
    }

    const data = await response.json();
    console.log('Weekly sales data:', data);
    return data;
  } catch (error) {
    console.error("Error in getWeeklySales:", error);
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    console.log('Fetching analytics data...');
    const response = await fetch(`${API_BASE_URL}/analytics/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Analytics response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to fetch analytics");
    }

    const data = await response.json();
    console.log('Analytics data:', data);
    return data;
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    throw error;
  }
};
