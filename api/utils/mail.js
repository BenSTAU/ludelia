// Import de la librairie tierce pour l'envoi d'emails
import nodemailer from "nodemailer";

// Envoie un email via le service Gmail avec les paramètres d'environnement
export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Génère le contenu HTML pour l'email d'activation de compte
export const htmlActivateAccount = (surname, link) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Activation de compte</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #F5DEB3;">
        <h1>Bienvenue ${surname} sur Ludelia !</h1>
        <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #DAA520; color: #F8F5F0; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Activer mon compte</a>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer ce message.</p>
      </body>
    </html>
  `;
};

// Génère le contenu HTML pour l'email de réinitialisation de mot de passe
export const htmlResetPassword = (surname, link) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Réinitialisation du mot de passe</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #F5DEB3;">
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ${surname},</p>
        <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #DAA520; color: #F8F5F0; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Réinitialiser mon mot de passe</a>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer ce message.</p>
      </body>
    </html>
  `;
};

// Génère le contenu HTML pour l'email de confirmation d'inscription à une table
export const htmlInscriptionConfirmation = (
  surname,
  tableName,
  dateDebut,
  dateFin
) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Confirmation d'inscription</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #F5DEB3;">
        <h1>Merci ${surname} pour votre inscription !</h1>
        <p>Vous avez été inscrit avec succès à la table ${tableName}.</p>
        <p>La date de début est : ${dateDebut}</p>
        <p>La date de fin est : ${dateFin}</p>
        <p>Nous vous attendons avec impatience.</p>
      </body>
    </html>
  `;
};

// Génère le contenu HTML pour l'email d'annulation d'invitation
export const htmlInvitationCancellation = (surname, tableName) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Annulation d'inscription</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #F5DEB3;">
        <h1>Bonjour ${surname},</h1>
        <p>Nous sommes désolés de vous informer que votre inscription à la table ${tableName} a été annulée.</p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      </body>
    </html>
  `;
};
