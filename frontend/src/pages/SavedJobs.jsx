import React from 'react';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
      <p className="text-sm text-gray-600 mb-4">Jobs you've saved for later.</p>
      <ul className="space-y-3">
        <li>
          <Link to="/jobs/1" className="text-green-600">Backend Engineer — View job</Link>
        </li>
      </ul>
    </div>
  );
};

export default SavedJobs;
