import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ProfileHeader = ({
  name,
  title,
  image,
  completionPercentage,
  lastUpdated,
  onEditClick,
  isEditing,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-emerald-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{name}</h1>
            {title && <p className="text-emerald-100 text-lg font-semibold mb-3">{title}</p>}

            {/* Completion Status */}
            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-emerald-100 text-sm font-semibold">Profile Completion</p>
                  <span className="text-white font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-emerald-400 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {completionPercentage === 100 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-semibold">Complete</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-emerald-200" />
                    <span className="text-emerald-100 text-sm font-semibold">Incomplete</span>
                  </>
                )}
              </div>
            </div>

            {lastUpdated && (
              <p className="text-emerald-100 text-xs mt-3">
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={onEditClick}
            className={`px-6 py-2 rounded-lg font-semibold transition-all md:mt-0 ${
              isEditing
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white text-emerald-600 hover:shadow-lg'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
