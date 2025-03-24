import Footer from "./Footer";
import Header from "./Header";

// components/ConditionalLayout.js
export default function ConditionalLayout({ children, showHeaderFooter = true }) {
    return (
      <>
        {showHeaderFooter && <Header />}
        {children}
        {showHeaderFooter && <Footer />}
      </>
    );
  }