import { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

const CustomQuestionBuilder = ({ question, index, onChange, onRemove }) => {
  const [showOptions, setShowOptions] = useState(question.type === 'multiple-choice');

  const handleQuestionChange = (field, value) => {
    onChange({
      ...question,
      [field]: value,
    });
    if (field === 'type' && value === 'multiple-choice') {
      setShowOptions(true);
    } else if (field === 'type') {
      setShowOptions(false);
    }
  };

  const handleAddOption = () => {
    onChange({
      ...question,
      options: [...question.options, ''],
    });
  };

  const handleRemoveOption = (optionIndex) => {
    onChange({
      ...question,
      options: question.options.filter((_, i) => i !== optionIndex),
    });
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange({
      ...question,
      options: newOptions,
    });
  };

  return (
    <div className="p-4 border-2 border-green-200 rounded-lg bg-white hover:border-green-400 transition-colors">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Question {index + 1}
          </label>
          <textarea
            value={question.questionText}
            onChange={(e) => handleQuestionChange('questionText', e.target.value)}
            placeholder="Enter your screening question"
            rows="2"
            className="w-full px-3 py-2 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all resize-none bg-white"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Question Type & Required Toggle */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => handleQuestionChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all bg-white"
          >
            <option value="text">Short Text</option>
            <option value="textarea">Long Text</option>
            <option value="yes/no">Yes/No</option>
            <option value="multiple-choice">Multiple Choice</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 mt-8 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => handleQuestionChange('required', e.target.checked)}
              className="w-4 h-4 rounded text-green-600 accent-green-600"
            />
            <span className="text-sm font-medium text-gray-900">
              Required Question
            </span>
          </label>
        </div>
      </div>

      {/* Multiple Choice Options */}
      {question.type === 'multiple-choice' && (
        <div className="bg-green-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Options
          </label>
          <div className="space-y-2 mb-3">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="flex-1 px-3 py-2 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(optionIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomQuestionBuilder;
