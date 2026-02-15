# RecruiterHeader Component Documentation

## Overview

`RecruiterHeader` is a professional, production-ready React TypeScript component designed for the Recruiter Module of a Job Portal application. It provides a sticky, responsive header with navigation, notifications, and profile management.

---

## Features ✨

### Core Features
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Role-Based Access** - Built specifically for recruiters
- ✅ **Dark Mode Support** - Toggle between light and dark themes
- ✅ **Active Route Highlighting** - Shows current page in navigation
- ✅ **Mobile Hamburger Menu** - Collapsible navigation for small screens
- ✅ **Notification Badge** - Real-time notification counter with badge
- ✅ **Profile Dropdown** - Quick access to profile and logout
- ✅ **Sticky Positioning** - Stays at top while scrolling
- ✅ **Accessible** - WCAG 2.1 compliant with proper ARIA labels
- ✅ **TypeScript** - Full type safety with proper interfaces

### Navigation Links Included
1. **Dashboard** - Recruiter dashboard overview
2. **Company Profile** - Manage company information
3. **Post Job** - Create new job postings
4. **Manage Jobs** - View and edit job listings
5. **Applicants** - Global applicants overview
6. **Messages** - Communicate with applicants

---

## Installation

The component is already created at:
```
frontend/src/components/RecruiterHeader.tsx
```

### Dependencies
Make sure you have these installed:
```bash
npm install react react-router-dom lucide-react
npm install -D tailwindcss typescript @types/react
```

---

## Props

### RecruiterHeaderProps

```typescript
interface RecruiterHeaderProps {
  // Notification count to display
  notificationCount?: number;
  
  // Name of the recruiter
  recruiterName?: string;
  
  // Company name
  companyName?: string;
  
  // Company logo (emoji or image URL)
  companyLogo?: string;
  
  // Callback function when user logs out
  onLogout?: () => void;
  
  // Enable dark mode
  isDarkMode?: boolean;
}
```

---

## Usage Examples

### Basic Usage
```tsx
import RecruiterHeader from './components/RecruiterHeader';

function RecruiterLayout() {
  return (
    <div>
      <RecruiterHeader />
      {/* Page content */}
    </div>
  );
}
```

### With Auth Context Integration
```tsx
import RecruiterHeader from './components/RecruiterHeader';
import { useAuth } from './context/AuthContext';

function RecruiterLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <RecruiterHeader
        recruiterName={user?.name}
        companyName={user?.companyName}
        onLogout={logout}
      />
      {/* Page content */}
    </div>
  );
}
```

### With Notifications
```tsx
import { useState, useEffect } from 'react';
import RecruiterHeader from './components/RecruiterHeader';
import { useAuth } from './context/AuthContext';

function RecruiterLayout() {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch notifications from your API
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications/count');
      const data = await response.json();
      setNotificationCount(data.count);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <RecruiterHeader
        recruiterName={user?.name}
        companyName={user?.companyName}
        notificationCount={notificationCount}
        onLogout={logout}
      />
      {/* Page content */}
    </div>
  );
}
```

### With Dark Mode
```tsx
import { useState } from 'react';
import RecruiterHeader from './components/RecruiterHeader';

function RecruiterLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <RecruiterHeader isDarkMode={isDarkMode} />
      {/* Page content */}
    </div>
  );
}
```

### Using the Custom Hook
```tsx
import RecruiterHeader from './components/RecruiterHeader';
import { useRecruiterHeader } from './hooks/useRecruiterHeader';

function RecruiterLayout() {
  const { recruiterName, companyName, notificationCount, handleLogout } =
    useRecruiterHeader();

  return (
    <div>
      <RecruiterHeader
        recruiterName={recruiterName}
        companyName={companyName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />
      {/* Page content */}
    </div>
  );
}
```

---

## Component Structure

### Header Sections

#### 1. Left Section - Logo & Branding
- Company logo (emoji or icon)
- "Job Portal" branding
- "Recruiter" subtitle
- Links to dashboard when clicked

#### 2. Center Section - Navigation (Desktop Only)
- Dashboard
- Company Profile
- Post Job
- Manage Jobs
- Applicants
- Messages
- Active links are highlighted in blue
- Hover effects on all links

#### 3. Right Section - Actions
- **Notification Bell** with badge counter
- **Profile Dropdown** (desktop)
  - Recruiter name and company
  - View Company Profile link
  - Logout button
- **Mobile Menu** toggle (hamburger icon)

#### 4. Mobile Menu
- Full navigation links
- Profile section
- Logout option
- Closes when navigating

---

## Styling

### Color Scheme

#### Light Mode
- Background: White (`bg-white`)
- Text: Dark gray/gray-900
- Accent: Blue-600 for active links
- Borders: Light gray-200

#### Dark Mode
- Background: Gray-900 (`bg-gray-900`)
- Text: White
- Accent: Blue-600 for active links
- Borders: Gray-800

### Responsive Breakpoints
- **Mobile** (`< 768px`): Hamburger menu, collapsed view
- **Tablet** (`768px - 1024px`): Transitional layout
- **Desktop** (`> 1024px`): Full navigation visible

---

## Accessibility Features

### ARIA Labels
- `role="banner"` on header element
- `aria-label` on buttons
- `aria-expanded` on dropdown toggles
- `aria-haspopup="true"` on menu buttons
- `aria-current="page"` on active navigation links
- `role="menu"` on dropdown menus

### Keyboard Navigation
- Tab to navigate through interactive elements
- Enter to activate buttons and links
- Escape to close dropdowns (via click-outside logic)
- Focus rings visible on interactive elements

### Screen Reader Support
- Notification count announced clearly
- Navigation structure properly labeled
- Button purposes described in labels

---

## Customization

### Changing Colors
Edit the color classes in the component:
```tsx
// Change primary blue to another color
// Replace text-blue-600 with your color
// Replace bg-blue-50 with your color
// Replace focus:ring-blue-500 with your color
```

### Adding More Navigation Items
Modify the `navigationItems` array:
```tsx
const navigationItems: NavigationItem[] = [
  {
    label: 'New Page',
    href: '/recruiter/new-page',
    icon: <YourIcon className="w-4 h-4" />,
  },
  // ... other items
];
```

### Custom Logo
Pass a different logo URL or component:
```tsx
<RecruiterHeader companyLogo="https://your-company-logo.png" />
```

---

## Integration with Your Project

### 1. Update AuthContext Hook
Update `useRecruiterHeader.ts` to use your actual AuthContext:

```tsx
import { useAuth } from './context/AuthContext';

export const useRecruiterHeader = () => {
  const { user, logout } = useAuth();
  // ... rest of implementation
};
```

### 2. Add Notification Fetching
Add your API calls for notifications:

```tsx
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications/count');
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  fetchNotifications();
}, []);
```

### 3. Setup Real-time Updates
Connect to WebSocket or polling for live notifications:

```tsx
useEffect(() => {
  const socket = io('http://your-server');
  
  socket.on('new-notification', () => {
    setNotificationCount(prev => prev + 1);
  });

  return () => socket.disconnect();
}, []);
```

---

## API Endpoints Expected

The component doesn't make API calls directly but expects these endpoints to be available in your backend:

- `GET /api/notifications/count` - Get unread notification count
- `GET /api/user/profile` - Get recruiter profile (optional)
- `POST /api/auth/logout` - Logout endpoint

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## Performance

- Uses React hooks efficiently
- Minimal re-renders with proper optimization
- Smooth animations with CSS transitions
- Lightweight with lucide-react icons

---

## TypeScript

The component is fully typed with proper interfaces:
- `RecruiterHeaderProps` - Component props
- `NavigationItem` - Navigation structure
- `AuthContextType` - Expected auth context shape

---

## Troubleshooting

### Dropdown not closing on mobile
- Click outside the dropdown to close it
- Navigation automatically closes when you navigate

### Colors not applying
- Ensure TailwindCSS is configured in your project
- Check that your `tailwind.config.js` includes the correct paths

### Navigation not highlighting
- Verify React Router is properly set up
- Ensure route paths match exactly with `href` values

### Notifications not updating
- Implement the notification fetching in `useRecruiterHeader`
- Set up WebSocket connection for real-time updates

---

## Files Created

1. **RecruiterHeader.tsx** - Main component
2. **useRecruiterHeader.ts** - Custom hook for integration
3. **RecruiterHeader.integration.example.tsx** - Integration examples
4. **RecruiterHeader.md** - This documentation

---

## Next Steps

1. Update `useRecruiterHeader.ts` with your AuthContext
2. Add notification fetching logic
3. Integrate with your router configuration
4. Customize colors and branding as needed
5. Test on mobile devices
6. Add real-time notification updates

---

## Support & Issues

For issues or questions:
1. Check the integration examples
2. Verify all dependencies are installed
3. Ensure TailwindCSS is properly configured
4. Check browser console for error messages

---

## License

This component is part of your Job Portal project. Use it freely within your application.
