import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ open, onClose, children, showClose }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {showClose && (
          <button className={styles.close} onClick={onClose}>&times;</button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal; 