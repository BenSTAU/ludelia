import minus from "../../assets/image/minus.svg";
import "./styles/card.scss"

export default function InvitationContent({
  index,
  nom,
  email,
  onChangeNom,
  onChangeEmail,
  removeInvitation,
}) {
  const handleNomChange = (e) => {
    onChangeNom(e.target.value);
  };

  const handleEmailChange = (e) => {
    onChangeEmail(e.target.value);
  };

  return (
    <div>
      <div className="invitationBox">
        <h2>Nom {index + 1}</h2>
        <button
          type="button"
          onClick={() => removeInvitation(index)}
          className="remove-btn"
        >
          <img src={minus} alt="Retirer l'invitation" />
        </button>
      </div>

      <input
        type="text"
        name={`name-${index}`}
        placeholder="Nom"
        required
        value={nom}
        onChange={handleNomChange}
      />

      <div>
        <h2>Email {index + 1}</h2>
        <input
          type="email"
          name={`email-${index}`}
          placeholder="Email (optionnel)"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
    </div>
  );
}
