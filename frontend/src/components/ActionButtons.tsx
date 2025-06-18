import React from 'react';

interface ActionButtonsProps {
  isLoading: boolean;
  onSave: () => void;
  onBack: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isLoading, onSave, onBack }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Voltar
      </button>
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg ${
          isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
        disabled={isLoading}
        onClick={onSave}
      >
        {isLoading ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
};

export default ActionButtons;
