//regex pour le mot de passe (au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial)
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
//regex pour le mail
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//regex pour le numéro de téléphone
export const phoneRegex = /^(0\d{9}|\+33\d{9})$/;
