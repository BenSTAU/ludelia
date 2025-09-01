import CardAuth from "../../../component/card/cardAuth/CardAuth";
import "./login.scss";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import dragon from "../../../assets/image/flyingdragon.svg";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <section>
      <div>
        <h1>Connexion</h1>
        <CardAuth height={"250px"}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button className="btn btnLogin">Connexion</button>
          <img src={dragon} alt="dessin d'un dragon" className="dragonImage" />
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
          <Link to="/register">S'inscrire</Link>
        </CardAuth>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
