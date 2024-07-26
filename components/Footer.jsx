import React from 'react';
import Image from 'next/image';
import logo from '../public/assets/images/logo.png'; // Adjust the path according to your project structure

const Footer = () => {
  return (
<footer class="footer bg-neutral text-neutral-content p-10">

  <aside>
  <Image
          src={logo}
          alt="Logo"
          width={120} // Adjust the size as needed
          height={120}
          className="h-auto w-auto"
        />
    <p>
      Your Email Extractor
      <br />
      Extract Emails From Website
    </p>
  </aside>
  <nav>
    <h6 class="footer-title">Index</h6>
    <a class="link link-hover" href='emails-retrieved'>Emails Retrieved</a>
  </nav>

</footer>
  );
};

export default Footer;
