import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 6);
    targetDate.setHours(12, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (86400000)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (3600000)) / (1000 * 60)),
        seconds: Math.floor((difference % (60000)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      <div className="bg-white rounded-lg p-3 min-w-[70px] shadow">
        <div className="text-3xl md:text-4xl font-bold text-primary">{timeLeft.days}</div>
        <div className="text-sm text-gray-600">Days</div>
      </div>
      <div className="bg-white rounded-lg p-3 min-w-[70px] shadow">
        <div className="text-3xl md:text-4xl font-bold text-primary">{timeLeft.hours}</div>
        <div className="text-sm text-gray-600">Hours</div>
      </div>
      <div className="bg-white rounded-lg p-3 min-w-[70px] shadow">
        <div className="text-3xl md:text-4xl font-bold text-primary">{timeLeft.minutes}</div>
        <div className="text-sm text-gray-600">Minutes</div>
      </div>
      <div className="bg-white rounded-lg p-3 min-w-[70px] shadow">
        <div className="text-3xl md:text-4xl font-bold text-primary">{timeLeft.seconds}</div>
        <div className="text-sm text-gray-600">Seconds</div>
      </div>
    </div>
  );
}