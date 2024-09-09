'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SubscribeButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    console.log("Subscribe button clicked");
    try {
      setIsLoading(true);
      console.log("Fetching /api/stripe...");
      const response = await fetch('/api/stripe', {
        method: 'GET',
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      if (data.url) {
        console.log("Redirecting to Stripe:", data.url);
        window.location.href = data.url;
      } else {
        console.error("No Stripe URL returned");
      }
    } catch (error) {
      console.error('Error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:bg-blue-300"
    >
      {isLoading ? 'Loading...' : 'Subscribe Now'}
    </button>
  );
};

export default SubscribeButton;