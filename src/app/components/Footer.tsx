'use client';

const Footer: React.FC = () => {
  return (
    <footer className="bottom-0 mt-4 w-full bg-[#c1c1c1] py-6 text-white">
      <div className="container flex w-full items-center justify-center gap-2">
        <a
          href="https://spielviel.net/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Kontakt
        </a>
        <span>|</span>
        <a
          href="https://spielviel.net/impressum-dsgvo/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Datenschutz/Impressum
        </a>
      </div>
    </footer>
  );
};

export default Footer;
