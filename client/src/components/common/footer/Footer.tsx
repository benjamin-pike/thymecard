import { FC } from "react";
import styles from "./footer.module.scss";

const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <p>
                <span>About</span> • <span>Support</span>
            </p>
            <p>
                <span>Terms and Conditions</span> • <span>Privacy Policy</span>
            </p>
            <p>
                © <span className={styles.year}>{new Date().getFullYear()}</span> Serona
            </p>
        </footer>
    );
};

export default Footer;
