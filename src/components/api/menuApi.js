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

export const getMenuPopularity = async () => {
  try {
    console.log('Fetching menu popularity data...');
    const response = await fetch(`${API_BASE_URL}/analytics/menu-popularity/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Menu popularity response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to fetch menu popularity");
    }

    const data = await response.json();
    console.log('Menu popularity data:', data);
    return data;
  } catch (error) {
    console.error("Error in getMenuPopularity:", error);
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const requestBody = {
      order_number: feedbackData.order_id,
      star_rating: parseInt(feedbackData.rating, 10),
      feedback: feedbackData.feedback || ""
    };
    
    console.log('Submitting feedback with request body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/order/feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Feedback response status:', response.status);
    
    // Clone the response so we can read it multiple times
    const responseClone = response.clone();
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await responseClone.json();
      } catch (e) {
        const text = await responseClone.text();
        console.error("Raw API Response:", text);
        throw new Error("Failed to submit feedback: Invalid response from server");
      }

      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: requestBody,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(
        errorData.detail || 
        errorData.message || 
        (typeof errorData === 'object' ? JSON.stringify(errorData) : "Failed to submit feedback")
      );
    }

    const data = await response.json();
    console.log('Feedback submitted successfully:', data);
    return data;
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    throw error;
  }
};

export const getFeedbacks = async () => {
  try {
    console.log('Fetching feedback data...');
    const response = await fetch(`${API_BASE_URL}/order/orders/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Feedback response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to fetch feedback");
    }

    const orders = await response.json();
    // Filter orders that have feedback and star_rating
    const feedbacks = orders.filter(order => order.star_rating !== null && order.feedback !== null);
    console.log('Feedback data:', feedbacks);
    return feedbacks;
  } catch (error) {
    console.error("Error in getFeedbacks:", error);
    throw error;
  }
};

export const getAverageRating = async () => {
  try {
    console.log('Fetching average rating...');
    const response = await fetch(`${API_BASE_URL}/order/average-rating/`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Average rating response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to fetch average rating");
    }

    const data = await response.json();
    console.log('Average rating data:', data);
    return data;
  } catch (error) {
    console.error("Error in getAverageRating:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    console.log('Logging out user...');
    const response = await fetch(`${API_BASE_URL}/auth/token/logout/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log('Logout response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      throw new Error(errorData.detail || "Failed to logout");
    }

    // Clear local storage regardless of response
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    
    return true;
  } catch (error) {
    console.error("Error in logoutUser:", error);
    // Still clear local storage even if the API call fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    throw error;
  }
};
