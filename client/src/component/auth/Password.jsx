import { useState } from "react";
import eye from "../../assets/image/eye.svg";
import eyeClosed from "../../assets/image/eyeClosed.svg";

export default function Password({
  id,
  nom,
  placeholder,
  formData,
  setFormData,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="passwordInputContainer">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={nom}
          placeholder={placeholder}
          onChange={(e) => setFormData({ ...formData, [nom]: e.target.value })}
          required
        />
        <img
          className="eyeIcon"
          src={showPassword ? eyeClosed : eye}
          alt="Afficher le mot de passe"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
    </>
  );
}
