"use client";
import { useState } from "react";
import styles from "./page.module.css";

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

    try {
      const res = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

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
        setResponseMessage("❌ Failed: " + data.message);
      }
    } catch (err) {
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