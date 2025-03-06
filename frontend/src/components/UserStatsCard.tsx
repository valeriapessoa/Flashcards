import React from 'react';
import ScoreCard from './ScoreCard';
import CorrectAnswersCard from './CorrectAnswersCard';

interface UserStatsCardProps {
  stats: {
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalReviews: number;
  };
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats }) => {
  const { score, correctAnswers, incorrectAnswers, totalReviews } = stats;
  return (
    <div className="user-stats-card">
      <ScoreCard score={score} />
      <CorrectAnswersCard correctAnswers={correctAnswers} />
    </div>
  );
};

export default UserStatsCard;