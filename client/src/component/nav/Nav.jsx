// Import globaux React et librairies tierces
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CiMenuBurger } from "react-icons/ci";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

// Import des composants locaux
import "./nav.scss";

// Import des assets
import logo from "../../assets/image/logo.svg";
import logoDarkTheme from "../../assets/image/logoDarkTheme.svg";
import login from "../../assets/image/login.svg";
import logoutButton from "../../assets/image/logout.svg";
import user from "../../assets/image/user.svg";
import userDarkMode from "../../assets/image/userDarkMode.svg";

// Import des utilitaires
import { useAuth } from "../../../utils/useAuth";

export default function Nav() {
  const navigate = useNavigate();
  const [menuBurgerOpen, setMenuBurgerOpen] = useState(false);
  const { isAuthenticated, logout, isMj, isAdmin } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Active ou désactive le mode sombre et sauvegarde le choix en localStorage
  const handleDarkModeToggle = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      setIsDarkMode(true);
    }
  };

  // Déconnecte l'utilisateur via l'API et met à jour l'état global
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
      logout();
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
        <img
          src={isDarkMode ? logoDarkTheme : logo}
          alt="logo"
          width="100"
          onClick={() => navigate("/")}
        />
        <button>
          <CiMenuBurger
            size={30}
            color=" var(--color-burger)"
            onClick={() => setMenuBurgerOpen(!menuBurgerOpen)}
          />
        </button>
        <ul className={menuBurgerOpen ? "mobileNav" : "desktopNav"}>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/tables">Explorer les tables</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/mytables">Mes parties</Link>
            </li>
          )}
          {(isMj || isAdmin) && (
            <li>
              <Link to="/mj">Mon panel MJ</Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link>Mon panel Admin</Link>
            </li>
          )}
          <div className="navDarkAndUser">
            {isDarkMode && isAuthenticated && (
              <li>
                <img src={userDarkMode} alt="symbole de l'utilisateur" />
              </li>
            )}
            {!isDarkMode && isAuthenticated && (
              <li>
                <img src={user} alt="symbole de l'utilisateur" />
              </li>
            )}
            <li>
              {isDarkMode ? (
                <MdDarkMode
                  size={30}
                  color="var(--color-burger)"
                  onClick={handleDarkModeToggle}
                />
              ) : (
                <MdOutlineDarkMode
                  size={30}
                  color="var(--color-burger)"
                  onClick={handleDarkModeToggle}
                />
              )}
            </li>
          </div>
          <li>
            <img
              src={isAuthenticated ? logoutButton : login}
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
