import CardAuth from '../../../component/card/cardAuth/CardAuth';
import './login.scss';
import CardGoogle from '../../../component/card/cardGoogle/CardGoogle';
import dragon from '../../../assets/image/flyingdragon.svg'

export default function Login() {
  return (
    <section>
      <CardAuth>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder='Entrez votre email' required />
          </div>
          <div>
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" placeholder='Entrez votre mot de passe' required />
          </div>
          <button className='btnLogin'>Connexion</button>
          <img src={dragon} alt="dessin d'un dragon" className='dragonImage' />
          <a href="#">Mot de passe oublié ?</a>
          <a href="#">S'inscrire</a>
        </form>
      </CardAuth>
      <h2> Ou </h2>
      <CardGoogle />

    </section>
  );
}
