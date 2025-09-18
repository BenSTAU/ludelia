import "../../styles/_confirmationBox.scss";
export default function ConfirmationBox({ titre, date, onClickAccept, onClickCancel }) {
  return (
    <article className="card confirmationBox">
        <h2>Désinscription</h2>
        <h3>{titre}</h3>
        <p>{date}</p>
        <p>Êtes-vous sûr de vouloir continuer ?</p>
        <div className="buttonGroupForm">
          {/* Bouton de validation */}
          <button className="card cardLanding cta" onClick={onClickAccept}>
            Valider
          </button>
          {/* Bouton d'annulation */}
          <button
            type="button"
            onClick={onClickCancel}
            className="card cardLanding ctaCancel"
          >
            Annuler
          </button>
        </div>
    </article>
  )
}
