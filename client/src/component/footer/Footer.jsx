import "./footer.scss";
import { Link } from "react-router-dom";

export default function Footer({ adresse, mail }) {
  return (
    <footer>
      {/* <div>
        <h3>Infos pratiques</h3>
        <p>Lieu : {adresse}</p>
        <p>Mail : {mail}</p>
      </div> */}
      <h3>
        <Link to="/mentions">Mentions légales</Link>
      </h3>
      <p>2025 Ludelia - Projet développé par Benjamin Saint-augustin</p>
    </footer>
  );
}
