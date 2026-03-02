import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Auth

export async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.status === 422 || error.status === 403) {
      return error.response.data;
    }
    console.error(error);
  }
}

// Supplier profile

export async function getSupplierMe(token) {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateSupplierMe(token, data) {
  try {
    const response = await axios.put(`${BASE_URL}/supplier/me`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.status === 422) {
      return error.response.data;
    }
    console.error(error);
  }
}

// Dashboard

export async function getDashboard(token) {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Orders

export async function getOrders(token, status = null) {
  const url = status
    ? `${BASE_URL}/supplier/orders?status=${status}`
    : `${BASE_URL}/supplier/orders`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrder(token, id) {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateOrderStatus(token, id, status) {
  try {
    const response = await axios.put(
      `${BASE_URL}/supplier/orders/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    if (error.status === 422) {
      return error.response.data;
    }
    console.error(error);
  }
}

// Products

export async function getProducts(token) {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProduct(token, id) {
  try {
    const response = await axios.get(`${BASE_URL}/supplier/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct(token, data) {
  try {
    const response = await axios.post(`${BASE_URL}/supplier/products`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.status === 422) {
      return error.response.data;
    }
    console.error(error);
  }
}

export async function updateProduct(token, id, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/supplier/products/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    if (error.status === 422) {
      return error.response.data;
    }
    console.error(error);
  }
}

export async function deleteProduct(token, id) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/supplier/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
