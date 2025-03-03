import React, { useState, useEffect } from 'react';
import { Menu, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Clients.css";

const API_URL = "http://127.0.0.1:8000/api/clients/";

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState("");
  const navigate = useNavigate();

  // Fetch clients from Django backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(API_URL);
        // console.log("API Response:", response.data); // Debugging line
    
        if (Array.isArray(response.data)) {
          setClients(response.data.map(client => ({
            id: client.client_id,  // Match backend key
            name: client.client_name.toUpperCase()  // Match backend key
          })));
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    
    
    fetchClients();
  }, []);

  // Add a new client

  const handleAddClient = async () => {
    if (newClient.trim()) {
      try {
        const response = await axios.post(
          API_URL, 
          { client_name: newClient },  // ✅ Match backend expected field name
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
  
        if (response.status === 201) {
          setClients([...clients, { id: response.data.client_id, name: response.data.client_name.toUpperCase() }]); // ✅ Append correct structure
          setNewClient("");
        }
      } catch (error) {
        console.error("Error adding client:", error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <span className="nav-title">Client Dashboard</span>
        <div className="menu-icon">
          <Menu size={24} />
        </div>
      </nav>
      <section className="client-section">
        <h2>Select a Client</h2>
        <div className="client-grid">
{clients.map((client) => (
  <button 
    key={client.id} 
    className="client-button"
    onClick={() => navigate(`/clients/${client.name.toLowerCase()}`)}
  >
    {client.name}
  </button>
))}

        </div>
        <div className="add-client-section">
          <input 
            type="text" 
            placeholder="Enter new client name" 
            value={newClient} 
            onChange={(e) => setNewClient(e.target.value)}
          />
          <button className="add-client-button" onClick={handleAddClient}>
            <Plus size={16} /> Add Client
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClientPage;
