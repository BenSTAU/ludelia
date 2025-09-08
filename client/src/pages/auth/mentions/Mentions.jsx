import "./mentions.scss";
export default function Mentions() {
  return (
    <section className="mentions">
      <h1>Mentions légales</h1>
      <article>
        <h2>Éditeur du site</h2>
        <p>
          Le site Ludelia est édité dans le cadre d’un projet de certification
          RNCP 37273 – Développeur web fullstack.
        </p>
        <p>Responsable de la publication : Benjamin Saint-Augustin</p>
        <p>Adresse : Projet étudiant – usage pédagogique</p>
        <p>Email : ben.saint.augustin@gmail.com</p>
      </article>
      <article>
        <h2>Hébergement</h2>
        <p>Le site est hébergé par : Vercel Inc.</p>
        <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
        <p>
          <a href="https://vercel.com">Site : https://vercel.com</a>
        </p>
      </article>
      <article>
        <h2>Responsabilité</h2>
        <p>
          L’éditeur du site met tout en œuvre pour assurer l’exactitude des
          informations diffusées.
        </p>
        <p>
          Toutefois, il ne saurait être tenu responsable en cas d’erreurs, de
          dysfonctionnements techniques ou d’utilisation inappropriée du site.
        </p>
      </article>
      <article>
        <h2>Données personnelles (RGPD)</h2>
        <p>
          Le site collecte des données personnelles nécessaires au
          fonctionnement de la plateforme (nom, pseudo, adresse e-mail,
          réservations). Ces données sont utilisées uniquement dans le cadre de
          l’organisation des parties de jeu de rôle.
        </p>
        <p>
          Conformément au Règlement Général sur la Protection des Données
          (RGPD), vous disposez d’un droit d’accès, de rectification et de
          suppression de vos données. Pour exercer ce droit, vous pouvez écrire
          à : ben.saint.augustin@gmail.com
        </p>
        <p>
          Les données sont conservées uniquement pendant la durée de l’événement
          ou jusqu’à suppression du compte utilisateur.
        </p>
      </article>
      <article>
        <h2>Cookies</h2>
        <p>
          Le site utilise uniquement des cookies techniques nécessaires à
          l’authentification (connexion sécurisée via JWT).
        </p>
        <p>Aucun cookie de suivi publicitaire ou d’analyse n’est utilisé.</p>
      </article>
      <article>
        <h2>Loi applicable</h2>
        <p>Les présentes mentions légales sont soumises au droit français.</p>
        <p>
          En cas de litige, et à défaut de résolution amiable, les tribunaux
          français seront seuls compétents.
        </p>
      </article>
    </section>
  );
}
