import React from 'react';
import { useParams } from 'react-router-dom';

const ApplicationDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      <p className="text-gray-700">Application ID: {id}</p>
      <p className="mt-4 text-sm text-gray-600">Full application details, interview status, messages, and attachments appear here.</p>
    </div>
  );
};

export default ApplicationDetails;
