'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isWithinExtendedEvent } from '@lib/utils';
import { useSession } from 'next-auth/react';

export const FEEDBACK_COOKIE_NAME = 'feedbackSubmittedProd';
const INTERACTION_THRESHOLD = 10;
const PAUSE_INTERVAL = 120 * 60 * 1000; // 120 Minuten
const CHECK_INTERVAL = 60 * 1000; // 60 Sekunden

interface FeedbackContextProps {
  interactionScore: number;
  addInteraction: (points: number) => void;
  firstVisit: number;
  resetFeedbackTimer: () => void;
  isBannerHidden: boolean;
  hideBanner: () => void;
  isBannerClosed: boolean;
  closeBannerPermanently: () => void;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined,
);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';
  const [interactionScore, setInteractionScore] = useState<number>(0);
  const [firstVisit, setFirstVisit] = useState<number>(Date.now());
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(true);
  const [isBannerClosed, setIsBannerClosed] = useState<boolean>(false);

  // 📌 Hilfsfunktion: Cookie setzen
  const setFeedbackCookie = () => {
    // console.log('[Feedback] ✅ Cookie gesetzt');
    const expires = new Date();
    expires.setTime(expires.getTime() + 300 * 24 * 60 * 60 * 1000);
    document.cookie = `${FEEDBACK_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; domain=spiel-viel-tracker.vercel.app; Secure; SameSite=Lax`;
    document.cookie = `${FEEDBACK_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  };

  // 📌 Hilfsfunktion: Cookie auslesen
  const getFeedbackCookie = () => {
    const match = document.cookie.match(
      `(^|;)\\s*${FEEDBACK_COOKIE_NAME}\\s*=\\s*([^;]+)`,
    );
    const result = match ? match[2] === 'true' : false;
    // console.log(`[Feedback] 🍪 Cookie vorhanden? ${result}`);
    return result;
  };

  // 📌 Initialisieren (LocalStorage & Cookie prüfen)
  useEffect(() => {
    // console.log('[Feedback] 🔄 Initialisierung...');

    const shouldCloseBanner =
      getFeedbackCookie() ||
      !isWithinExtendedEvent({
        bufferDaysAfter: 14,
        allowDevOverrides: isAdmin,
      });

    if (shouldCloseBanner) {
      //  console.log(
      //   '[Feedback] ❌ Banner wird nicht gezeigt (Cookie existiert oder Zeitraum ungültig)',
      // );
      setIsBannerClosed(true);
      setIsBannerHidden(true);
      return;
    }

    // console.log('[Feedback] ✅ Banner darf grundsätzlich gezeigt werden');

    const storedScore = localStorage.getItem('feedbackInteractionScore');
    const storedFirstVisit = localStorage.getItem('feedbackFirstVisit');

    setInteractionScore(storedScore ? parseInt(storedScore, 10) : 0);
    setFirstVisit(
      storedFirstVisit ? parseInt(storedFirstVisit, 10) : Date.now(),
    );

    //  console.log(
    //   `[Feedback] 📊 Geladener Score: ${storedScore}, Erster Besuch: ${storedFirstVisit}`,
    // );
  }, [isAdmin]);

  // 📌 Prüfe regelmäßig, ob der Banner angezeigt werden soll
  useEffect(() => {
    if (isBannerClosed) {
      //  console.log(
      //   '[Feedback] ⛔ Banner ist geschlossen, keine weiteren Checks nötig.',
      // );
      return;
    }

    const checkBannerVisibility = () => {
      if (isBannerClosed) return;

      const timePassed = Date.now() - firstVisit;
      const shouldShow =
        timePassed > PAUSE_INTERVAL ||
        interactionScore >= INTERACTION_THRESHOLD;

      // console.log(
      //   `[Feedback] ⏳ Überprüfung: ${timePassed}ms vergangen, Score: ${interactionScore}, Zeige Banner? ${shouldShow}`,
      // );

      setIsBannerHidden(!shouldShow);
    };

    // console.log('[Feedback] 🔄 Starte Banner-Check Intervall...');
    const interval = setInterval(checkBannerVisibility, CHECK_INTERVAL);

    return () => {
      // console.log('[Feedback] ❌ Stoppe Banner-Check Intervall');
      clearInterval(interval);
    };
  }, [firstVisit, interactionScore, isBannerClosed]);

  // 📌 Funktion: Interaktion erhöhen
  const addInteraction = (points: number) => {
    if (getFeedbackCookie()) {
      // console.log(
      //   '[Feedback] ❌ Interaktion nicht gezählt, da Cookie existiert',
      // );
      return 0;
    }

    setInteractionScore((prev) => {
      const newScore = Math.min(prev + points, INTERACTION_THRESHOLD);
      // console.log(
      //   `[Feedback] ➕ Interaktion: +${points} (Neuer Score: ${newScore})`,
      // );

      if (typeof window !== 'undefined') {
        localStorage.setItem('feedbackInteractionScore', newScore.toString());
      }
      return newScore;
    });
  };

  // 📌 Funktion: Banner dauerhaft schließen
  const closeBannerPermanently = () => {
    // console.log('[Feedback] ❌ Banner dauerhaft geschlossen');
    setFeedbackCookie();
    setIsBannerClosed(true);
    setIsBannerHidden(true);
  };

  // 📌 Funktion: Banner vorübergehend schließen
  const hideBanner = () => {
    // console.log('[Feedback] 🔕 Banner vorübergehend geschlossen');
    setIsBannerHidden(true);
  };

  // 📌 Funktion: Feedback-Timer zurücksetzen
  const resetFeedbackTimer = () => {
    if (isBannerClosed) {
      // console.log(
      //   '[Feedback] ❌ Timer-Reset ignoriert (Banner ist geschlossen)',
      // );
      return;
    }

    const now = Date.now();
    // console.log('[Feedback] 🔄 Feedback-Timer zurückgesetzt');

    setFirstVisit(now);
    setInteractionScore(0);
    setIsBannerHidden(true);

    localStorage.setItem('feedbackInteractionScore', '0');
    localStorage.setItem('feedbackFirstVisit', now.toString());
  };

  return (
    <FeedbackContext.Provider
      value={{
        interactionScore,
        addInteraction,
        firstVisit,
        resetFeedbackTimer,
        isBannerHidden,
        hideBanner,
        isBannerClosed,
        closeBannerPermanently,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
