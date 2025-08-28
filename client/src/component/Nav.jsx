import "./nav.scss";
import logo from "../assets/image/logo.svg";
import { CiMenuBurger } from "react-icons/ci";

export default function Nav() {
  return (
    <nav>
      <img src={logo} alt="logo" width="100" />
      <button>
        <CiMenuBurger size={30} />
      </button>
      <ul className="desktopNav">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
}
