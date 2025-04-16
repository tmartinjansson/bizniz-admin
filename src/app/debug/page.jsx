"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";

export default function DebugPage() {
  const [apiResponses, setApiResponses] = useState({});
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Capture the current API_BASE_URL
    setApiBaseUrl(API_BASE_URL);
    
    // Test default endpoints on load
    testEndpoints();
  }, []);

  const testEndpoints = async () => {
    setLoading(true);
    
    // Standard endpoints to test
    const endpoints = [
      "/api/companies",
      "/api/company"
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${API_BASE_URL}${endpoint}`);
        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        
        let responseData;
        try {
          responseData = await res.json();
        } catch (e) {
          responseData = { error: "Could not parse JSON response", message: e.message };
        }
        
        results[endpoint] = {
          status: res.status,
          ok: res.ok,
          data: responseData,
          testedAt: new Date().toLocaleTimeString()
        };
      } catch (err) {
        results[endpoint] = {
          error: err.message,
          testedAt: new Date().toLocaleTimeString()
        };
      }
    }
    
    setApiResponses(results);
    setLoading(false);
  };
  
  // Function to create a test company
  const createTestCompany = async () => {
    setLoading(true);
    
    const testCompany = {
      name: `Test Company ${new Date().toLocaleTimeString()}`,
      industry: "Testing",
      location: "Debug Land",
      contractLevel: "Debug",
      contractLength: "Forever"
    };
    
    try {
      console.log(`Creating test company via: ${API_BASE_URL}/api/companies`);
      console.log("Test company data:", testCompany);
      
      const res = await fetch(`${API_BASE_URL}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCompany)
      });
      
      let responseData;
      try {
        responseData = await res.json();
      } catch (e) {
        responseData = { error: "Could not parse JSON response", message: e.message };
      }
      
      setApiResponses(prev => ({
        ...prev,
        "POST /api/companies": {
          status: res.status,
          ok: res.ok,
          data: responseData,
          testedAt: new Date().toLocaleTimeString()
        }
      }));
      
      // After creating, immediately fetch to see if it appears
      setTimeout(() => testEndpoints(), 1000);
    } catch (err) {
      setApiResponses(prev => ({
        ...prev,
        "POST /api/companies": {
          error: err.message,
          testedAt: new Date().toLocaleTimeString()
        }
      }));
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>API Debugger</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>API Configuration</h2>
        <p><strong>API_BASE_URL:</strong> {apiBaseUrl || "Not defined"}</p>
      </div>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button 
          onClick={testEndpoints} 
          disabled={loading}
          style={{ padding: "8px 16px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Testing..." : "Test All Standard Endpoints"}
        </button>
        
        <button 
          onClick={createTestCompany} 
          disabled={loading}
          style={{ padding: "8px 16px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating..." : "Create Test Company"}
        </button>
      </div>
      
      <div>
        <h2>API Responses</h2>
        {Object.keys(apiResponses).length === 0 ? (
          <p>No responses yet. Click "Test Endpoints" to begin.</p>
        ) : (
          Object.entries(apiResponses).map(([endpoint, response]) => (
            <div key={endpoint} style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: response.ok ? "#f0fff0" : (response.error ? "#fff0f0" : "#f5f5f5")
            }}>
              <h3>{endpoint}</h3>
              <p><strong>Tested at:</strong> {response.testedAt}</p>
              
              {response.error ? (
                <p><strong>Error:</strong> {response.error}</p>
              ) : (
                <>
                  <p><strong>Status:</strong> {response.status}</p>
                  <p><strong>Success:</strong> {response.ok ? "Yes" : "No"}</p>
                  <div>
                    <strong>Response Data:</strong>
                    <pre style={{ 
                      backgroundColor: "#f8f8f8", 
                      padding: "10px",
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: "200px"
                    }}>
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}