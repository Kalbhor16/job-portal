import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * useRecruiterHeader Hook
 * Integrates RecruiterHeader with AuthContext
 *
 * Usage:
 * const { recruiterName, companyName, notificationCount, handleLogout } = useRecruiterHeader();
 */
export const useRecruiterHeader = (notificationCount = 0) => {
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    recruiterName: user?.name || 'Recruiter',
    companyName: user?.companyName || 'Company',
    recruiterEmail: user?.email || '',
    notificationCount,
    handleLogout,
    user,
  };
};
