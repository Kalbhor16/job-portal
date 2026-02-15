# Company Profile & Recruiter Profile System - Complete Documentation

## Overview
A fully responsive, production-ready profile management system for recruiters in the Job Portal project. Includes recruiter personal profiles and company profiles with image uploads, validation, and profile completion tracking.

---

## 🎯 Features Implemented

### Recruiter Profile Features:
✅ Edit personal recruiter information
✅ Profile photo upload with preview
✅ Designation selection (HR Manager, CEO, etc.)
✅ LinkedIn profile link
✅ Bio/Summary (max 500 characters)
✅ Profile completion percentage tracking
✅ Form validation with error messages
✅ Last updated timestamp
✅ Mobile responsive design
✅ Edit/View toggle mode

### Company Profile Features:
✅ Company information management
✅ Company logo upload with preview
✅ Multiple company size options
✅ Founded year tracking
✅ Website and social media links
✅ Company description (max 2000 characters)
✅ Social links (LinkedIn, Twitter, Facebook)
✅ No company profile state handling
✅ Profile completion percentage
✅ Mobile first design
✅ Create/Edit company profile

---

## 📁 Backend Structure

### Models Created:

#### 1. **RecruiterProfile.js**
```
Location: /backend/models/RecruiterProfile.js

Fields:
- userId (Reference to User)
- fullName (Required)
- email (Required, read-only)
- phone
- profilePhoto (URL)
- designation (Enum)
- companyId (Reference to Company)
- bio (max 500 chars)
- linkedinLink (URL)
- profileCompletionPercentage (auto-calculated)
- timestamps
```

#### 2. **Company.js**
```
Location: /backend/models/Company.js

Fields:
- companyName (Required)
- companyLogo (URL)
- industry
- companySize (Enum: 1-10, 11-50, 51-200, 201-500, 500+)
- foundedYear
- website (URL)
- location (Required)
- aboutCompany (max 2000 chars)
- socialLinks (linkedin, twitter, facebook)
- recruiterId (Reference to User)
- profileCompletionPercentage (auto-calculated)
- timestamps
```

### Controllers Created:

**File:** `/backend/controllers/profileController.js`

**Functions:**
1. `getRecruiterProfile()` - GET /api/recruiter/profile
2. `updateRecruiterProfile()` - PUT /api/recruiter/profile
3. `getCompanyProfile()` - GET /api/recruiter/company-profile
4. `createCompanyProfile()` - POST /api/recruiter/company-profile
5. `updateCompanyProfile()` - PUT /api/recruiter/company-profile

**Features:**
- Input validation
- URL validation for social links
- Image file validation (type & size)
- Auto-profile creation if not exists
- Error handling with proper HTTP status codes
- FormData support for file uploads

### Routes Created:

**File:** `/backend/routes/profileRoutes.js`

**Endpoints:**
```
GET  /api/recruiter/profile              - Get recruiter profile
PUT  /api/recruiter/profile              - Update recruiter profile (with photo upload)
POST /api/recruiter/company-profile      - Create company profile
GET  /api/recruiter/company-profile      - Get company profile
PUT  /api/recruiter/company-profile      - Update company profile (with logo upload)
```

**Configuration:**
- Multer for file upload handling
- File type validation (jpg, png, webp)
- Max file size: 5MB
- Auto-folder creation for uploads

### Server Configuration:
- Routes mounted at `/api/recruiter`
- Added to `/backend/server.js`

---

## 🎨 Frontend Structure

### Pages Created:

#### 1. **RecruiterProfile.jsx**
```
Location: /frontend/src/pages/RecruiterProfile.jsx

Features:
- View active recruiter profile
- Edit mode toggle
- Form validation
- Photo upload with preview
- Profile completion tracking
- Contact information display
- Professional info display
- Social links management
- Success/error alerts
- Responsive grid layout (1 col mobile, 3 cols desktop)
```

#### 2. **CompanyProfile.jsx**
```
Location: /frontend/src/pages/CompanyProfile.jsx

Features:
- Create company profile if not exists
- Edit company information
- Logo upload with preview
- Social media links management
- About company description
- Company size selection
- Website and founded year
- No company state handling
- Profile completion percentage
- Mobile-first responsive design
```

### Reusable Components:

#### 1. **FormInput.jsx** (`/frontend/src/components/recruiter/FormInput.jsx`)
```
Props:
- label: Input label text
- name: Input field name
- value: Input value
- onChange: Change handler
- type: Input type (default: text)
- placeholder: Placeholder text
- required: Boolean flag
- error: Error message
- disabled: Boolean flag
- maxLength: Max characters
- className: Additional CSS classes

Features:
- Error state styling
- Required field indicator
- Error message display with icon
```

#### 2. **ImageUploader.jsx** (`/frontend/src/components/recruiter/ImageUploader.jsx`)
```
Props:
- label: Upload label
- onImageChange: File change callback
- currentImage: Current image URL
- imageType: 'profile' or 'company'
- required: Boolean flag
- error: Error message

Features:
- Drag & drop support
- Click to upload
- Image preview
- File validation (type & size)
- Remove image button
- Visual feedback on drag
- 5MB file size limit
- JPG, PNG, WebP support
```

#### 3. **ProfileHeader.jsx** (`/frontend/src/components/recruiter/ProfileHeader.jsx`)
```
Props:
- name: User/company name
- title: Designation or industry
- image: Profile/logo image URL
- completionPercentage: Completion %
- lastUpdated: Last update date
- onEditClick: Edit button handler
- isEditing: Edit mode flag

Features:
- Gradient background
- Profile completion progress
- Last updated timestamp
- Edit/Cancel button toggle
- Responsive photo sizing
- Avatar fallback
```

### Services Created:

**File:** `/frontend/src/services/profileAPI.js`

**API Methods:**
```javascript
recruiterProfileAPI.getProfile()        // Get recruiter profile
recruiterProfileAPI.updateProfile()     // Update with FormData

companyProfileAPI.getProfile()          // Get company profile
companyProfileAPI.createProfile()       // Create new company
companyProfileAPI.updateProfile()       // Update with FormData
```

### Routes Added:

**Updated:** `/frontend/src/App.jsx`

```
/recruiter/profile          → RecruiterProfile page
/recruiter/company-profile  → CompanyProfile page
```

Both routes protected with:
- Authentication check
- Recruiter role validation

---

## 🔐 Security Features

✅ JWT Authentication on all endpoints
✅ Role-based access (recruiter only)
✅ File type validation (images only)
✅ File size validation (max 5MB)
✅ URL validation for social links
✅ Email field read-only
✅ Form validation on frontend & backend
✅ Error handling for all operations

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Touch-friendly buttons
- Sticky action buttons on scroll
- Optimized spacing

### Tablet (768px - 1024px)
- 2-3 column layouts where appropriate
- Larger touch targets
- Better spacing

### Desktop (> 1024px)
- Full 3+ column grids
- Hover effects
- Optimized whitespace
- Professional layout

---

## 🎨 Theme Integration

All components support:
- Emerald color scheme (primary)
- Tailwind CSS classes
- CSS variable support for custom theming
- Light/Dark mode ready
- Consistent spacing and typography

Color Scheme:
- Primary: Emerald (#10B981)
- Backgrounds: Slate (50-900)
- Success: Green
- Error: Red
- Info: Blue

---

## ✅ Form Validation

### Recruiter Profile:
- Full Name: Required, non-empty
- Email: Read-only
- LinkedIn Link: Valid URL format
- Bio: Max 500 characters
- Phone: Optional format validation

### Company Profile:
- Company Name: Required, non-empty
- Location: Required, non-empty
- Founded Year: Numeric validation
- Website: Valid URL format
- Social Links: Valid URLs
- About Company: Max 2000 characters

---

## 📊 Profile Completion Tracking

**Auto-calculated percentage based on:**

### Recruiter Profile:
- fullName (12.5%)
- email (12.5%)
- phone (12.5%)
- profilePhoto (12.5%)
- designation (12.5%)
- companyId (12.5%)
- bio (12.5%)
- linkedinLink (12.5%)

### Company Profile:
- companyName (12.5%)
- companyLogo (12.5%)
- industry (12.5%)
- companySize (12.5%)
- foundedYear (12.5%)
- website (12.5%)
- location (12.5%)
- aboutCompany (12.5%)

---

## 🚀 API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* profile object */ }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 📝 Usage Examples

### Get Recruiter Profile:
```javascript
const response = await recruiterProfileAPI.getProfile();
```

### Update Recruiter Profile:
```javascript
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('phone', '+1234567890');
formData.append('profilePhoto', file);

const response = await recruiterProfileAPI.updateProfile(formData);
```

### Update Company Profile:
```javascript
const formData = new FormData();
formData.append('companyName', 'Tech Corp');
formData.append('location', 'San Francisco');
formData.append('companyLogo', logoFile);
formData.append('socialLinks', JSON.stringify(socialLinks));

const response = await companyProfileAPI.updateProfile(formData);
```

---

## 🔧 Setup Instructions

### Backend:
1. Models are in `/backend/models/`
2. Controller in `/backend/controllers/profileController.js`
3. Routes in `/backend/routes/profileRoutes.js`
4. Routes already added to `/backend/server.js`

### Frontend:
1. Pages in `/frontend/src/pages/`
2. Components in `/frontend/src/components/recruiter/`
3. API service in `/frontend/src/services/profileAPI.js`
4. Routes added to `/frontend/src/App.jsx`

### To Use:
1. Navigate to `/recruiter/profile` for recruiter profile
2. Navigate to `/recruiter/company-profile` for company profile
3. Click "Edit Profile" to make changes
4. Upload images using drag & drop or click
5. Click "Save Changes" to update

---

## 🎯 Future Enhancements

- Cloudinary/AWS S3 integration for production
- Image cropping tool
- Profile preview page
- Social media verification
- Activity timeline
- Bulk operations
- Analytics dashboard
- Email notifications on profile updates
- Two-factor authentication

---

## 📦 Dependencies

### Backend:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `multer` - File uploads
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing

### Frontend:
- `react` - UI library
- `react-router-dom` - Routing
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `axios` - HTTP client

---

## ✨ Code Quality

- ✅ Modular structure
- ✅ Reusable components
- ✅ Clean error handling
- ✅ Form validation
- ✅ Responsive design
- ✅ Accessible inputs
- ✅ Loading states
- ✅ Error states
- ✅ Success feedback
- ✅ Production-ready code

---

**Last Updated:** February 15, 2026
**Version:** 1.0.0
