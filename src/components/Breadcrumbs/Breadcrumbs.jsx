import React from "react";
import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={item.to} className={styles.crumb}>
          {idx > 0 && <span className={styles.separator}>/</span>}
          <Link to={item.to}>{item.label}</Link>
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 