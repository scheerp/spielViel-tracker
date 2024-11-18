"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-primary text-white">
      <nav className=" flex justify-between w-full">
        <Link href="/games">Alle Spiele</Link>
        {session && <p>Admin</p>}
      </nav>
    </header>
  );
};

export default Header;
