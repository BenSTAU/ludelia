import "react-toastify/dist/ReactToastify.css";
import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages auth
import Login from "./pages/auth/login/Login.jsx";
import Register from "./pages/auth/register/Register.jsx";
import Activate from "./pages/auth/activation/Activate.jsx";

import Landing from "./pages/landing/Landing.jsx";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activatemail/:token" element={<Activate />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        limit={3}
      />
    </>
  );
}


export default App;
