'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export const FEEDBACK_COOKIE_NAME = 'feedbackSubmitted';
const INTERACTION_THRESHOLD = 10;
const PAUSE_INTERVAL = 60 * 1000; // dont show banner for 60 secondes -> 120 minutes
const CHECK_INTERVAL = 10 * 1000; // check every 10 seconds -> 60seconds

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
  const [interactionScore, setInteractionScore] = useState<number>(0);
  const [firstVisit, setFirstVisit] = useState<number>(Date.now());
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(true);
  const [isBannerClosed, setIsBannerClosed] = useState<boolean>(false);

  // 📌 Hilfsfunktion: Cookie setzen
  const setFeedbackCookie = () => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 300 * 24 * 60 * 60 * 1000); // valid for 300 days
    document.cookie = `${FEEDBACK_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; domain=spiel-viel-tracker.vercel.app; Secure; SameSite=Lax`;
    document.cookie = `${FEEDBACK_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`; // Fallback für lokale Entwicklung
  };

  // 📌 Hilfsfunktion: Cookie auslesen
  const getFeedbackCookie = () => {
    const match = document.cookie.match(
      `(^|;)\\s*${FEEDBACK_COOKIE_NAME}\\s*=\\s*([^;]+)`,
    );
    const result = match ? match[2] === 'true' : false;
    return result;
  };

  // 📌 Initialisieren (LocalStorage & Cookie prüfen)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (getFeedbackCookie()) {
        setIsBannerClosed(true);
        return;
      }

      // LocalStorage prüfen
      const storedScore = localStorage.getItem('feedbackInteractionScore');
      const storedFirstVisit = localStorage.getItem('feedbackFirstVisit');

      setInteractionScore(storedScore ? parseInt(storedScore, 10) : 0);
      setFirstVisit(
        storedFirstVisit ? parseInt(storedFirstVisit, 10) : Date.now(),
      );

      // Banner vorerst nicht anzeigen
      setIsBannerHidden(true);
    }
  }, []);

  // 📌 Prüfe regelmäßig, ob der Banner angezeigt werden soll
  useEffect(() => {
    const checkBannerVisibility = () => {
      if (getFeedbackCookie()) {
        setIsBannerHidden(true);
        setIsBannerClosed(true);
        return;
      }
      const timePassed = Date.now() - firstVisit;
      const shouldShow =
        timePassed > PAUSE_INTERVAL ||
        interactionScore >= INTERACTION_THRESHOLD;
      setIsBannerHidden(!shouldShow);
      setIsBannerClosed(!shouldShow);
    };

    // Initiale Prüfung
    const initialTimer = setTimeout(() => {
      checkBannerVisibility();
    }, 500);

    // Regelmäßige Prüfung
    const interval = setInterval(() => {
      checkBannerVisibility();
    }, CHECK_INTERVAL);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [firstVisit, interactionScore, isBannerClosed]);

  // 📌 Funktion: Interaktion erhöhen
  const addInteraction = (points: number) => {
    if (getFeedbackCookie()) return 0;

    setInteractionScore((prev) => {
      const newScore = Math.min(prev + points, INTERACTION_THRESHOLD);
      if (typeof window !== 'undefined') {
        localStorage.setItem('feedbackInteractionScore', newScore.toString());
      }
      return newScore;
    });
  };

  // 📌 Funktion: Banner dauerhaft schließen
  const closeBannerPermanently = () => {
    setFeedbackCookie();
    setIsBannerClosed(true);
    setIsBannerHidden(true);
  };

  // 📌 Funktion: Banner dauerhaft schließen
  const hideBanner = () => {
    setIsBannerHidden(true);
  };

  // 📌 Funktion: Feedback-Timer zurücksetzen
  const resetFeedbackTimer = () => {
    const now = Date.now();
    setFirstVisit(now);
    setInteractionScore(0);
    setIsBannerHidden(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('feedbackInteractionScore', '0');
      localStorage.setItem('feedbackFirstVisit', now.toString());
    }
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
