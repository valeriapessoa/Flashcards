import React from "react";
import styles from "./CorrectAnswersCard.module.css";

interface CorrectAnswersCardProps {
  correctAnswers: number;
  totalQuestions: number;
}

const CorrectAnswersCard: React.FC<CorrectAnswersCardProps> = ({ correctAnswers, totalQuestions }) => {
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className={styles.card}>
      <h3>Respostas Corretas</h3>
      <p>
        {correctAnswers} de {totalQuestions} ({percentage}%)
      </p>
    </div>
  );
};

export default CorrectAnswersCard;
