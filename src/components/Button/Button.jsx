import React from "react";
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({ variant = "primary", children, className, ...props }) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 