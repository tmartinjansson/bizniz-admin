import "./globals.css";

import styles from "./layout.module.css";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

export const metadata = {
  title: "Bizniz Admin App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main-container">
          <Header />
          
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}