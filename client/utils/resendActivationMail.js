// Import de la librairie de notifications toast
import toast from "react-hot-toast";


// Fonction critique : envoie une nouvelle demande d'activation par email
export async function handleResendActivationEmail(e, email) {
  e.preventDefault();

  // Affiche une notification de chargement pendant l'envoi
  const toastId = toast.loading("Envoie en cours...");

  try {
    // Appel API pour demander la réactivation du compte
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/v1/auth/resendactivation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();

    // Affiche le message de succès ou d'erreur selon la réponse
    if (response.ok) {
      toast.success(data.message, {
        id: toastId,
        duration: 2000,
      });
    } else {
      toast.success(data.message, {
        id: toastId,
        duration: 2000,
      });
      // Redirige vers la page d'accueil si l'email est déjà activé
      if (response.status === 400) {
        navigate("/");
      }
    }
  } catch (error) {
    // Affiche une erreur si l'appel API échoue
    toast.error("Erreur lors de l'envoi de l'email d'activation.", {
      id: toastId,
      duration: 2000,
    });
  }
}