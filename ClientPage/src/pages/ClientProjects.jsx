import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectForm from "../components/ProjectForm";

const API_URL = "http://127.0.0.1:8000/api/projects/";

const ClientProjects = () => {
  const { clientName } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const clientsResponse = await axios.get("http://127.0.0.1:8000/api/clients/");
        const clients = clientsResponse.data;
        const client = clients.find(c => c.client_name.toLowerCase() === clientName.toLowerCase());

        if (client) {
          setClientId(client.client_id);
          const response = await axios.get(API_URL);
          const clientProjects = response.data.filter(proj => proj.client === client.client_id);
          setProjects(clientProjects);
        } else {
          console.error("Client not found.");
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [clientName]);

  const refreshProjects = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(response => {
        const clientProjects = response.data.filter(proj => proj.client === clientId);
        setProjects(clientProjects);
      })
      .catch(error => console.error("Error fetching projects:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="project-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>{clientName.toUpperCase()} Projects</h1>
        <button className="add-project-button" onClick={() => setShowForm(true)}>+ Add Project</button>
      </div>

      <div className="project-list">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="project-cards">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="project-card"
                // onClick={() => navigate(`/dashboard/${project.project_id}`)}
                onClick={() => navigate(`/dashboard/${clientId}/${project.project_id}`)}

              >
                <h3>{project.project_name}</h3>
                <p>{project.description || "No description available."}</p>
                <p>Progress: {project.project_progress}%</p>
                <p>Start Date: {project.start_date}</p>
                <p>End Date: {project.end_date}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found for {clientName.toUpperCase()}.</p>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectForm clientId={clientId} onClose={() => setShowForm(false)} onProjectAdded={refreshProjects} />
          </div>
        </div>
      )}

      <style>
        {`
          .project-container {
            background: #0a192f;
            color: white;
            min-height: 100vh;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .back-button {
            background: #112240;
            border: none;
            color: #64ffda;
            font-size: 18px;
            cursor: pointer;
          }

          .add-project-button {
            background:rgb(27, 255, 49);
            color: white;
            font-size: 18px;
            padding: 12px 20px;
            border-color: transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
          }

          .add-project-button:hover {
            background:rgb(55, 202, 39);
          }

          .project-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          .project-cards {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .project-card {
            background: #112240;
            padding: 15px;
            border-radius: 10px;
            width: 250px;
            cursor: pointer;
            text-align: center;
            transition: 0.3s;
          }

          .project-card:hover {
            background: #1a2b3c;
            transform: scale(1.05);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default ClientProjects;
