import React from 'react';
import styles from './CorrectAnswersCard.module.css';

interface CorrectAnswersCardProps {
  correctAnswers: number;
  totalQuestions: number;
}

const CorrectAnswersCard: React.FC<CorrectAnswersCardProps> = ({ correctAnswers, totalQuestions }) => {
  return (
    <div className={styles['correct-answers-card']}>
      <h2>Respostas Corretas</h2>
      <p>{correctAnswers} / {totalQuestions}</p>
    </div>
  );
};

export default CorrectAnswersCard;