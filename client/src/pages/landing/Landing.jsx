import Card from "../../component/card/Card";
import "./landing.scss";
import potion from "../../assets/image/potion.svg";
import adventure from "../../assets/image/adventure.svg";
import { useNavigate } from "react-router-dom";
import arrow from "../../assets/image/arrow.svg";
import { useState } from "react";

export default function Landing() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

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
            cardStyle="landingButton cta"
            onClick={() => {
              navigate("/login");
            }}
          >
            Rejoindre l'aventure !
          </Card>
          <img src={potion} alt="Dessin d'une potion" className="potion" />
          <Card cardStyle="landingButton" onClick={() => navigate("/tables")}>
            Explorer les tables
          </Card>
          <img
            src={adventure}
            alt="Dessin d'une carte avec une épée qui la transperce"
            className="adventure"
          />
          <Card
            height={expanded ? "auto" : ""}
            cardStyle="landingButton jdr"
            onClick={handleExpanded}
          >
            Le jeu de rôle, c'est quoi?
            {expanded && (
              <p>
                Le jeu de rôle, c’est une aventure grandeur nature… mais dans
                votre imagination ! Avec des amis autour d’une table, vous
                incarnez un héros, prenez des décisions et écrivez ensemble une
                histoire pleine de rebondissements. Pas besoin d’expérience : il
                suffit d’avoir envie de jouer et de se laisser porter par
                l’aventure ! Alors n'hésitez pas ! Inscrivez-vous à une table et
                venez vous amuser !
              </p>
            )}
            <img
              src={arrow}
              alt="Flèche descendante pour indiquer que le contenu est déroulant"
            />
          </Card>
        </div>
      </section>
    </>
  );
}
