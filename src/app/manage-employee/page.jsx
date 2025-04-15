"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function ManageEmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    location: "",
    salary: "",
    competence: ""
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [companies, setCompanies] = useState([]);

  // Fetch employees and companies on page load
  useEffect(() => {
    fetchEmployees();
    fetchCompanies();
  }, []);

  // Function to fetch all employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();

      if (res.ok) {
        setEmployees(data);
      } else {
        setError("Failed to fetch employees");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/companies");
      const data = await res.json();

      if (res.ok) {
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err.message);
    }
  };

  // Set the current employee to edit
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      surname: employee.surname,
      name: employee.name,
      location: employee.location || "",
      salary: employee.salary || "",
      competence: employee.competence || "",
      company: employee.company || ""
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

  // Update employee data
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/employees/${editingEmployee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage("✅ Employee updated successfully!");
        
        // Update the employees state with the updated employee data
        const updatedEmployees = employees.map(employee => 
          employee._id === editingEmployee._id ? { ...employee, ...data } : employee
        );
        
        setEmployees(updatedEmployees);
        setEditingEmployee(null);
        
        // Refresh employee data to ensure we have the latest from the server
        fetchEmployees();
      } else {
        setResponseMessage("❌ Failed: " + data.message);
      }
    } catch (err) {
      setResponseMessage("❌ Error: " + err.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingEmployee(null);
    setResponseMessage("");
  };

  // Delete an employee
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setEmployees(employees.filter(employee => employee._id !== id));
          setResponseMessage("✅ Employee deleted successfully!");
        } else {
          const data = await res.json();
          setResponseMessage("❌ Failed to delete: " + data.message);
        }
      } catch (err) {
        setResponseMessage("❌ Error: " + err.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Manage Employee Data</h2>

      {/* Error or response message */}
      {(error || responseMessage) && (
        <p className={error ? styles.errorMessage : styles.responseMessage}>
          {error || responseMessage}
        </p>
      )}

      {/* Employee listing */}
      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found. Create an Employee first.</p>
      ) : (
        <div className={styles.employeeList}>
          {!editingEmployee && (
            <table className={styles.employeeTable}>
              <thead>
                <tr>
                  <th>Surname</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Competence</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.surname}</td>
                    <td>{employee.name}</td>
                    <td>{employee.location || "—"}</td>
                    <td>{employee.salary || "—"}</td>
                    <td>{employee.competence || "—"}</td>
                    <td>{employee.company ? (
                      <span className={styles.companyTag}>
                        {companies.find(c => c._id === employee.company)?.name || "Unknown"}
                      </span>
                    ) : "—"}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(employee)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
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
          {editingEmployee && (
            <div className={styles.editForm}>
              <h3>Edit Employee: {editingEmployee.name}</h3>
              <form onSubmit={handleUpdate}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="surname">Surname</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => handleClearField("name")}
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
                    <label htmlFor="salary">Salary</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="competence">Competence</label>
                    <div className={styles.fieldWithAction}>
                      <input
                        id="competence"
                        name="competence"
                        value={formData.competence}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                    
                  <div className={styles.formGroup}>
                    <label htmlFor="company">Assign to Company</label>
                    <div className={styles.fieldWithAction}>
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
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.updateButton}>
                    Update Employee
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