import React, { useState, useEffect } from "react";
import "../styles/Form.css";

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    teamLead: "",
    techStack: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    employees: [],
    estimatedDays: "",
    completedDays: "",
    employeeCount: 0,
    projectProgress: "",
  });

  useEffect(() => {
    const start = new Date(formData.startDate);
    const end = formData.endDate ? new Date(formData.endDate) : null;
    const today = new Date();

    if (end && end > start) {
      const timeDiff = end.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setFormData((prevData) => ({ ...prevData, estimatedDays: daysRemaining }));
    } else {
      setFormData((prevData) => ({ ...prevData, estimatedDays: "" }));
    }

    const completedDays = Math.ceil((today - start) / (1000 * 3600 * 24));
    setFormData((prevData) => ({ ...prevData, completedDays }));
  }, [formData.endDate, formData.startDate]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      employeeCount: formData.employees.length,
      projectProgress: Math.floor(Math.random() * 100) + 1, // Random progress %
    }));
  }, [formData.employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addTechStack = () => {
    setFormData({ ...formData, techStack: [...formData.techStack, ""] });
  };

  const updateTechStack = (index, value) => {
    const updatedStack = [...formData.techStack];
    updatedStack[index] = value;
    setFormData({ ...formData, techStack: updatedStack });
  };

  const addEmployee = () => {
    setFormData({ ...formData, employees: [...formData.employees, ""] });
  };

  const updateEmployee = (index, value) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index] = value;
    setFormData({ ...formData, employees: updatedEmployees });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        employeeCount: formData.employees.length,
        projectProgress: Math.floor(Math.random() * 100) + 1,
      };

      const response = await fetch("https://your-backend-api.com/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        alert("Project data submitted successfully!");
      } else {
        alert("Failed to submit project data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="project-form-container">
      <h2>Project Form</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-layout">
          {/* Left Column */}
          <div className="left-column">
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Team Lead</label>
              <input type="text" name="teamLead" value={formData.teamLead} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tech Stack</label>
              {formData.techStack.map((stack, index) => (
                <input key={index} type="text" value={stack} onChange={(e) => updateTechStack(index, e.target.value)} />
              ))}
              <button type="button" onClick={addTechStack} className="add-button">Add Tech</button>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} readOnly className="readonly-input" />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Employees</label>
              {formData.employees.map((employee, index) => (
                <input key={index} type="text" value={employee} onChange={(e) => updateEmployee(index, e.target.value)} />
              ))}
              <button type="button" onClick={addEmployee} className="add-button">Add Employee</button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ProjectForm;