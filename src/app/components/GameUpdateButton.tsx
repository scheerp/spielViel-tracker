"use client";

import { useSession, signOut } from "next-auth/react";

const GameUpdateButton = ({
  gameId,
  wasAvailable,
  text,
}: {
  gameId: number;
  wasAvailable: boolean;
  text: string;
}) => {
  const { data: session } = useSession();

  const handleUpdateGame = async () => {
    if (session) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/update_game/${gameId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ is_available: !wasAvailable }),
          }
        );

        if (response.ok) {
          alert("Spiel wurde erfolgreich aktualisiert.");
        } else {
          alert("Fehler beim Aktualisieren des Spiels.");
        }
      } catch (error) {
        console.error("Fehler beim Senden des PUT-Requests:", error);
      }
    }
  };

  return session ? (
    <>
      <button onClick={handleUpdateGame}>{text}</button>
      <button onClick={signOut}>logout</button>
    </>
  ) : null;
};

export default GameUpdateButton;
