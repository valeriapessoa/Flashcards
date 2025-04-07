import React from 'react';
import { ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40, color = "#4A90E2" }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ClipLoader size={size} color={color} />
      <p className="text-gray-600 mt-2">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;