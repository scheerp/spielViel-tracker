'use client';

import FacebookIcon from '@icons/FacebookIcon';
import InstagramIcon from '@icons/InstagramIcon';
import PoweredByBGGIcon from '@icons/PoweredByBGGIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bottom-0 mt-4 w-full bg-foregroundDark [font-stretch:125%]">
      <div className="flex flex-col items-center justify-center gap-4 py-6 text-lg font-semibold text-backgroundDark2 lg:flex-row lg:gap-16">
        <a
          href="https://spielviel.net/contact-us/"
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 text-backgroundDark2 hover:text-primary lg:my-0"
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
          className="my-4 text-backgroundDark2 hover:text-primary lg:my-0"
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
          className="my-4 text-backgroundDark2 hover:text-primary lg:my-0"
        >
          <span className="text-backgroundDark2 hover:text-primary">
            Impressum
          </span>
          <span className="ml-2 text-primary">➜</span>
        </a>
      </div>
      <div className="text-md flex flex-col items-center justify-center bg-foregroundDark2 py-6 font-semibold text-backgroundDark">
        <span className="mb-4 font-medium text-backgroundDark">
          Folge uns auf Social Media
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/spielviel_we"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground bg-backgroundDark shadow-darkBottom"
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
            className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-foreground bg-backgroundDark shadow-darkBottom"
          >
            <FacebookIcon tailwindColor="text-foreground" className="h-8 w-8" />
          </a>
        </div>
        <a
          href="https://boardgamegeek.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-12 w-48 items-center justify-center rounded-xl border-[3px] border-foreground bg-backgroundDark shadow-darkBottom"
        >
          <PoweredByBGGIcon className="h-[39px] w-[171px]" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
