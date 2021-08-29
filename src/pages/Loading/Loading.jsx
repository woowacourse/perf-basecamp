import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <>
      <NavBar />
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    </>
  );
};

export default Loading;
