import "./css/App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NarutoLayout from "./components/NarutoLayout";
import NarutoDex from "./components/NarutoDex";

function App() {
  return (
    // Real paths (/narutodex3d/12) rather than a hash: GitHub Pages serves one
    // HTML file per character, written at build time (see vite.config.ts).
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<NarutoDex />} />
        <Route path="/:narutoId" element={<NarutoLayout />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
