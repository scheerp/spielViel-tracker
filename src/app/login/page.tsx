"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/games");
    }
  }, [session, router]); // Abhängigkeiten hinzufügen

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          name="username"
          type="text"
          placeholder="Benutzername"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Anmelden..." : "Anmelden"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
