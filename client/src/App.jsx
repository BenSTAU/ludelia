// Import des librairies globales
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import des composants globaux
import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";

// Import des pages principales
import Landing from "./pages/landing/Landing.jsx";
import Mentions from "./pages/Mentions.jsx";

// Import des pages d'authentification
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Activate from "./pages/auth/Activate.jsx";
import ForgottenPassword from "./pages/auth/ForgottenPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Import des pages de tables
import Tables from "./pages/tables/Tables.jsx";
import MyTables from "./pages/tables/MyTables.jsx";
import TablesMj from "./pages/tables/TablesMj.jsx";

// Import des routes protégées et utilitaires
import CheckAuth from "../utils/CheckAuth.jsx";
import { ProtectedRoute, AdminRoute, MjRoute } from "../utils/ProtectedRoutes.jsx";

// Composant principal de l'application
function App() {
  return (
    <>
      {/* Vérifie l'authentification globale à chaque navigation */}
      <CheckAuth>
        <Router>
          <Nav />
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activatemail/:token" element={<Activate />} />
            <Route path="/" element={<Landing />} />
            <Route path="/forgotpassword" element={<ForgottenPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/mentions" element={<Mentions />} />
            <Route path="/tables" element={<Tables />} />

            {/* Routes protégées : accès uniquement si connecté */}
            <Route element={<ProtectedRoute />}>
              <Route path="/mytables" element={<MyTables />} />
            </Route>
            {/* Routes MJ : accès uniquement MJ */}
            <Route element={<MjRoute />}>
              <Route path="/mj" element={<TablesMj />} />
            </Route>
            {/* Route Admin : accès uniquement admin */}
            <Route element={<AdminRoute />}></Route>
          </Routes>
          {/* Affichage des notifications toast */}
          <Toaster />
          <Footer />
        </Router>
      </CheckAuth>
    </>
  );
}

export default App;
