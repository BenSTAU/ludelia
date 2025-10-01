import { Link } from "react-router-dom";
import "./footer.scss";

export default function Footer({ adresse, mail }) {
  return (
    <footer>
      <h3>
        <Link to="/mentions">Mentions légales</Link>
      </h3>
      <p>2025 Ludelia - Projet développé par Benjamin Saint-augustin</p>
    </footer>
  );
}
