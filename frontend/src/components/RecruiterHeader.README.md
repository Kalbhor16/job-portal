# RecruiterHeader Component - JSX Version

## 📦 Quick Overview

A professional, responsive header component for the Recruiter Module of your Job Portal. Built with React JSX, TailwindCSS, and matches your existing project theme.

## 🎨 Features

✅ **Fully Responsive** - Mobile, tablet, and desktop  
✅ **Green Theme** - Matches your JobHub design  
✅ **Mobile Menu** - Hamburger menu for small screens  
✅ **Profile Dropdown** - User profile and logout  
✅ **Notifications** - Badge counter for notifications  
✅ **Active Route Highlighting** - Highlights current page  
✅ **Sticky Header** - Stays at top while scrolling  
✅ **Auth Integration** - Works with your AuthContext  
✅ **Emoji Icons** - Clean, modern look  
✅ **Smooth Animations** - Professional feel  

## 📁 Files Created

1. **RecruiterHeader.jsx** - Main component
2. **RecruiterLayout.jsx** - Layout wrapper component
3. **useRecruiterHeader.js** - Custom hook for integration
4. **RecruiterHeader.INTEGRATION.jsx** - Integration examples

## 🚀 Quick Start

### Step 1: Use in Your Routes

```jsx
import RecruiterLayout from './layouts/RecruiterLayout';
import RecruiterDashboard from './pages/RecruiterDashboard';

<Route
  path="/recruiter/dashboard"
  element={
    <RecruiterLayout notificationCount={5}>
      <RecruiterDashboard />
    </RecruiterLayout>
  }
/>
```

### Step 2: Or Use Just the Header

```jsx
import RecruiterHeader from './components/RecruiterHeader';

function MyPage() {
  return (
    <div>
      <RecruiterHeader notificationCount={3} />
      {/* Your content */}
    </div>
  );
}
```

## 📋 Navigation Links

The header includes these routes:
- 📊 Dashboard → `/recruiter/dashboard`
- ✍️ Post Job → `/recruiter/post-job`
- 💼 My Jobs → `/recruiter/jobs`
- 👥 Applicants → `/recruiter/applicants`
- 💬 Messages → `/recruiter/messages`
- 🏢 Company → `/recruiter/company-profile`

## 🎯 Props

```jsx
<RecruiterHeader
  notificationCount={5}  // Optional: Number of notifications
/>
```

## 🎨 Styling

- **Colors**: Green (#22c55e) and Emerald (#10b981) - matches your theme
- **Responsive**: Hidden links on mobile, hamburger menu shown
- **Desktop**: Full navigation visible on lg screens and up
- **Mobile**: Compact header with dropdown menu

## 🔧 Customization

### Add More Navigation Items

Edit `RecruiterHeader.jsx`, find `navigationItems` array:

```jsx
const navigationItems = [
  { label: 'New Page', href: '/recruiter/new-page', icon: '🆕' },
  // ... more items
];
```

### Change Colors

Replace all instances of:
- `green-600` with your color
- `emerald-600` with your accent color
- `green-50` with your light shade

### Modify Notifications

```jsx
<RecruiterLayout notificationCount={10}>
  {/* Your content */}
</RecruiterLayout>
```

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Header with hamburger menu
- **Tablet** (768px - 1024px): Partial navigation visible
- **Desktop** (> 1024px): Full navigation visible

## 🔐 Auth Integration

The component automatically integrates with your `AuthContext`:
- Shows recruiter name
- Shows company name
- Handles logout
- Uses authenticated user data

```jsx
const { user, logout } = useAuth();
// Header uses this automatically
```

## 🎬 Animations

- Smooth transitions on hover
- Dropdown fade-in animation
- Mobile menu slide animation
- Hover color changes

## ✨ Profile Dropdown Features

- **Desktop**: Click avatar to open dropdown
- **Mobile**: Integrated in mobile menu
- **Shows**: Name, email, company
- **Actions**: View company profile, logout

## 🔔 Notifications

- **Badge**: Shows count (9+ for > 9)
- **Hidden**: When count is 0
- **Position**: Top-right of bell icon

## 📱 Mobile Menu

- **Hamburger Icon**: Opens/closes menu
- **Auto Close**: Closes when navigating
- **Profile Section**: Shows user info and logout

## 🎯 Common Tasks

### Show Different Notification Count

```jsx
const [notifications, setNotifications] = useState(0);

useEffect(() => {
  // Fetch from API
  fetch('/api/notifications')
    .then(r => r.json())
    .then(data => setNotifications(data.count));
}, []);

return <RecruiterLayout notificationCount={notifications} />;
```

### Update User Name Dynamically

The component automatically shows the current user name from AuthContext:

```jsx
// Your AuthContext handles this
const { user } = useAuth();
// Header displays user.name automatically
```

### Add Real-Time Updates

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    // Fetch updated notification count
    setNotificationCount(newCount);
  }, 30000); // Poll every 30 seconds

  return () => clearInterval(interval);
}, []);
```

## 🐛 Troubleshooting

### Header Not Showing User Name

Make sure AuthContext is properly configured and user data is set:

```jsx
const { user } = useAuth();
// Check if user object has 'name' property
```

### Navigation Links Not Working

Verify routes match the paths in `navigationItems`:
- `/recruiter/dashboard`
- `/recruiter/post-job`
- `/recruiter/jobs`
- `/recruiter/applicants`
- `/recruiter/messages`
- `/recruiter/company-profile`

### Colors Not Applying

Ensure TailwindCSS is properly configured in your project.

### Mobile Menu Not Responding

Check browser console for errors. Verify state management is working.

## 🚀 Production Tips

1. Test on real mobile devices
2. Verify all navigation links work
3. Test dropdown functionality
4. Check notification badge displays correctly
5. Verify logout works properly
6. Test with real user data
7. Check for console errors
8. Test on different browsers

## 📚 Related Files

- `RecruiterHeader.jsx` - Main component
- `RecruiterLayout.jsx` - Layout wrapper
- `useRecruiterHeader.js` - Hook for integration
- `RecruiterHeader.INTEGRATION.jsx` - Example implementations

## 💡 Tips

- Use `RecruiterLayout` as a wrapper for consistent styling
- Pass `notificationCount` from your API
- Customize emoji icons to match your brand
- The header automatically updates user info from AuthContext
- Mobile menu automatically closes when navigating

## 🎉 You're All Set!

Your RecruiterHeader is ready to use. Start by wrapping your recruiter pages with `RecruiterLayout` or add the header directly to your components.

Happy coding! 🚀
