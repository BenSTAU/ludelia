import "./nav.scss";
import logo from "../../assets/image/logo.svg";
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import login from "../../assets/image/login.svg";
import logout from "../../assets/image/logout.svg";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/useAuth";

export default function Nav() {
  const navigate = useNavigate();
  const [menuBurgerOpen, setMenuBurgerOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  async function handleLogout() {
    const toastId = toast.loading("Deconnexion en cours...");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/v1/auth/logout`,
      {
        method: "POST",
        credentials: "include",
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
  }

  return (
    <header>
      <nav>
        <img src={logo} alt="logo" width="100" onClick={() => navigate("/")} />
        <button>
          <CiMenuBurger
            size={30}
            color="var(--color-secondary-light"
            onClick={() => setMenuBurgerOpen(!menuBurgerOpen)}
          />
        </button>
        <ul className={menuBurgerOpen ? "mobileNav" : "desktopNav"}>
          <li>Home</li>
          <li>About</li>
          <li>
            <img
              src={isAuthenticated ? logout : login}
              alt="bouton de deconnexion"
              onClick={
                isAuthenticated ? handleLogout : () => navigate("/login")
              }
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}
