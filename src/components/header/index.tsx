import styles from "./header.module.css";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className={styles.container}>
            <Link to="/">
                <img src={logoImg}/>
            </Link>
        </header>
    );
}