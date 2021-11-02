import React from 'react';

function Footer(props) {
  return (
    <footer className="footer__page">
      <div className="container">
        <p className="m-0">جميع الحقوق محفوظة &copy; {new Date().getUTCFullYear()}</p>
      </div>
    </footer>
  );
}

export default Footer;