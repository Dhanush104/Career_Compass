# Career Compass API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
1. [Authentication](#authentication-endpoints)
2. [Users](#user-endpoints)
3. [Roadmap](#roadmap-endpoints)
4. [Goals](#goal-endpoints)
5. [Analytics](#analytics-endpoints)
6. [Community](#community-endpoints)
7. [Resumes](#resume-endpoints)
8. [Coding Challenges](#coding-challenge-endpoints)
9. [Interview Practice](#interview-endpoints)
10. [Mentorship](#mentorship-endpoints)

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "jwt_token_here",
    "userId": "user_id",
    "username": "johndoe"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

---

## User Endpoints

### Get User Profile
**GET** `/users/profile`
- Requires authentication

### Update User Profile
**PUT** `/users/profile`
- Requires authentication

**Body:**
```json
{
  "fullName": "John Doe",
  "bio": "Software Developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "linkedInUrl": "https://linkedin.com/in/johndoe"
}
```

---

## Roadmap Endpoints

### Get User Roadmap
**GET** `/roadmap`
- Requires authentication

### Generate Roadmap
**POST** `/roadmap/generate`
- Requires authentication

**Body:**
```json
{
  "careerGoal": "Full Stack Developer",
  "currentSkills": ["HTML", "CSS", "JavaScript"]
}
```

### Update Task Status
**PUT** `/roadmap/tasks/:taskId`
- Requires authentication

**Body:**
```json
{
  "completed": true
}
```

---

## Goal Endpoints

### Get All Goals
**GET** `/goals`
- Requires authentication
- Query params: `?status=active&category=career`

### Create Goal
**POST** `/goals`
- Requires authentication

**Body:**
```json
{
  "title": "Learn React",
  "description": "Master React fundamentals",
  "category": "learning",
  "priority": "high",
  "deadline": "2024-12-31",
  "milestones": [
    {
      "title": "Complete React tutorial",
      "description": "Finish official React docs",
      "dueDate": "2024-06-30"
    }
  ]
}
```

### Update Goal
**PUT** `/goals/:goalId`
- Requires authentication

### Delete Goal
**DELETE** `/goals/:goalId`
- Requires authentication

### Get Goal Statistics
**GET** `/goals/stats`
- Requires authentication

### Update Milestone
**PUT** `/goals/:goalId/milestones/:milestoneId`
- Requires authentication

**Body:**
```json
{
  "completed": true
}
```

---

## Analytics Endpoints

### Get User Analytics
**GET** `/analytics`
- Requires authentication

### Get Activity Heatmap
**GET** `/analytics/heatmap`
- Requires authentication
- Query params: `?startDate=2024-01-01&endDate=2024-12-31`

### Get Skill Progress
**GET** `/analytics/skills`
- Requires authentication

### Get Achievements
**GET** `/analytics/achievements`
- Requires authentication

---

## Community Endpoints

### Get Community Posts
**GET** `/community/posts`
- Query params: `?type=discussion&category=career`

### Create Post
**POST** `/community/posts`
- Requires authentication

**Body:**
```json
{
  "title": "How to prepare for technical interviews?",
  "content": "Looking for advice on technical interview preparation...",
  "type": "question",
  "category": "interview",
  "tags": ["interview", "preparation", "advice"]
}
```

### Like Post
**POST** `/community/posts/:postId/like`
- Requires authentication

### Add Comment
**POST** `/community/posts/:postId/comments`
- Requires authentication

**Body:**
```json
{
  "content": "Great question! Here's my advice..."
}
```

---

## Resume Endpoints

### Get All Resumes
**GET** `/resumes`
- Requires authentication

### Get Resume
**GET** `/resumes/:resumeId`
- Requires authentication

### Create Resume
**POST** `/resumes`
- Requires authentication

**Body:**
```json
{
  "title": "Software Developer Resume",
  "template": "modern",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "summary": "Experienced software developer..."
  },
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "New York, NY",
      "startDate": "2020-01-01",
      "current": true,
      "description": "Developed web applications...",
      "achievements": ["Led team of 5 developers", "Improved performance by 40%"]
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "level": "Advanced",
      "category": "Technical"
    }
  ]
}
```

### Update Resume
**PUT** `/resumes/:resumeId`
- Requires authentication

### Delete Resume
**DELETE** `/resumes/:resumeId`
- Requires authentication

### Download Resume
**POST** `/resumes/:resumeId/download`
- Requires authentication

### Share Resume
**POST** `/resumes/:resumeId/share`
- Requires authentication

---

## Coding Challenge Endpoints

### Get All Challenges
**GET** `/coding-challenges`
- Requires authentication
- Query params: `?difficulty=medium&category=algorithms`

### Get Challenge
**GET** `/coding-challenges/:challengeId`
- Requires authentication

### Submit Solution
**POST** `/coding-challenges/:challengeId/submit`
- Requires authentication

**Body:**
```json
{
  "code": "function twoSum(nums, target) { ... }",
  "language": "javascript"
}
```

### Get User Submissions
**GET** `/coding-challenges/:challengeId/submissions`
- Requires authentication

### Get Editorial
**GET** `/coding-challenges/:challengeId/editorial`
- Requires authentication
- Only available after solving the challenge

### Get Challenge Statistics
**GET** `/coding-challenges/stats`
- Requires authentication

### Like Challenge
**POST** `/coding-challenges/:challengeId/like`
- Requires authentication

### Add Discussion
**POST** `/coding-challenges/:challengeId/discussions`
- Requires authentication

**Body:**
```json
{
  "title": "Alternative approach",
  "content": "Here's another way to solve this problem..."
}
```

---

## Interview Endpoints

### Get All Sessions
**GET** `/interviews`
- Requires authentication
- Query params: `?status=completed&category=technical`

### Get Session
**GET** `/interviews/:sessionId`
- Requires authentication

### Create Session
**POST** `/interviews`
- Requires authentication

**Body:**
```json
{
  "sessionType": "practice",
  "category": "technical",
  "title": "System Design Practice",
  "company": "Google",
  "position": "Senior Software Engineer"
}
```

### Add Question Response
**POST** `/interviews/:sessionId/responses`
- Requires authentication

**Body:**
```json
{
  "question": "Explain how you would design a URL shortener",
  "category": "system-design",
  "difficulty": "medium",
  "userAnswer": "I would use a hash function to generate short codes...",
  "timeSpent": 600,
  "rating": 4,
  "feedback": "Good approach, consider scalability"
}
```

### Complete Session
**POST** `/interviews/:sessionId/complete`
- Requires authentication

### Get Session Statistics
**GET** `/interviews/stats`
- Requires authentication

### Share Session
**POST** `/interviews/:sessionId/share`
- Requires authentication

**Body:**
```json
{
  "sharedWith": ["userId1", "userId2"]
}
```

### Add Mentor Feedback
**POST** `/interviews/:sessionId/feedback`
- Requires authentication

**Body:**
```json
{
  "feedback": "Great answers! Work on explaining trade-offs more clearly.",
  "rating": 4
}
```

---

## Mentorship Endpoints

### Get Mentorship Requests
**GET** `/mentorship/requests`
- Requires authentication
- Query params: `?role=mentor&status=pending`

### Create Mentorship Request
**POST** `/mentorship/requests`
- Requires authentication

**Body:**
```json
{
  "mentorId": "mentor_user_id",
  "title": "Career Guidance Session",
  "description": "Looking for advice on transitioning to data science",
  "category": "career_guidance",
  "duration": "1 hour",
  "preferredTime": "Weekday evenings"
}
```

### Update Request Status
**PUT** `/mentorship/requests/:requestId`
- Requires authentication

**Body:**
```json
{
  "status": "accepted",
  "scheduledAt": "2024-07-15T18:00:00Z"
}
```

### Add Message
**POST** `/mentorship/requests/:requestId/messages`
- Requires authentication

**Body:**
```json
{
  "content": "Looking forward to our session!"
}
```

### Get Study Groups
**GET** `/mentorship/study-groups`
- Query params: `?category=coding_challenges`

### Get User's Study Groups
**GET** `/mentorship/study-groups/my-groups`
- Requires authentication

### Create Study Group
**POST** `/mentorship/study-groups`
- Requires authentication

**Body:**
```json
{
  "name": "LeetCode Study Group",
  "description": "Daily coding practice and discussion",
  "category": "coding_challenges",
  "maxMembers": 15,
  "isPrivate": false,
  "schedule": {
    "frequency": "weekly",
    "dayOfWeek": "Saturday",
    "time": "10:00 AM",
    "timezone": "EST"
  }
}
```

### Join Study Group
**POST** `/mentorship/study-groups/:groupId/join`
- Requires authentication

**Body (for private groups):**
```json
{
  "inviteCode": "ABC123XYZ"
}
```

### Leave Study Group
**POST** `/mentorship/study-groups/:groupId/leave`
- Requires authentication

### Add Resource to Group
**POST** `/mentorship/study-groups/:groupId/resources`
- Requires authentication

**Body:**
```json
{
  "title": "System Design Primer",
  "url": "https://github.com/donnemartin/system-design-primer",
  "type": "link"
}
```

### Get Connections
**GET** `/mentorship/connections`
- Requires authentication
- Query params: `?status=accepted`

### Send Connection Request
**POST** `/mentorship/connections`
- Requires authentication

**Body:**
```json
{
  "recipientId": "user_id",
  "message": "I'd love to connect and learn from your experience",
  "connectionType": "professional",
  "context": {
    "howMet": "conference",
    "commonInterests": ["machine learning", "data science"]
  }
}
```

### Update Connection Status
**PUT** `/mentorship/connections/:connectionId`
- Requires authentication

**Body:**
```json
{
  "status": "accepted"
}
```

### Add Interaction
**POST** `/mentorship/connections/:connectionId/interactions`
- Requires authentication

**Body:**
```json
{
  "type": "endorsement",
  "content": "Highly skilled in React development"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": ["Additional error details if applicable"]
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting
- Window: 15 minutes
- Max requests: 100 per window

---

## Testing the API

### Using the Database Test Utility
```bash
npm run test:db
```

### Seeding Sample Data
```bash
npm run seed
```

### Starting the Development Server
```bash
npm run dev
```

---

## Environment Variables Required

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.
