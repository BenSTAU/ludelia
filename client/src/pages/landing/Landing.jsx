import { useAuth } from "../../../utils/useAuth";
import Card from "../../component/card/Card";
import "./landing.scss";
import potion from "../../assets/image/potion.svg";
import adventure from "../../assets/image/adventure.svg";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <section className="landing">
        <div className="textLanding">
          <h1>L'aventure commence ici</h1>
          <p>
            Plongez dans l'univers du jeu de rôle au festival Pautos'Jeux.
            Réservez vos places, et vivez des aventures épiques en quelques
            clics.
          </p>
        </div>
        <div className="cards">
          <Card
            cardStyle="cta"
            height={"70px"}
            onClick={() => {
              navigate("/login");
            }}
          >
            Rejoindre l'aventure !
          </Card>
          <img src={potion} alt="Dessin d'une potion" className="potion" />
          <Card height={"70px"}>Explorer les tables</Card>
          <img
            src={adventure}
            alt="Dessin d'une carte avec une épée qui la transperce"
            className="adventure"
          />
          <Card height={"70px"}>Le jeu de rôle, c'est quoi?</Card>
        </div>
      </section>
    </>
  );
}
