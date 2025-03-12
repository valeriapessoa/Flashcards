import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  return (
    <div>
      <h2>Score Card</h2>
      <p>Your score will be displayed here.</p>
    </div>
  );
};

export default ScoreCard;