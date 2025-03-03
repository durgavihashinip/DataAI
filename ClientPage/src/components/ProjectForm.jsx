import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Form.css";
const API_URL = "http://127.0.0.1:8000/api/";

const ProjectForm = ({ clientId, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    project_name: "",
    project_progress: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    team_lead_id: "",
    employee_ids: [],
    technologies: [],
  });

  const [employeeList, setEmployeeList] = useState([]);
  const [techStackList, setTechStackList] = useState([]);
  const [newTech, setNewTech] = useState("");
  /// added selectedEmployees state to store selected employees
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]); // Store selected tech names


  useEffect(() => {
    axios.get(`${API_URL}employees/`)
      .then(response => setEmployeeList(response.data))
      .catch(error => console.error("Error fetching employees:", error));

    axios.get(`${API_URL}technologies/`)
      .then(response => setTechStackList(response.data))
      .catch(error => console.error("Error fetching technologies:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selectedEmployee = employeeList.find(emp => emp.employee_id === selectedId);
  
    if (selectedId && !formData.employee_ids.includes(selectedId) && selectedId !== formData.team_lead_id) {
      setFormData({ ...formData, employee_ids: [...formData.employee_ids, selectedId] });
      setSelectedEmployees([...selectedEmployees, selectedEmployee]); // Store name for UI
    }
  };
  
  const removeEmployee = (id) => {
    setFormData({ ...formData, employee_ids: formData.employee_ids.filter(empId => empId !== id) });
    setSelectedEmployees(selectedEmployees.filter(emp => emp.employee_id !== id));
  };

  const handleTechChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedTech = techStackList.find(tech => tech.id === selectedId);
  
    if (selectedTech && !formData.technologies.includes(selectedId)) {
      setFormData({ ...formData, technologies: [...formData.technologies, selectedId] });
      setSelectedTechs([...selectedTechs, selectedTech]); // Store name for UI
    }
  };
    

  const addNewTechStack = async () => {
    if (!newTech.trim()) return;

    try {
      const response = await axios.post(`${API_URL}technologies/`, { name: newTech });
      setTechStackList([...techStackList, response.data]);
      setFormData({ ...formData, technologies: [...formData.technologies, response.data.id] });
      setNewTech("");
    } catch (error) {
      console.error("Error adding new tech stack:", error);
    }
  };
  const removeTech = (id) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== id) });
    setSelectedTechs(selectedTechs.filter(tech => tech.id !== id));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, client_id: clientId };
  
    try {
      await axios.post(`${API_URL}create_project/`, finalData);
      alert("Project created successfully!");
      onProjectAdded();
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
  };
  
  return (
    <div className="overlay">
      <div className="project-form-container">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Project Form</h2>
        <form onSubmit={handleSubmit}>
          <label>Project Name</label>
          <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} required />
          
          <label>Project Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
          
          <label>Progress Percentage</label>
          <input type="number" name="project_progress" value={formData.project_progress} onChange={handleChange} min="0" max="100" />
          
          <label>Start Date</label>
          <input type="date" name="start_date" value={formData.start_date} readOnly />
          
          <label>End Date</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />

          <label>Select Team Lead</label>
          <select name="team_lead_id" value={formData.team_lead_id} onChange={handleChange}>
            <option value="">Select Team Lead</option>
            {employeeList.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>
            ))}
            {/* {employeeList
  .filter(emp => emp.employee_id !== formData.team_lead_id && !(emp.employee_name === "Durga" && emp.employee_role === "admin"))
  .map(emp => (
    <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>
))} */}


          </select>

          <label>Select Employees</label>
          <select onChange={handleEmployeeChange} defaultValue="">
            <option value="" disabled>Select Employee</option>
            {employeeList.filter(emp => emp.employee_id !== formData.team_lead_id).map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>
            ))}
          </select>

<ul className="selected-list">
  {selectedEmployees.map(emp => (
    <li key={emp.employee_id}>
      {emp.employee_name}
      <button className="remove-btn" type="button" onClick={() => removeEmployee(emp.employee_id)}>✖</button>
    </li>
  ))}
</ul>

          <label>Select Tech Stack</label>
<select onChange={handleTechChange} defaultValue="">
  <option value="" disabled>Select Tech Stack</option>
  {techStackList.map(tech => (
    <option key={tech.id} value={tech.id}>{tech.name}</option>
  ))}
</select>

<input type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Add New Tech Stack" />
<button type="button" onClick={addNewTechStack}>Add Tech</button>

<ul className="selected-list">
  {selectedTechs.map(tech => (
    <li key={tech.id}>
      {tech.name} 
      <button className="remove-btn" type="button" onClick={() => removeTech(tech.id)}>✖</button>
    </li>
  ))}
</ul>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
