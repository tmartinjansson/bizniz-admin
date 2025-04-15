"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  
  // Function to check if a link is active
  const isActive = (href) => {
    return pathname === href ? styles.activeLink : "";
  };
  
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Bizniz Admin</h1>
      
      <div className={styles.navContainer}>
        <ul className={styles.navLinks}>
          <li><Link href="/" className={isActive("/")}>Main</Link></li>
          <li><Link href="/create-company" className={isActive("/create-company")}>Create New Company</Link></li>
          <li><Link href="/manage-company" className={isActive("/manage-company")}>Manage Company Data</Link></li>
          <li><Link href="/create-employee" className={isActive("/create-employee")}>Create Employee</Link></li>
          <li><Link href="/manage-employee" className={isActive("/manage-employee")}>Manage Employee Data</Link></li>
        </ul>
      </div>
    </header>
  );
}