"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { API_BASE_URL } from "@/utils/api";

export default function CreateCompanyPage() {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    contractLevel: "",
    contractLength: ""
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the API URL for debugging
    console.log("API URL:", `${API_BASE_URL}/api/companies`);
    
    try {
      // First, make a GET request to check if the API is reachable
      console.log("Testing API connection...");
      const testRes = await fetch(`${API_BASE_URL}/api/companies`, {
        method: "GET",
      }).catch(error => {
        console.error("GET request failed:", error);
        throw new Error("API connection test failed");
      });
      
      if (testRes.ok) {
        console.log("API connection successful, proceeding with POST");
      } else {
        throw new Error(`API test failed with status: ${testRes.status}`);
      }

      // Now make the actual POST request
      console.log("Sending data:", formData);
      const res = await fetch(`${API_BASE_URL}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      console.log("Response status:", res.status);
      
      // Try to get the response body
      let data;
      try {
        data = await res.json();
        console.log("Response data:", data);
      } catch (err) {
        console.error("Failed to parse response:", err);
        throw new Error("Failed to parse server response");
      }

      if (res.ok) {
        setResponseMessage("✅ Company created!");
        setFormData({
          name: "",
          industry: "",
          location: "",
          contractLevel: "",
          contractLength: ""
        });
      } else {
        setResponseMessage("❌ Failed: " + (data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error details:", err);
      setResponseMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Create New Company</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Company Name</label>
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
            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              name="industry"
              placeholder="optional"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              placeholder="optional"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contractLevel">Contract Level</label>
            <input
              id="contractLevel"
              name="contractLevel"
              placeholder="required"
              value={formData.contractLevel}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contractLength">Contract Length</label>
            <input
              id="contractLength"
              name="contractLength"
              placeholder="required"
              value={formData.contractLength}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>Create Company</button>
        
        {responseMessage && (
          <p className={styles.responseMessage}>{responseMessage}</p>
        )}
      </form>
    </div>
  );
}