import CardAuth from "../../../component/card/cardAuth/CardAuth";
import "./register.scss";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import fairy from "../../../assets/image/fairy.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
  });

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

  return (
    <section>
      <div>
        <h1>Inscription</h1>
        <CardAuth height={"600px"}>
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
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
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
          <Link to="/">Se connecter</Link>
        </CardAuth>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
