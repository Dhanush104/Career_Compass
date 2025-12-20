# 🎯 Skills API Documentation

## Overview
Complete API documentation for the Skills Management System. Allows users to manage their technical skills, track practice time, monitor progress, and get personalized recommendations.

---

## Base URL
```
http://localhost:5000/api/skills
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get All User Skills
Get all skills for the authenticated user with progress data.

**Endpoint:** `GET /api/skills`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "skills": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "React",
      "level": "Advanced",
      "yearsOfExperience": 2,
      "progress": 85,
      "practiceHours": 45.5,
      "lastPracticed": "2024-12-17T10:30:00.000Z",
      "currentLevel": "Advanced"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "JavaScript",
      "level": "Expert",
      "yearsOfExperience": 3,
      "progress": 95,
      "practiceHours": 67.2,
      "lastPracticed": "2024-12-18T09:15:00.000Z",
      "currentLevel": "Expert"
    }
  ]
}
```

---

### 2. Add New Skill
Add a new skill to user's profile.

**Endpoint:** `POST /api/skills`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Python",
  "level": "Beginner",
  "yearsOfExperience": 0.5
}
```

**Validation:**
- `name` (required): String
- `level` (required): Must be one of: `Beginner`, `Intermediate`, `Advanced`, `Expert`
- `yearsOfExperience` (optional): Number (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Skill added successfully",
  "skill": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Python",
    "level": "Beginner",
    "yearsOfExperience": 0.5
  }
}
```

**Rewards:**
- +25 XP for adding a skill
- Initializes skill in analytics with progress based on level

---

### 3. Update Skill
Update an existing skill's information.

**Endpoint:** `PUT /api/skills/:skillId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "level": "Intermediate",
  "yearsOfExperience": 1.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill updated successfully",
  "skill": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Python",
    "level": "Intermediate",
    "yearsOfExperience": 1.5
  }
}
```

---

### 4. Delete Skill
Remove a skill from user's profile.

**Endpoint:** `DELETE /api/skills/:skillId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

### 5. Track Skill Practice
Log a practice session for a specific skill.

**Endpoint:** `POST /api/skills/:skillId/practice`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "timeSpent": 45,
  "progressIncrease": 5
}
```

**Parameters:**
- `timeSpent` (required): Number of minutes practiced
- `progressIncrease` (optional): Manual progress increase (0-100)

**Response:**
```json
{
  "success": true,
  "message": "Practice tracked successfully",
  "skill": {
    "name": "React",
    "level": "Advanced",
    "progress": 90,
    "practiceHours": 46.25,
    "xpEarned": 20
  }
}
```

**XP Calculation:**
- 5 XP per 10 minutes of practice
- Example: 45 minutes = 20 XP

**Auto-Level Up:**
- When progress reaches 90%, skill automatically levels up
- Beginner → Intermediate → Advanced → Expert

---

### 6. Get Skill Recommendations
Get personalized skill recommendations based on current skills and career goals.

**Endpoint:** `GET /api/skills/recommendations`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "recommendations": [
    {
      "name": "TypeScript",
      "category": "Frontend",
      "priority": "high",
      "reason": "Industry standard for large projects"
    },
    {
      "name": "Docker",
      "category": "DevOps",
      "priority": "high",
      "reason": "Containerization standard"
    },
    {
      "name": "MongoDB",
      "category": "Backend",
      "priority": "high",
      "reason": "NoSQL database"
    }
  ]
}
```

**Recommendation Categories:**
- Frontend: React, Vue.js, TypeScript, Tailwind CSS, Next.js
- Backend: Node.js, Express.js, MongoDB, PostgreSQL, GraphQL
- DevOps: Docker, Kubernetes, AWS, CI/CD, Git
- General: JavaScript, Python, SQL, REST APIs, Testing

---

### 7. Get Skill Statistics
Get comprehensive statistics about user's skills.

**Endpoint:** `GET /api/skills/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSkills": 5,
    "skillsByLevel": {
      "Beginner": 1,
      "Intermediate": 2,
      "Advanced": 1,
      "Expert": 1
    },
    "totalPracticeHours": 189.5,
    "averageProgress": 73,
    "recentlyPracticed": [
      {
        "name": "JavaScript",
        "lastPracticed": "2024-12-18T09:15:00.000Z",
        "practiceHours": 67.2
      },
      {
        "name": "React",
        "lastPracticed": "2024-12-17T10:30:00.000Z",
        "practiceHours": 45.5
      }
    ]
  }
}
```

---

## Data Models

### Skill Object (User Model)
```javascript
{
  _id: ObjectId,
  name: String,
  level: String, // 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  yearsOfExperience: Number
}
```

### Skill Progress (Analytics Model)
```javascript
{
  skillName: String,
  currentLevel: String,
  progress: Number, // 0-100
  practiceHours: Number,
  lastPracticed: Date
}
```

---

## Progress Levels

### Initial Progress by Level
- **Beginner:** 25%
- **Intermediate:** 50%
- **Advanced:** 75%
- **Expert:** 95%

### Level Up Thresholds
- Progress ≥ 90% → Auto level up
- Beginner (90%) → Intermediate
- Intermediate (90%) → Advanced
- Advanced (90%) → Expert
- Expert (90%) → Stays Expert (max level)

---

## XP Rewards

### Adding Skills
- Add new skill: **+25 XP**

### Practice Tracking
- **5 XP per 10 minutes** of practice
- Examples:
  - 10 min = 5 XP
  - 30 min = 15 XP
  - 60 min = 30 XP
  - 120 min = 60 XP

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Skill name and level are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Skill not found"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication failed"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Failed to add skill"
}
```

---

## Usage Examples

### Example 1: Add Multiple Skills
```javascript
const skills = [
  { name: 'React', level: 'Advanced', yearsOfExperience: 2 },
  { name: 'Node.js', level: 'Intermediate', yearsOfExperience: 1.5 },
  { name: 'Python', level: 'Beginner', yearsOfExperience: 0.5 }
];

for (const skill of skills) {
  await fetch('http://localhost:5000/api/skills', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(skill)
  });
}
```

### Example 2: Track Daily Practice
```javascript
// Track 1 hour of React practice
const response = await fetch(`http://localhost:5000/api/skills/${skillId}/practice`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    timeSpent: 60,
    progressIncrease: 3
  })
});

const data = await response.json();
console.log(`Earned ${data.skill.xpEarned} XP!`);
```

### Example 3: Get Skill Progress
```javascript
const response = await fetch('http://localhost:5000/api/skills', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { skills } = await response.json();

skills.forEach(skill => {
  console.log(`${skill.name}: ${skill.progress}% (${skill.practiceHours}h practiced)`);
});
```

---

## Integration with Analytics

### Automatic Updates
When you interact with skills, the following are automatically updated:

1. **User Profile**
   - Skills array
   - Skill levels

2. **User Analytics**
   - Skills progress tracking
   - Practice hours
   - Last practiced dates
   - Daily activity logs

3. **XP System**
   - Total XP increases
   - Daily XP tracking
   - Level progression

---

## Best Practices

### 1. Skill Naming
- Use consistent naming (e.g., "React" not "ReactJS")
- Use proper capitalization
- Avoid abbreviations unless standard (e.g., "SQL" is ok)

### 2. Level Assignment
- **Beginner:** Learning basics, < 6 months
- **Intermediate:** Comfortable with fundamentals, 6-18 months
- **Advanced:** Proficient, can build complex projects, 1.5-3 years
- **Expert:** Master level, can teach others, 3+ years

### 3. Practice Tracking
- Track actual practice time
- Use progressIncrease for significant milestones
- Regular tracking helps with auto-leveling

### 4. Recommendations
- Check recommendations regularly
- Focus on high-priority skills first
- Balance between breadth and depth

---

## Frontend Integration Example

```javascript
// SkillsManager Component
import React, { useState, useEffect } from 'react';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSkills();
    fetchRecommendations();
  }, []);

  const fetchSkills = async () => {
    const response = await fetch('http://localhost:5000/api/skills', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setSkills(data.skills);
  };

  const fetchRecommendations = async () => {
    const response = await fetch('http://localhost:5000/api/skills/recommendations', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setRecommendations(data.recommendations);
  };

  const addSkill = async (skillData) => {
    const response = await fetch('http://localhost:5000/api/skills', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(skillData)
    });
    
    if (response.ok) {
      fetchSkills(); // Refresh list
    }
  };

  const trackPractice = async (skillId, minutes) => {
    await fetch(`http://localhost:5000/api/skills/${skillId}/practice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeSpent: minutes })
    });
    
    fetchSkills(); // Refresh to show updated progress
  };

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
};
```

---

## Testing with cURL

### Get Skills
```bash
curl -X GET http://localhost:5000/api/skills \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Skill
```bash
curl -X POST http://localhost:5000/api/skills \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Python","level":"Beginner","yearsOfExperience":0.5}'
```

### Track Practice
```bash
curl -X POST http://localhost:5000/api/skills/SKILL_ID/practice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"timeSpent":60,"progressIncrease":5}'
```

### Get Recommendations
```bash
curl -X GET http://localhost:5000/api/skills/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Stats
```bash
curl -X GET http://localhost:5000/api/skills/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Summary

The Skills API provides:
- ✅ Complete CRUD operations for skills
- ✅ Practice time tracking with XP rewards
- ✅ Automatic progress calculation
- ✅ Auto-leveling system
- ✅ Personalized recommendations
- ✅ Comprehensive statistics
- ✅ Integration with analytics system
- ✅ XP and achievement system

**All endpoints are production-ready and fully tested!** 🚀
