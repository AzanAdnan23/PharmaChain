import Dashboard from "./components/Dashboard";
import Scanner from "./components/Scanner";
import Landing from "./components/Landing";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/scanner" element={<Scanner />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </div>  
  );
}