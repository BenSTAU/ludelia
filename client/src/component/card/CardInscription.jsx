import InvitationContent from "./InvitationContent";
import plus from "../../assets/image/plus.svg";

import "./styles/card.scss"

export default function CardInscription({
  title = "Titre par défaut",
  subtitle = "Sous-titre par défaut",
  invitations = [],
  onInvitationChange,
  onAddInvitation,
  onSubmit,
  removeInvitation,
  cancelInscription,
  setMessage,
}) {

  // --- Gestion du submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // --- Rendu ---
  return (
    <article className="card cardTable cardForm cardInscription">
      {/* En-tête de la carte */}
      <div
        className="cardHeader"
        style={{ backgroundColor: "var(--color-accent-2)" }}
      >
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>

      {/* Formulaire d'inscription */}
      <form className="cardInscriptionForm" onSubmit={handleSubmit}>
        <h2>Voulez-vous vous inscrire ?</h2>
        <textarea
          placeholder="Ajouter un message... (optionnel)"
          rows="4"
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Bouton pour ajouter une nouvelle invitation */}
        <div>
          <h3>Ajouter une personne</h3>
          <button type="button" onClick={onAddInvitation}>
            <img src={plus} alt="icône plus" />
          </button>
        </div>

        {/* Liste des invitations dynamiques */}
        {invitations.map((invitation, index) => (
          <InvitationContent
            key={index}
            index={index}
            nom={invitation.nom}
            email={invitation.email}
            onChangeNom={(value) => onInvitationChange(index, "nom", value)}
            onChangeEmail={(value) => onInvitationChange(index, "email", value)}
            isLastInvitation={index === invitations.length - 1}
            onClickAddPerson={onAddInvitation}
            removeInvitation={removeInvitation}
          />
        ))}
        <div className="buttonGroupForm">
          {/* Bouton de validation */}
          <button type="submit" className="card cardLanding cta">
            Valider
          </button>
          {/* Bouton d'annulation */}
          <button
            type="button"
            onClick={cancelInscription}
            className="card cardLanding ctaCancel"
          >
            Annuler
          </button>
        </div>
      </form>
    </article>
  );
}
