import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Billing from "./Components/Pages/Billing";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          style={{
            marginLeft: collapsed ? "72px" : "250px",
            padding: "24px",
            width: "100%",
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
            background: "#f4f6fb",
          }}
        >
          <Routes>
            <Route path="/" element={<Billing />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
