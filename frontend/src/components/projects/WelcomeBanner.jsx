import React, { useEffect, useState } from "react";
import { getProjectBatches } from "../../services/projectService";

// Simple countdown timer component
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft || Object.keys(timeLeft).length === 0) {
    return <span className="text-green-400">Submission window open!</span>;
  }

  const { hours, minutes, seconds } = timeLeft;
  return (
    <span className="text-sm font-mono text-indigo-200">
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
};

const WelcomeBanner = () => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getProjectBatches();
        const list = Array.isArray(res) ? res : res?.data || [];
        if (list.length > 0) {
          const upcoming = list.find((b) => new Date(b.submissionStart) > new Date()) || list[0];
          setBatch(upcoming);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    );
  }

  if (!batch) {
    return null;
  }

  const now = new Date();
  const submissionStart = new Date(batch.submissionStart);
  const submissionEnd = new Date(batch.submissionEnd);
  const isBeforeStart = now < submissionStart;
  const isDuring = now >= submissionStart && now <= submissionEnd;

  return (
    <section className="mb-6 p-6 bg-gradient-to-r from-indigo-900 to-slate-800 rounded-xl shadow-xl backdrop-blur-sm border border-indigo-600">
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to the {batch.name}!</h2>
      <p className="text-indigo-200 mb-4">
        Academic Year: {batch.academicYear} | Semester: {batch.semester}
      </p>
      {isBeforeStart && (
        <div className="flex items-center space-x-2 text-indigo-100">
          <span>Submission starts in:</span>
          <CountdownTimer targetDate={submissionStart} />
        </div>
      )}
      {isDuring && (
        <div className="flex items-center space-x-2 text-green-300">
          <span>Submission ends in:</span>
          <CountdownTimer targetDate={submissionEnd} />
        </div>
      )}
      {!isBeforeStart && !isDuring && (
        <div className="text-red-400">Submission window closed.</div>
      )}
    </section>
  );
};

export default WelcomeBanner;
