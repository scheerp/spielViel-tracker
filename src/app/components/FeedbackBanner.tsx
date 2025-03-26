'use client';

import { useNotification } from '@context/NotificationContext';
import { useFeedback } from '../context/FeedbackContext';

export const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdJH96Ilyv2DnbJOkcCWa6KwosnRF2v0OIVJfPpy4fodResUQ/viewform?usp=sharing';

const FeedbackBanner: React.FC = () => {
  const { isBannerHidden, isBannerClosed, resetFeedbackTimer, hideBanner } =
    useFeedback();
  const { showNotification } = useNotification();

  // Banner ist dauerhaft geschlossen → zeige es nie wieder an
  if (isBannerClosed) return null;

  // Banner ist noch nicht sichtbar (weil Kriterien nicht erfüllt) → noch nicht anzeigen
  if (isBannerHidden) return null;

  const handleFeedbackClick = () => {
    window.open(FEEDBACK_FORM_URL, '_blank');
    hideBanner();
  };

  const handleLater = () => {
    resetFeedbackTimer();
    showNotification({
      message: (
        <p>
          Wir melden und Später wieder!
          <br />
          Du findest den Feedback-Link auch im Menü!
        </p>
      ),
      type: 'status',
      duration: 5000,
    });
  };

  return (
    <div className="fixed bottom-0 z-50 flex w-full flex-col items-center justify-center bg-white p-8 text-center shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
      <span className="mb-6 text-lg">
        Möchtest du uns helfen die SpielViel noch schöner zu machen?
      </span>
      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={handleFeedbackClick}
          className={`btn rounded-full bg-primary px-4 py-2.5 font-bold text-white shadow-md`}
        >
          Feedback geben
        </button>
        <button
          className="rounded-full bg-background px-3.5 py-2.5 font-bold text-gray-500 shadow-md hover:text-gray-800"
          onClick={handleLater}
        >
          Später
        </button>
      </div>
    </div>
  );
};

export default FeedbackBanner;
