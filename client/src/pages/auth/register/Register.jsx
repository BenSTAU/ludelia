import CardAuth from "../../../component/card/cardAuth/CardAuth";
import "./register.scss";
import CardGoogle from "../../../component/card/cardGoogle/CardGoogle";
import fairy from "../../../assets/image/fairy.svg";

export default function Login() {
  return (
    <section>
      <div>
        <h1>Connexion</h1>
        <CardAuth height={"600px"}>
          <div>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Entrez votre nom d'utilisateur"
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
              required
            />
          </div>
          <button className="btn btnRegister">S'inscrire</button>
          <img src={fairy} alt="dessin d'une fée" className="fairyImage" />

          <a href="#">Mot de passe oublié ?</a>
          <a href="#">S'inscrire</a>
        </CardAuth>
        <h2> Ou </h2>
        <CardGoogle />
      </div>
    </section>
  );
}
