import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PracticesPage.css";
import logo from "../assets/relanto-logo.jpg";
import data from "../assets/data.png";
import salesforce from "../assets/salesforce.png";
import digitalTransformation from "../assets/dt.png";
import planning from "../assets/planning.png";
import aiLab from "../assets/AIfirstLab.png";
const sections = [
  {
    id: 1,
    title: "Data and AI",
    description: "For practice information",
    image: data,
    link: "/practices/data-ai",
  },
  {
    id: 2,
    title: "Salesforce",
    description: "Learn about machine learning applications",
    image: salesforce,
    link: "/",
  },
  {
    id: 3,
    title: "Digital Transformation",
    description: "Explore AI technologies and trends",
    image: digitalTransformation,
    link: "/",
  },
  {
    id: 4,
    title: "Planning",
    description: "Understand deep learning techniques",
    image: planning,
    link: "/",
  },
  {
    id: 5,
    title: "AI First Lab",
    description: "Manage your practices effectively with this tool",
    image: aiLab,
    link: "/",
  },
];
const PracticesPage = () => {
  const navigate = useNavigate();
  return (
<div className="home-page">
<header className="header">
<img src={logo} alt="Company Logo" className="logo" />
<h1 className="hero">Welcome to Relanto Practice Management</h1>
</header>
<div className="card-container">
        {sections.map((section) => (
<div 
            key={section.id} 
            className="card" 
            onClick={() => navigate(section.link)}
            // onClick={() => navigate(`/practices/${section.title.toLowerCase().replace(/\s+/g, "-")}`)}
>
<img src={section.image} alt={section.title} className="card-image" />
<div className="card-content">
<h3>{section.title}</h3>
<p>{section.description}</p>
</div>
</div>

        ))}
</div>
</div>

  );

};
 
export default PracticesPage;

 