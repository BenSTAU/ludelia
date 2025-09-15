import "./card.scss";
import CardTablesContent from "./CardTableContent";

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
          <h3>Date : {date}</h3>
          <h3>Durée : {duration}</h3>
          <h3>Difficulté : {difficulty}</h3>
          <h3>Catégorie : {category}</h3>
          <h3>Nombre de places : {nbrInscriptionsValides}/{nbr_places}</h3>
        </CardTablesContent>
      </div>
    </article>
  );
}
