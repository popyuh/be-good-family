import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Messages from "./pages/Messages";
import Shopping from "./pages/Shopping";
import Tasks from "./pages/Tasks";
import MealPlanning from "./pages/MealPlanning";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/events" element={<Events />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/meal-planning" element={<MealPlanning />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;