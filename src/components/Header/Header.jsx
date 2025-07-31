import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../Button/Button";
import useAuth from "../../hooks/useAuth";

const Header = ({ isLoggedIn, onLoginClick, onProfileClick, searchValue, onSearchChange, onSearchSubmit, hideSearchBar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}><Link to="/">CouponHarvest</Link></div>
      <nav className={styles.nav} style={{ marginLeft: 48, alignItems: 'center', display: 'flex' }}>
        <Link to="/" className={location.pathname === "/" ? styles.active : ""}>Home</Link>
        <Link to="/about" className={location.pathname === "/about" ? styles.active : ""}>About</Link>
        <Link to="/how-it-works" className={location.pathname === "/how-it-works" ? styles.active : ""}>How It Works</Link>
        {profile && profile.role === "admin" && (
          <button
            className={styles.adminButton}
            onClick={() => navigate("/admin")}
          >
            Admin
          </button>
        )}
      </nav>
      {!hideSearchBar ? (
        <div className={styles.searchBarContainer}>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit();
            }}
          >
            <input
              className={styles.searchBar}
              type="text"
              placeholder="Search stores..."
              value={searchValue}
              onChange={onSearchChange}
            />
          </form>
        </div>
      ) : (
        <div className={styles.searchBarContainer}>
          <div style={{ width: 320, height: 40, background: 'var(--color-neutral-white)', borderRadius: 20 }} />
        </div>
      )}
      <div className={styles.actions}>
        {isLoggedIn ? (
          <Button variant="secondary" onClick={onProfileClick}>Profile</Button>
        ) : (
          <Button variant="primary" onClick={onLoginClick}>Login / Signup</Button>
        )}
      </div>
    </header>
  );
};

export default Header; 