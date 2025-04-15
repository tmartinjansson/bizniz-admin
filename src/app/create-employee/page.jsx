"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

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

  //fetch companies on page load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
          setLoading(true);
          const res = await fetch("http://localhost:5000/api/companies");
          const data = await res.json();

          if (res.ok) {
            setCompanies(data);
            //set default company if any exist
            if (data.length > 0) {
              setFormData(prev => ( {
                ...prev,
                company: data[0]._id
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage("✅ Employee created!");
        setFormData({
          surname: "",
          name: "",
          location: "",
          salary: "",
          competence: "",
          company: formData.company //keep the selected company
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
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              name="salary"
              placeholder="optional"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="competence">Competence</label>
            <input
              id="competence"
              name="competence"
              placeholder="optional"
              value={formData.competence}
              onChange={handleChange}
            />
          </div>
          {/* New Company dropdown */}
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
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || companies.length === 0}
          >
            Create employee
          </button>

          {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
        </form>
    </div>
  );
}