import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages auth
import Login from "./pages/auth/login/Login.jsx";
import Register from "./pages/auth/register/Register.jsx";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
