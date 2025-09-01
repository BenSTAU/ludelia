import { useNavigate, useParams } from "react-router-dom";
import CardAuth from "../../../component/card/cardAuth/CardAuth";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";

export default function Activate() {
    const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const token = useParams().token;

  async function activateAccount() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/activate/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (response.ok) {
         toast.success(data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        setResponseMessage(data.message);
        } else {
          toast.error(data.message, {
            position: "top-center",
            autoClose: 2000,
          });
            setResponseMessage(data.message);
    }
  }
  useEffect (() => {
    activateAccount();
  }, []);
  return (
    <section>
      <CardAuth height={"200px"}>
          <h2>{responseMessage}</h2>
          <button className="btn btnLogin" onClick={() => navigate("/")}>
            Retour
          </button>

      </CardAuth>
    </section>
  );
}
