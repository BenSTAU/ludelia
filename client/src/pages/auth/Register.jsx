import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import des composants locaux
import CardForm from "../../component/card/CardForm";
import CardGoogle from "../../component/card/CardGoogle";
import Password from "../../component/auth/Password";

// Import des assets
import fairy from "../../assets/image/fairy.svg";

export default function Register() {
  const navigate = useNavigate();

  // États pour les champs du formulaire d'inscription
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
  });

  // Gère la soumission du formulaire d'inscription
  async function handleRegister(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const toastId = toast.loading("Inscription en cours...");

    try {
      // Appel API pour créer un nouvel utilisateur
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          id: toastId,
          duration: 2000,
        });
        navigate("/");
      } else {
        toast.error(data.message, {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription", {
        id: toastId,
        duration: 2000,
      });
    }
  }

  // Affichage principal du formulaire d'inscription
  return (
    <section>
      <div>
        <h1>Inscription</h1>
        <CardForm height={"600px"}>
          <div>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="Nom">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Entrez votre nom"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="surname">Prénom</label>
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Entrez votre prénom"
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <Password
              id="password"
              nom="password"
              placeholder="Entrez votre mot de passe"
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <Password
              id="confirmPassword"
              nom="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div>
            <label htmlFor="telephone">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              placeholder="Entrez votre numéro de téléphone"
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              required
            />
          </div>
          <button onClick={handleRegister} className="btn btnRegister">
            S'inscrire
          </button>
          <img src={fairy} alt="dessin d'une fée" className="fairyImage" />
          <Link to="/login">Se connecter</Link>
        </CardForm>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
