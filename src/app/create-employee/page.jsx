"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { API_BASE_URL } from "@/utils/api";

export default function CreateEmployeePage() {
  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    location: "",
    salary: "",
    competence: "",
    company: ""
  });

  const [companies, setCompanies] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState({ apiCalls: [] });

  // Fetch companies on page load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/companies`);
        const data = await res.json();
        
        // Debug info
        console.log("API Response from companies:", data);
        
        // Better handling of different response structures
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
        // Case 5: Single company object
        else if (data && typeof data === "object" && data._id) {
          companiesArray = [data];
        }

        // Ensure companiesArray is definitely an array
        if (!Array.isArray(companiesArray)) {
          console.error("Companies data is not an array:", companiesArray);
          companiesArray = [];
        }

        if (res.ok) {
          setCompanies(companiesArray);
          // Set default company if any exist
          if (companiesArray.length > 0) {
            setFormData(prev => ({
              ...prev,
              company: companiesArray[0]._id
            }));
          }
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClearField = (fieldName) => {
    setFormData((prev) => ({
      ...prev, 
      [fieldName]: ""
    }));
  };

  const tryEndpoints = async (endpoints) => {
    for (const endpoint of endpoints) {
      try {
        setDebug(prev => ({
          ...prev,
          apiCalls: [...prev.apiCalls, { endpoint, status: "trying" }]
        }));
        
        console.log(`Trying endpoint: ${endpoint}`);
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        setDebug(prev => ({
          ...prev,
          apiCalls: prev.apiCalls.map(call => 
            call.endpoint === endpoint 
              ? { ...call, status: res.status, data } 
              : call
          )
        }));
        
        if (res.ok) {
          console.log(`Success with endpoint: ${endpoint}`);
          return { success: true, data, endpoint };
        }
      } catch (err) {
        setDebug(prev => ({
          ...prev,
          apiCalls: prev.apiCalls.map(call => 
            call.endpoint === endpoint 
              ? { ...call, status: "error", error: err.message } 
              : call
          )
        }));
        console.error(`Error with endpoint ${endpoint}:`, err.message);
      }
    }
    
    return { success: false };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("⏳ Creating employee...");
    
    // Try different endpoint patterns
    const endpointsToTry = [
      "/api/employees",
      "/api/employee",
      "/api/staff",
      "/api/personnel",
      "/api/users"
    ];
    
    const result = await tryEndpoints(endpointsToTry);
    
    if (result.success) {
      setResponseMessage(`✅ Employee created! (using ${result.endpoint})`);
      // Save the successful endpoint to localStorage for future use
      localStorage.setItem("successful_employee_endpoint", result.endpoint);
      
      // Reset form
      setFormData({
        surname: "",
        name: "",
        location: "",
        salary: "",
        competence: "",
        company: formData.company // Keep the selected company
      });
    } else {
      setResponseMessage("❌ Failed to create employee with any endpoint. Check console for details.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Create New Employee</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              name="surname"
              placeholder="required"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="required"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <div className={styles.fieldWithAction}>
              <input
                id="location"
                name="location"
                placeholder="optional"
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
            <label htmlFor="salary">Salary</label>
            <div className={styles.fieldWithAction}>
              <input
                id="salary"
                name="salary"
                placeholder="optional"
                value={formData.salary}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={() => handleClearField("salary")}
                className={styles.clearButton}
              >
                Clear
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="competence">Competence</label>
            <div className={styles.fieldWithAction}>
              <input
                id="competence"
                name="competence"
                placeholder="optional"
                value={formData.competence}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={() => handleClearField("competence")}
                className={styles.clearButton}
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Company dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="company">Assign to Company</label>
            {loading ? (
              <p>Loading companies...</p>
            ) : companies.length === 0 ? (
              <p className={styles.warning}>No Companies found. Please create a company first.</p>
            ) : (
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="" disabled>Select a company</option>
                {Array.isArray(companies) ? companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                )) : <option value="">No companies available</option>}
              </select>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || companies.length === 0}
        >
          Create Employee
        </button>

        {responseMessage && (
          <p className={responseMessage.includes("❌") ? styles.errorMessage : styles.responseMessage}>
            {responseMessage}
          </p>
        )}
        
        {/* Debug Info (only visible during development) */}
        {process.env.NODE_ENV === "development" && debug.apiCalls.length > 0 && (
          <div className={styles.debugInfo}>
            <h3>API Call Attempts</h3>
            <ul>
              {debug.apiCalls.map((call, index) => (
                <li key={index}>
                  Endpoint: {call.endpoint} - Status: {call.status}
                  {call.error && <span> - Error: {call.error}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}