import "./nav.scss";
import logo from "../../assets/image/logo.svg";
import { CiMenuBurger } from "react-icons/ci";

export default function Nav() {
  return (
    <header>
      <nav>
        <img src={logo} alt="logo" width="100" />
        <button>
          <CiMenuBurger size={30} color="var(--color-secondary-light" />
        </button>
        <ul className="desktopNav">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
}
