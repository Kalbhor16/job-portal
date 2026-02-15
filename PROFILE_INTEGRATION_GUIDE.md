# Quick Integration Guide - Profile System

## 📋 Checklist - What Was Created

### ✅ Backend (Node.js + Express + MongoDB)

**Models** (2 new files):
- [ ] `/backend/models/RecruiterProfile.js` - Recruiter profile schema
- [ ] `/backend/models/Company.js` - Company profile schema

**Controllers** (1 new file):
- [ ] `/backend/controllers/profileController.js` - All profile logic

**Routes** (1 new file):
- [ ] `/backend/routes/profileRoutes.js` - Profile endpoints
- [ ] Updated: `/backend/server.js` - Added route import

### ✅ Frontend (React + Vite)

**Pages** (2 new files):
- [ ] `/frontend/src/pages/RecruiterProfile.jsx` - Recruiter profile page
- [ ] `/frontend/src/pages/CompanyProfile.jsx` - Company profile page

**Components** (3 new files):
- [ ] `/frontend/src/components/recruiter/FormInput.jsx` - Form input wrapper
- [ ] `/frontend/src/components/recruiter/ImageUploader.jsx` - Image upload component
- [ ] `/frontend/src/components/recruiter/ProfileHeader.jsx` - Profile header component

**Services** (1 new file):
- [ ] `/frontend/src/services/profileAPI.js` - API service methods

**Routing** (1 updated file):
- [ ] Updated: `/frontend/src/App.jsx` - Added new routes

---

## 🔗 API Endpoints

### Recruiter Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/recruiter/profile` | Get recruiter profile | ✅ Bearer Token |
| PUT | `/api/recruiter/profile` | Update recruiter profile | ✅ Bearer Token |

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data (for file upload)
```

**Request Body (PUT):**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "designation": "HR Manager",
  "bio": "Experienced HR professional",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "profilePhoto": <file>
}
```

### Company Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/recruiter/company-profile` | Get company profile | ✅ Bearer Token |
| POST | `/api/recruiter/company-profile` | Create company profile | ✅ Bearer Token |
| PUT | `/api/recruiter/company-profile` | Update company profile | ✅ Bearer Token |

**Request Body (POST/PUT):**
```json
{
  "companyName": "Tech Corp",
  "industry": "Software",
  "companySize": "11-50",
  "foundedYear": 2015,
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "aboutCompany": "A leading tech company...",
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/techcorp",
    "twitter": "https://twitter.com/techcorp",
    "facebook": "https://facebook.com/techcorp"
  },
  "companyLogo": <file>
}
```

---

## 🌐 Frontend Routes

```
/recruiter/profile          → RecruiterProfile Page
/recruiter/company-profile  → CompanyProfile Page
```

Both routes are:
- Protected with authentication
- Require recruiter role
- Return 401 if not logged in
- Return 403 if not recruiter role

---

## 🚀 How to Use

### For Recruiters:

**1. Update Personal Profile:**
```
Navigate to: /recruiter/profile
- Upload profile photo
- Fill in personal details
- Add designation
- Add LinkedIn link
- Write bio
- Save changes
```

**2. Setup Company Profile:**
```
Navigate to: /recruiter/company-profile
- Upload company logo
- Enter company details
- Add foundedYear, website
- Add social links
- Save company profile
```

### Success Indicators:
- ✅ Profile completion % increases
- ✅ Success toast message appears
- ✅ Page refreshes with new data
- ✅ Timestamp updates to "Last updated: today"

---

## 📝 Form Validation Rules

### Recruiter Profile:
| Field | Rule | Required |
|-------|------|----------|
| fullName | Non-empty string | Yes |
| email | Read-only | N/A |
| phone | Optional, valid format | No |
| profilePhoto | JPG/PNG/WebP, max 5MB | No |
| designation | Select from dropdown | Yes |
| bio | Max 500 characters | No |
| linkedinLink | Valid URL format | No |

### Company Profile:
| Field | Rule | Required |
|-------|------|----------|
| companyName | Non-empty string | Yes |
| location | Non-empty string | Yes |
| companyLogo | JPG/PNG/WebP, max 5MB | No |
| industry | Any string | No |
| companySize | Select from enum | No |
| foundedYear | Numeric, valid year | No |
| website | Valid URL format | No |
| aboutCompany | Max 2000 characters | No |
| socialLinks | Valid URLs | No |

---

## 🎨 Current Theme Colors

Primary Color: **Emerald (#10B981)**
- Backgrounds: emerald-50, emerald-100, etc.
- Buttons: emerald-600 (hover: emerald-700)
- Borders: emerald-500
- Text: emerald-600

Alternate Colors:
- Slate: 50-900 (backgrounds, text)
- Red: 500-600 (errors)
- Green: 500-600 (success)
- Blue: Various social colors

To change theme, update Tailwind color in:
- All component files
- Page files
- CSS variable `--primary-color`

---

## 🔐 Security Notes

1. **Authentication:**
   - JWT token required in Authorization header
   - Token must be Bearer format
   - Automatic refresh on 401

2. **Authorization:**
   - Only recruiters can access profiles
   - Users can only edit their own profile
   - Company data is user-specific

3. **File Upload:**
   - Only image files allowed
   - Max 5MB per file
   - Filename sanitized for security
   - Temporary upload folder used

4. **Data Validation:**
   - Frontend validation for UX
   - Backend validation for security
   - URL validation before storage
   - Email confirmed via User model

---

## 🐛 Troubleshooting

### Common Issues:

**1. Routes not accessible**
- Check App.jsx imports
- Verify routes are added
- Clear browser cache

**2. Image upload not working**
- Check file size (< 5MB)
- Verify file type (jpg, png, webp)
- Check backend multer config
- Verify /uploads folder exists

**3. API calls failing**
- Check token in localStorage
- Verify Authorization header
- Check backend server running
- Check CORS settings

**4. Profile not saving**
- Check form validation errors
- Verify all required fields filled
- Check browser console for errors
- Verify backend controller logic

---

## 📊 Testing Guide

### Manual Testing Checklist:

**Recruiter Profile:**
- [ ] Load page without error
- [ ] See existing profile data
- [ ] Click Edit button
- [ ] Upload profile photo
- [ ] Fill in all fields
- [ ] See validation errors
- [ ] Fix errors
- [ ] Save successfully
- [ ] See success message
- [ ] Completion % updates
- [ ] Last updated timestamp changes
- [ ] Cancel button works
- [ ] Photo preview works
- [ ] Drag & drop upload works

**Company Profile:**
- [ ] No company state works
- [ ] Create company button visible
- [ ] Click to create shows form
- [ ] All fields editable
- [ ] Social links validation works
- [ ] Logo upload works
- [ ] Save successfully
- [ ] Profile data persists
- [ ] Completion tracking works

---

## 🔧 Environment Variables Needed

None specific to profile system (uses existing auth).

Required in `.env`:
```
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 File References

**Backend Files:**
- Models: 2 files (RecruiterProfile, Company)
- Controllers: 1 file (profileController)
- Routes: 1 file (profileRoutes + update to server.js)
- Total Lines: ~350 lines backend code

**Frontend Files:**
- Pages: 2 files (RecruiterProfile, CompanyProfile)
- Components: 3 files (FormInput, ImageUploader, ProfileHeader)
- Services: 1 file (profileAPI)
- Total Lines: ~800 lines frontend code
- Routes: Updated App.jsx

---

## ✨ Features Summary

| Feature | Recruiter | Company |
|---------|-----------|---------|
| Profile View | ✅ | ✅ |
| Profile Edit | ✅ | ✅ |
| Photo/Logo Upload | ✅ | ✅ |
| Form Validation | ✅ | ✅ |
| Error Messages | ✅ | ✅ |
| Success Toast | ✅ | ✅ |
| Completion % | ✅ | ✅ |
| Social Links | ✅ | ✅ |
| Mobile Responsive | ✅ | ✅ |
| Last Updated | ✅ | ✅ |

---

## 🎯 Next Steps

1. **Backend Setup:**
   - Ensure MongoDB connection works
   - Test API endpoints with Postman
   - Verify JWT middleware attached

2. **Frontend Setup:**
   - Run `npm run dev` in frontend folder
   - Test routes at /recruiter/profile
   - Check browser console for errors

3. **Testing:**
   - Create test recruiter account
   - Fill in all profile fields
   - Upload images
   - Verify API calls work
   - Check database records

4. **Deployment:**
   - Set production API URL
   - Setup file storage (S3/Cloudinary)
   - Configure CORS for production
   - Test all endpoints

---

**Documentation Version:** 1.0
**Last Updated:** February 15, 2026
**Status:** ✅ Complete & Ready for Integration
