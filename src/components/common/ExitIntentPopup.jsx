import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('exitIntentShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e) => {
      // Only trigger if mouse leaves from top of page (likely closing tab/window)
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const closePopup = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-scaleIn">
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          {/* Icon */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-10 w-10 text-blue-600" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Wait! Don't Miss Out
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-6">
            Get <span className="text-blue-600 font-bold">20% OFF</span> your first 3 months
          </p>

          {/* Offer Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Limited Time Offer</span>
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>20% discount on any plan for 3 months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>14-day free trial (no credit card required)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Free onboarding and training session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Priority support for first 30 days</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link to="/login" onClick={closePopup}>
              <Button variant="primary" className="w-full text-lg py-3">
                Get Started Now <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <button
              onClick={closePopup}
              className="w-full text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>

          {/* Trust Badge */}
          <p className="text-xs text-gray-500 mt-4">
            Join 500+ businesses already saving with MAX2PAY
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
