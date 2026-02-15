import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const SkillsInput = ({ skills, onAddSkill, onRemoveSkill }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddSkill(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., React, Node.js, TypeScript"
          className="flex-1 px-4 py-2 border border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all bg-white"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium shadow-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(index)}
                className="hover:bg-green-200 p-1 rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {skills.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No skills added yet. Enter a skill and click "Add" or press Enter.
        </p>
      )}

      {/* Character Info */}
      <p className="text-xs text-gray-500">
        Total skills: {skills.length} • Press Enter or click Add to add a skill
      </p>
    </div>
  );
};

export default SkillsInput;
