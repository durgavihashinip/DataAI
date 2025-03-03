import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Confetti from "react-confetti";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { clientId, projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/client/${clientId}/${projectId}/`)
      .then((response) => {
        setProjectData(response.data);
        setNewProgress(response.data.project_progress);
        if (response.data.project_progress === 100) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        setLoading(false);
      });
  }, [clientId, projectId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!projectData) {
    return <div className="error">Project not found.</div>;
  }
  const getProgressColor = (progress) => {
    if (progress <= 40) return "#ff4d4d"; // Red
    if (progress <= 70) return "#ffcc00"; // Yellow
    return "#00ff00"; // Green
  };
  
  const progressData = [
    { name: "Completed", value: newProgress, fill: getProgressColor(newProgress) },
    { name: "Remaining", value: 100 - newProgress, fill: "#444" },
  ];
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="project-details">
          <h2>Project Details</h2>
          <div className="details-grid">
            <div className="detail">Project Name: {projectData.project_name}</div>
            <div className="detail">Team Lead: {projectData.team_lead_name}</div>
            <div className="detail">Start Date: {projectData.start_date}</div>
            <div className="detail">End Date: {projectData.end_date}</div>
          </div>
          <div className="details-grid">
            <div className="detail">Estimated Days: {projectData.estimated_days}</div>
            <div className="detail">Completed Days: {projectData.completed_days}</div>
          </div>
          <h3>Employees</h3>
          <div className="employees-grid">
            {projectData.employee_list.map((emp) => (
              <div key={emp.id} className="employee-card">
                <span className="employee-name">{emp.name}</span>
                <span className="employee-role">{emp.role}</span>
              </div>
            ))}
          </div>
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            {projectData.tech_stack.map((tech, index) => (
              <p key={index}> {tech.name}</p>
            ))}
          </div>
        </div>
        <div className="project-completion">
          <h3>Project Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={progressData} dataKey="value" cx="50%" cy="50%" innerRadius="50%" outerRadius="80%" startAngle={90} endAngle={-270}>
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <h3>{newProgress}% Completed</h3>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
            {isEditing ? "Cancel" : "Edit Progress"}
          </button>
          {isEditing && (
            <div className="edit-progress">
              <input type="number" value={newProgress} onChange={(e) => setNewProgress(parseInt(e.target.value, 10))} max="100" min="0" className="progress-input" />
              <button onClick={() => setIsEditing(false)} className="save-button">Save</button>
            </div>
          )}
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default Dashboard;
