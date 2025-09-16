import CardForm from "./CardForm";
import plus from "../../assets/image/plus.svg";
import "./card.scss";
import InvitationContent from "./InvitationContent";

export default function CardInscription({
  title = "Titre par défaut",
  subtitle = "Sous-titre par défaut",
  invitations = [],
  onInvitationChange,
  onAddInvitation,
  onSubmit,
    removeInvitation
}) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <article className="card cardTable cardForm cardInscription">
      <div
        className="cardHeader"
        style={{ backgroundColor: "var(--color-accent-2)" }}
      >
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
      <form className="cardInscriptionForm" onSubmit={handleSubmit}>
        <h2>Voulez vous vous inscrire ?</h2>
        <div>
          <h3>Ajouter une personne</h3>
          <button type="button" onClick={onAddInvitation}>
            <img src={plus} alt="icône plus" />
          </button>
        </div>
        
        {/* Ici s'affichent toutes les invitations */}
        {invitations.map((invitation, index) => (
          <InvitationContent
            key={index}
            index={index}
            nom={invitation.nom}
            email={invitation.email}
            onChangeNom={(value) => onInvitationChange(index, 'nom', value)}
            onChangeEmail={(value) => onInvitationChange(index, 'email', value)}
            isLastInvitation={index === invitations.length - 1}
            onClickAddPerson={onAddInvitation}
            removeInvitation={removeInvitation}
          />
        ))}
        
        <button type="submit" className="card cardLanding cta">Valider</button>
      </form>
    </article>
  );
}