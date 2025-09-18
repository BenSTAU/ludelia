import minus from "../../assets/image/minus.svg";

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
        <label htmlFor={`name-${index}`}>Nom {index + 1}</label>
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
        <label htmlFor={`email-${index}`}>Email {index + 1}</label>
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
