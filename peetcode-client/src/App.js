import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import ProblemsHome from "./Components/Problems/ProblemsHome/ProblemsHome";
import ProblemPage from "./Components/Problems/ProblemPage/ProblemPage";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" Component={Signup} />
        <Route exact path="/login" Component={Login} />
        <Route exact path="/problems" Component={ProblemsHome} />
        <Route exact path="/problem/:id" Component={ProblemPage} />
      </Routes>
    </div>
  );
}

export default App;
