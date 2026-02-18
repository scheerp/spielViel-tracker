'use client';

import FacebookIcon from '@icons/FacebookIcon';
import InstagramIcon from '@icons/InstagramIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foregroundDark bottom-0 mt-4 w-full [font-stretch:125%]">
      <div className="text-backgroundDark2 flex flex-col items-center justify-center gap-4 py-6 text-lg font-semibold lg:flex-row lg:gap-16">
        <a
          href="https://spielviel.net/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-backgroundDark2 my-4 hover:text-primary lg:my-0"
        >
          <span className="text-backgroundDark2 hover:text-primary">
            Kontakt
          </span>
          <span className="ml-2 text-primary hover:translate-x-12">➜</span>
        </a>
        <a
          href="https://www.spielviel.net/datenschutz/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-backgroundDark2 my-4 hover:text-primary lg:my-0"
        >
          <span className="text-backgroundDark2 hover:text-primary">
            Datenschutz
          </span>
          <span className="ml-2 text-primary">➜</span>
        </a>

        <a
          href="https://www.spielviel.net/impressum/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-backgroundDark2 my-4 hover:text-primary lg:my-0"
        >
          <span className="text-backgroundDark2 hover:text-primary">
            Impressum
          </span>
          <span className="ml-2 text-primary">➜</span>
        </a>
      </div>
      <div className="bg-foregroundDark2 text-md flex flex-col items-center justify-center py-6 font-semibold text-backgroundDark">
        <span className="mb-4 font-medium text-backgroundDark">
          Folge uns auf Social Media
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/spielviel_we"
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-darkBottom flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground bg-backgroundDark"
          >
            <InstagramIcon
              tailwindColor="text-foreground"
              className="h-8 w-8"
            />
          </a>
          <a
            href="https://www.facebook.com/spielvielwe"
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-darkBottom flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground bg-backgroundDark"
          >
            <FacebookIcon tailwindColor="text-foreground" className="h-8 w-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
