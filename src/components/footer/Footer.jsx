import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>NV Rest Api</div>
      <div className={styles.text}>
        NV Team © All rights reserved 2025.
      </div>
    </div>
  );
};

export default Footer;
