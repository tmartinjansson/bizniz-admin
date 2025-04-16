// Update your utils/api.js file with this code

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://bizniz-api.vercel.app";

// Default fetch options with CORS support
const defaultOptions = {
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include" // Important for CORS with credentials
};

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    const response = await fetch(url, fetchOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// API endpoints

// Companies
export const getCompanies = () => fetchAPI("/api/companies");
export const getCompany = (id) => fetchAPI(`/api/company/${id}`);
export const createCompany = (data) => fetchAPI("/api/company", {
  method: "POST",
  body: JSON.stringify(data)
});
export const updateCompany = (id, data) => fetchAPI(`/api/company/${id}`, {
  method: "PUT",
  body: JSON.stringify(data)
});
export const deleteCompany = (id) => fetchAPI(`/api/company/${id}`, {
  method: "DELETE"
});

// Employees
export const getEmployees = () => fetchAPI("/api/employees");
export const getEmployee = (id) => fetchAPI(`/api/employee/${id}`);
export const createEmployee = (data) => fetchAPI("/api/employees", {
  method: "POST",
  body: JSON.stringify(data)
});
export const updateEmployee = (id, data) => fetchAPI(`/api/employee/${id}`, {
  method: "PUT",
  body: JSON.stringify(data)
});
export const deleteEmployee = (id) => fetchAPI(`/api/employee/${id}`, {
  method: "DELETE"
});

// Add any other API endpoints you need here

export default {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
  // Add other exports here
};