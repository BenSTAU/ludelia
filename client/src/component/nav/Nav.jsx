import "./nav.scss";
import logo from "../../assets/image/logo.svg";
import logoDarkTheme from "../../assets/image/logoDarkTheme.svg";
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate, Link } from "react-router-dom";
import login from "../../assets/image/login.svg";
import logoutButton from "../../assets/image/logout.svg";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/useAuth";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import user from "../../assets/image/user.svg";
import userDarkMode from "../../assets/image/userDarkMode.svg";

export default function Nav() {
  const navigate = useNavigate();
  const [menuBurgerOpen, setMenuBurgerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

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
            <Link>Explorer les tables</Link>
          </li>
          <li>
            <Link>Mes parties</Link>
          </li>
          <li>
            <Link>Mon panel MJ</Link>
          </li>
          <li>
            <Link>Mon panel Admin</Link>
          </li>
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
