import Card from "./component/card/cardTable/CardTable.jsx";
import Footer from "./component/footer/Footer";
import Nav from "./component/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages auth
import Login from "./pages/auth/login/Login.jsx";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
