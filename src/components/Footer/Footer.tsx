import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.contents}>
        memegle 2022. All rights reserved. Powered by&nbsp;
        <a className={styles.link} href="https://giphy.com/">
          Giphy
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
