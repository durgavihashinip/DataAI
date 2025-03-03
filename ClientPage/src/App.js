import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import PracticesPage from './pages/PracticesPage';
import ClientPage from "./pages/ClientPage";
import ClientProjects from './pages/ClientProjects';
// import ProjectForm from "./components/ProjectForm"
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<PracticesPage/>}/>
        <Route path="/practices/:practiceName" element={<ClientPage />} />
        <Route path="/clients/:clientName" element={<ClientProjects />} />
        {/* <Route path="/dashboard/:projectId" element={<Dashboard />} /> */}
        <Route path="/dashboard/:clientId/:projectId" element={<Dashboard />} />

      </Routes>
    </Router>
    
    </>
  );
}

export default App;
