import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        (c) memegle. All rights reserved. Powered by&nbsp;
        <a href="https://giphy.com/">Giphy</a>.
      </p>
    </footer>
  );
};

export default Footer;
