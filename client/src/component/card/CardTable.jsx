import "./card.scss";
import CardTablesContent from "./CardTableContent";
import destructive from "../../assets/image/destructive.svg";
import pouch from "../../assets/image/pouch.svg";

export default function Card({
  height,
  backgroundHeader,
  title,
  subtitle,
  description,
  date,
  difficulty,
  category,
  nbr_places,
  duration,
  nbrInscriptionsValides,
}) {
  return (
    <article className="card cardTable" style={{ height: height }}>
      <div className="cardHeader" style={{ backgroundColor: backgroundHeader }}>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
      <div className="cardContent">
        <div className="description">
          <h2>Description : </h2>
          <p>{description}</p>
        </div>
        <CardTablesContent>
          <img className="destructiveIcon" src={destructive} alt="dessin d'une main qui a du feu magique au dessus" />
          <h3>Date : {date}</h3>
          <h3>Durée : {duration}</h3>
          <h3>Difficulté : {difficulty}</h3>
          <h3>Catégorie : {category}</h3>
          <h3>Nombre de places : {nbrInscriptionsValides}/{nbr_places}</h3>
          <img className="pouchIcon" src={pouch} alt="dessin d'une bourse" />
        </CardTablesContent>
      </div>
    </article>
  );
}
