import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages auth
import Login from "./pages/auth/login/Login.jsx";
import Register from "./pages/auth/register/Register.jsx";
import Activate from "./pages/auth/activation/Activate.jsx";
import ForgottenPassword from "./pages/auth/password/ForgottenPassword.jsx";

import Landing from "./pages/landing/Landing.jsx";
import ResetPassword from "./pages/auth/password/ResetPassword.jsx";
import CheckAuth from "../utils/CheckAuth.jsx";

function App() {
  return (
    <>
      <CheckAuth>
        <Router>
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activatemail/:token" element={<Activate />} />
            <Route path="/" element={<Landing />} />
            <Route path="/forgotpassword" element={<ForgottenPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
          </Routes>
          <Toaster />
          <Footer />
        </Router>
      </CheckAuth>
    </>
  );
}

export default App;
