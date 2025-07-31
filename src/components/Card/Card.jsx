import React from "react";
import styles from "./Card.module.css";
import clsx from "clsx";

const Card = ({ variant = "default", children, className, ...props }) => {
  return (
    <div className={clsx(styles.card, styles[variant], className)} {...props}>
      {children}
    </div>
  );
};

export default Card; 