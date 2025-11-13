import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ExamCountdownProps {
  startTime: string;
  compact?: boolean;
}

const ExamCountdown = ({ startTime, compact = false }: ExamCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const examDate = new Date(startTime);
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();

      if (difference < 0) {
        setIsPast(true);
        setTimeLeft('Exam has started');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-xs ${isPast ? 'text-muted-foreground' : 'text-primary font-medium'}`}>
        <Clock className="h-3.5 w-3.5" />
        <span>{timeLeft}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isPast ? 'bg-muted' : 'bg-primary/10'}`}>
      <Clock className={`h-4 w-4 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Time until exam</span>
        <span className={`text-sm font-semibold ${isPast ? 'text-muted-foreground' : 'text-primary'}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default ExamCountdown;
