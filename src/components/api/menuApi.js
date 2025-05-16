// src/components/api/menuApi.js

const API_BASE_URL = "http://165.22.74.5:8000";

/**
 * Returns auth headers if a token exists,
 * otherwise returns an empty object so public calls succeed.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token
    ? { Authorization: `Token ${token}` }
    : {};
};

export const createMenuItem = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/menu/items/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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
  const response = await fetch(`${API_BASE_URL}/menu/items/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  return response.json();
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
    throw new Error(errorData.detail || "Failed to update menu item");
  }
  return response.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_BASE_URL}/order/update-status/${orderId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update order status");
  }
  return response.json();
};

export const createOrder = async (itemIds) => {
  const items = itemIds.map(item => item.id);
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
    throw new Error(errorData.detail || "Failed to create order");
  }
  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/order/orders/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch orders");
  }
  return response.json();
};

export const getWeeklySales = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/weekly-sales/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch weekly sales");
  }
  return response.json();
};

export const getAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch analytics");
  }
  return response.json();
};

export const getMenuPopularity = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics/menu-popularity/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch menu popularity");
  }
  return response.json();
};

/**
 * Public: submitFeedback should NOT send any Authorization header.
 */
export const submitFeedback = async (feedbackData) => {
  const requestBody = {
    order_number: feedbackData.order_id,
    star_rating: parseInt(feedbackData.rating, 10),
    feedback: feedbackData.feedback || "",
  };

  const response = await fetch(`${API_BASE_URL}/order/feedback/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    // Explicitly omit credentials for public feedback endpoint
    credentials: "omit",
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.clone().json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit feedback");
  }
  return response.json();
};

export const getFeedbacks = async () => {
  const response = await fetch(`${API_BASE_URL}/order/orders/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch feedback");
  }
  const orders = await response.json();
  return orders.filter(o => o.star_rating != null && o.feedback != null);
};

export const getAverageRating = async () => {
  const response = await fetch(`${API_BASE_URL}/order/average-rating/`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch average rating");
  }
  return response.json();
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/logout/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error("Failed to logout");
    }
  } catch {
    // ignore
  } finally {
    localStorage.clear();
  }
};
