import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export async function handleResendActivationEmail(e, email, navigate) {
    e.preventDefault();

    const toastId = toast.loading("Envoie en cours...");
    
    try {
      const response = await fetch (
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
        if (response.status === 400) {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(data.message, {
        id: toastId,
        duration: 2000,
      });
    }
  }