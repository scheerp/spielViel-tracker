'use client';

import { useNotification } from '@context/NotificationContext';
import { useFeedback } from '../context/FeedbackContext';
import PrimaryButton from './PrimaryButton';

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
    <div className="bg-backgroundDark2 fixed bottom-0 z-50 flex w-full flex-col items-center justify-center rounded-t-xl border-[3px] border-foreground p-8 text-center shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
      <span className="text-lg font-semibold">
        Möchtest du uns helfen die SpielViel noch schöner zu machen?
      </span>
      <div className="mb-4 flex justify-center gap-4">
        <PrimaryButton onClick={handleFeedbackClick}>
          Feedback geben
        </PrimaryButton>
        <button
          className="shadow-darkBottom mt-10 rounded-lg border-[3px] border-foreground bg-background px-3.5 py-2.5 font-semibold text-gray-500 hover:text-gray-800"
          onClick={handleLater}
        >
          Später
        </button>
      </div>
    </div>
  );
};

export default FeedbackBanner;
