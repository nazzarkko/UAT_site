import React from 'react';
import Link from 'next/link';
import styles from "../../styles/Header.module.css"


const Header = () => {
  return (
    <div className={styles.header}>
        <img className={styles.icon} src='/LOGO.png'></img>
    </div>
  );
};

export default Header;
