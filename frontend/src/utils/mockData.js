// Mock data for ApplicantDetails page testing
export const mockApplicationData = {
  _id: '65f4a2b8c1d2e3f4g5h6i7j8',
  job: {
    _id: '65f49a9b1c2d3e4f5g6h7i8j',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our dynamic team. You will be responsible for building scalable web applications using React, Redux, and Node.js. Must have 3+ years of experience with React and strong knowledge of modern JavaScript.',
    experienceLevel: 'Senior (3+ years)',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'GraphQL', 'Docker'],
    salary: '$80,000 - $120,000',
    location: 'San Francisco, CA (Remote)',
    createdAt: new Date('2024-12-01'),
    views: 245,
  },
  applicant: {
    _id: '65f49a5b1c2d3e4f5g6h7i8j',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    headline: 'Full Stack Developer | React Specialist | Tech Enthusiast',
    location: 'San Francisco, CA',
    profilePhoto: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React and Node.js with a strong foundation in modern JavaScript and web technologies. Always eager to learn new technologies and best practices.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'REST APIs'],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        duration: '2 years',
        description: 'Led development of multiple React applications serving 500K+ users.'
      },
      {
        title: 'Full Stack Developer',
        company: 'Digital Innovators',
        duration: '2 years',
        description: 'Built and maintained full-stack applications using React and Node.js.'
      },
      {
        title: 'Junior Developer',
        company: 'StartUp Hub',
        duration: '1.5 years',
        description: 'Developed web applications and learned modern development practices.'
      }
    ],
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: 2018
      },
      {
        school: 'Online Academy',
        degree: 'Certification',
        field: 'Advanced React Development',
        year: 2022
      }
    ],
    certifications: ['React Advanced', 'Node.js Backend Development', 'Docker for Developers'],
  },
  recruiter: {
    _id: '65f49a0b1c2d3e4f5g6h7i8j',
    firstName: 'Sarah',
    lastName: 'Johnson',
  },
  resumeUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf',
  coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior React Developer position at your esteemed organization. With over 5 years of professional experience in full-stack web development, with a focus on React and Node.js, I am confident that I can make significant contributions to your team.

Throughout my career, I have successfully led the development of multiple high-impact React applications that serve hundreds of thousands of users. My expertise extends across the entire development stack, from building elegant, responsive user interfaces to designing scalable backend APIs. I am well-versed in modern JavaScript (ES6+), TypeScript, and have hands-on experience with state management libraries like Redux.

What particularly excites me about this opportunity is your company's commitment to cutting-edge technology and innovation. I have followed your recent product launches and am impressed by your team's dedication to quality and user experience. I believe my technical skills, combined with my passion for clean code and best practices, align perfectly with your team's values and objectives.

In my current role at Tech Solutions Inc., I have:
- Led a team of 3 developers in rebuilding our main application using React hooks and modern patterns
- Reduced application load time by 40% through performance optimization
- Implemented automated testing, increasing code coverage from 45% to 92%
- Mentored junior developers and conducted code reviews

I am particularly interested in your microservices architecture and would love to contribute to its development and optimization. I am confident that my experience with Docker containerization and AWS deployment will be valuable in this context.

I am excited about the possibility of joining your team and contributing to your company's continued success. I am available for an interview at your earliest convenience and welcome the opportunity to discuss how my skills and experience can benefit your organization.

Thank you for considering my application.

Best regards,
John Anderson`,

  portfolioLink: 'https://johnderson-portfolio.com',
  linkedinLink: 'https://linkedin.com/in/johnanderson',
  githubLink: 'https://github.com/johnanderson',
  majorProjectLink: 'https://github.com/johnanderson/e-commerce-platform',

  answers: [
    {
      question: 'Tell us about your most significant project. What was your role?',
      answer: 'My most significant project was rebuilding our company\'s entire e-commerce platform using React and Node.js. I served as the lead frontend developer and was responsible for the entire React architecture. The platform now handles 100,000+ concurrent users and has improved performance by 60%. I led a team of 3 developers, conducted code reviews, and implemented automated testing with 92% code coverage.'
    },
    {
      question: 'How do you approach learning new technologies?',
      answer: 'I believe in continuous learning and staying updated with industry trends. My approach includes: (1) Reading official documentation and reputable blogs, (2) Building small projects to practice, (3) Contributing to open-source projects, (4) Taking courses on relevant topics, and (5) Discussing new technologies with peers. I have successfully learned React hooks, GraphQL, and Docker using this methodology.'
    },
    {
      question: 'Describe your experience with testing. How important is it to you?',
      answer: 'Testing is crucial to writing maintainable code. I have extensive experience with unit testing (Jest), integration testing, and end-to-end testing (Cypress). In my current project, I increased code coverage from 45% to 92%, which significantly reduced bug reports in production. I believe well-tested code saves time in the long run and increases confidence in deployments.'
    },
    {
      question: 'How do you handle code reviews and feedback?',
      answer: 'I view code reviews as an opportunity to learn and improve. I welcome constructive criticism and value diverse perspectives. I conduct thorough reviews myself, providing helpful suggestions while maintaining a respectful tone. I believe team discussions about coding standards and best practices strengthen the entire team\'s capability.'
    }
  ],

  status: 'Shortlisted',
  interviewScheduledAt: new Date('2024-12-20T10:00:00'),
  interviewMessage: 'Hi John! We would like to schedule an interview with you. Please join us on December 20th at 10:00 AM EST via Zoom: https://zoom.us/meeting/123456789. The interview will be about 60 minutes and will cover technical skills, project experience, and culture fit. Please come prepared with questions about the role and company. Best regards, Sarah Johnson',
  rejectionReason: '',
  rating: 4.5,
  notes: 'Strong technical background, excellent communication skills, proven leadership experience. Great fit for the team. Scheduled for second round interview.',
  appliedAt: new Date('2024-12-05'),
  createdAt: new Date('2024-12-05'),
  updatedAt: new Date('2024-12-10'),
};

export const mockApplicationsList = [
  mockApplicationData,
  {
    ...mockApplicationData,
    _id: '65f4a2b8c1d2e3f4g5h6i7j9',
    applicant: {
      ...mockApplicationData.applicant,
      _id: '65f49a5b1c2d3e4f5g6h7i8k',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 234-5678',
    },
    status: 'Interview Scheduled',
    rating: 4,
  },
  {
    ...mockApplicationData,
    _id: '65f4a2b8c1d2e3f4g5h6i7ja',
    applicant: {
      ...mockApplicationData.applicant,
      _id: '65f49a5b1c2d3e4f5g6h7i8l',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
    },
    status: 'Reviewed',
    rating: 3.5,
  },
];
