"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { API_BASE_URL } from "@/utils/api";

export default function ManageCompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    contractLevel: "",
    contractLength: ""
  });
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch companies on page load
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Function to fetch all companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/companies`);
      const data = await res.json();
      
      // For debugging
      console.log("API Response:", data);
      
      if (res.ok) {
        // Enhanced logic to find companies in various response structures
        let companiesArray = [];
        
        // Case 1: Direct array of companies
        if (Array.isArray(data)) {
          companiesArray = data;
        } 
        // Case 2: { companies: [...] }
        else if (data && data.companies && Array.isArray(data.companies)) {
          companiesArray = data.companies;
        }
        // Case 3: { data: [...] }
        else if (data && data.data && Array.isArray(data.data)) {
          companiesArray = data.data;
        }
        // Case 4: { data: { companies: [...] } }
        else if (data && data.data && data.data.companies && Array.isArray(data.data.companies)) {
          companiesArray = data.data.companies;
        }
        // Case 5: { result: { companies: [...] } }
        else if (data && data.result && data.result.companies && Array.isArray(data.result.companies)) {
          companiesArray = data.result.companies;
        }
        // Case 6: { results: { companies: [...] } }
        else if (data && data.results && data.results.companies && Array.isArray(data.results.companies)) {
          companiesArray = data.results.companies;
        }
        // Case 7: Single company object
        else if (data && typeof data === "object" && data._id) {
          companiesArray = [data];
        }
        
        console.log("Extracted companies array:", companiesArray);
        
        // Additional safety check
        if (!Array.isArray(companiesArray)) {
          console.error("Failed to extract companies as array. Using empty array instead.");
          companiesArray = [];
        }
        
        setCompanies(companiesArray);
      } else {
        setError("Failed to fetch companies: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set the current company to edit
  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry || "",
      location: company.location || "",
      contractLevel: company.contractLevel,
      contractLength: company.contractLength
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Clear a specific field
  const handleClearField = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: ""
    }));
  };

  // Update company data
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/companies/${editingCompany._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage("✅ Company updated successfully!");
        
        // Ensure data is properly formatted for the update
        const updatedCompany = data.company || data;
        
        setCompanies(prevCompanies => {
          if (!Array.isArray(prevCompanies)) {
            console.error("companies state is not an array:", prevCompanies);
            return Array.isArray(updatedCompany) ? updatedCompany : [updatedCompany];
          }
          
          return prevCompanies.map(company => 
            company._id === editingCompany._id ? updatedCompany : company
          );
        });
        
        setEditingCompany(null);
      } else {
        setResponseMessage("❌ Failed: " + data.message);
      }
    } catch (err) {
      setResponseMessage("❌ Error: " + err.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingCompany(null);
    setResponseMessage("");
  };

  // Delete a company
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this company?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setCompanies(prevCompanies => {
            if (!Array.isArray(prevCompanies)) {
              console.error("companies state is not an array:", prevCompanies);
              return [];
            }
            return prevCompanies.filter(company => company._id !== id);
          });
          
          setResponseMessage("✅ Company deleted successfully!");
        } else {
          const data = await res.json();
          setResponseMessage("❌ Failed to delete: " + data.message);
        }
      } catch (err) {
        setResponseMessage("❌ Error: " + err.message);
      }
    }
  };

  // Guard against companies not being an array
  const companiesList = Array.isArray(companies) ? companies : [];

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Manage Company Data</h2>
      
      {/* Error or response message */}
      {(error || responseMessage) && (
        <p className={error ? styles.errorMessage : styles.responseMessage}>
          {error || responseMessage}
        </p>
      )}
      
      {/* Company listing */}
      {loading ? (
        <p>Loading companies...</p>
      ) : companiesList.length === 0 ? (
        <p>No companies found. Create a company first.</p>
      ) : (
        <div className={styles.companyList}>
          {!editingCompany && (
            <table className={styles.companyTable}>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Contract Level</th>
                  <th>Contract Length</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companiesList.map((company) => (
                  <tr key={company._id}>
                    <td>{company.name}</td>
                    <td>{company.industry || "—"}</td>
                    <td>{company.location || "—"}</td>
                    <td>{company.contractLevel}</td>
                    <td>{company.contractLength}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(company)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(company._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Edit form */}
          {editingCompany && (
            <div className={styles.editForm}>
              <h3>Edit Company: {editingCompany.name}</h3>
              <form onSubmit={handleUpdate}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Company Name</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="industry">Industry</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleClearField("industry")}
                        className={styles.clearButton}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="location">Location</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleClearField("location")}
                        className={styles.clearButton}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="contractLevel">Contract Level</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="contractLevel"
                        name="contractLevel"
                        value={formData.contractLevel}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="contractLength">Contract Length</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="contractLength"
                        name="contractLength"
                        value={formData.contractLength}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button type="submit" className={styles.updateButton}>
                    Update Company
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}