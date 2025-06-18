import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  return (
    <div style={{ 
      padding: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>Sua Pontuação</h3>
      <p style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold',
        color: '#1976d2',
        margin: 0
      }}>
        {score} pts
      </p>
    </div>
  );
};

export default ScoreCard;