import React, { useState, useEffect } from 'react';
import RecruiterHeader from '../components/RecruiterHeader';

/**
 * RecruiterLayout Component
 * Wraps recruiter pages with header and consistent styling
 */
const RecruiterLayout = ({ children, notificationCount = 0 }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterHeader notificationCount={notificationCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default RecruiterLayout;
