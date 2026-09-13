import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface CountdownTimerProps {
  targetDateIso?: string;
  onExpire?: () => void;
  className?: string;
  showIcon?: boolean;
  prefix?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateIso,
  onExpire,
  className = '',
  showIcon = true,
  prefix = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    isExpired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      if (!targetDateIso) {
        return { hours: 3, minutes: 30, seconds: 0, totalMs: 12600000, isExpired: false };
      }

      const target = new Date(targetDateIso).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        if (onExpire) onExpire();
        return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return { hours, minutes, seconds, totalMs: diff, isExpired: false };
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateIso, onExpire]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (timeLeft.isExpired) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-400 ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-slate-500" />}
        <span>Lockout Period Expired</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-bold ${className}`}>
      {showIcon && <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />}
      {prefix && <span>{prefix}</span>}
      <span className="tracking-wider">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </span>
  );
};
