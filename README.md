# Clarity - Real-time Learning Platform
<img src=".\my-app\src\app\favicon.ico" alt="logo" width="100" align="right"/>
A comprehensive educational platform that enables real-time communication between teachers and students through anonymous confusion point submissions. Built with modern web technologies and AI-powered insights.

## Project Overview

Clarity is a multi-tier educational platform designed to bridge the gap between teachers and students by providing an anonymous channel for students to express confusion points during or after class. The platform offers both a modern, full-featured version and a simple, lightweight version for different deployment needs.

## Architecture

This project consists of three main components:

### 1. Modern Next.js Frontend (`my-app/`)
- **Technology**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Features**: Real-time updates, AI-powered summaries, modern UI/UX
- **Deployment**: Production-ready with Vercel support

### 2. Django Backend (`backend/`)
- **Technology**: Django 5.2, Django REST Framework, PostgreSQL
- **Features**: RESTful API, user authentication, course management, analytics
- **Deployment**: Scalable backend with Redis for caching

### 3. Simple PHP Version (`simple_clarity/`)
- **Technology**: PHP, MySQL, HTML/CSS/JavaScript
- **Features**: Lightweight, easy deployment, no complex dependencies
- **Deployment**: Works with any web server (Apache/Nginx)

## Key Features

### For Teachers
- Create and manage course rooms with custom IDs
- View real-time anonymous student submissions
- AI-powered analysis of common confusion themes
- Analytics dashboard for course insights
- Support for large lecture halls and hybrid classes

### For Students
- Join courses using room IDs
- Submit confusion points completely anonymously
- View what other classmates are confused about
- Real-time updates during class
- Mobile-friendly interface

### AI-Powered Insights
- Automatic summarization of confusion themes
- Pattern recognition across submissions
- Intelligent categorization of topics
- Teacher recommendations based on data

## Quick Start

### Option 1: Modern Full-Stack Version (Recommended)

#### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+ and pip
- PostgreSQL 12+
- Redis (optional, for caching)

#### Frontend Setup
```bash
cd my-app
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Option 2: Simple PHP Version

#### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Web server (Apache/Nginx) or XAMPP

## Detailed Setup Instructions

### Modern Version Setup

#### 1. Frontend (Next.js)
```bash
# Navigate to frontend directory
cd my-app

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Simple Version Setup

#### 1. Database Configuration
```sql
-- Create database
CREATE DATABASE clarity_simple;

-- Import schema
-- Use the database.sql file in simple_clarity/
```

#### 2. PHP Configuration
Edit `simple_clarity/api/config.php`:
```php
$host = 'localhost';
$dbname = 'clarity_simple';
$username = 'root';
$password = '';
```

## Project Structure

```
CodeRED2025-404NotFound/
├── my-app/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/      # React components
│   │   └── lib/              # Utilities
│   ├── public/               # Static assets
│   └── package.json
├── backend/                   # Django backend
│   ├── accounts/             # User management
│   ├── courses/              # Course management
│   ├── submissions/          # Confusion submissions
│   ├── analytics/             # Analytics and insights
│   └── requirements.txt
├── simple_clarity/            # Simple PHP version
│   ├── api/                  # PHP backend
│   ├── index.html            # Main page
│   ├── styles.css            # Styling
│   ├── script.js             # Frontend logic
│   └── database.sql          # Database schema
└── README.md                 # This file
```

## Technology Stack

### Modern Version
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **AI**: Google Gemini API integration
- **Deployment**: Vercel (frontend), Railway/Heroku (backend)

### Simple Version
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Backend**: PHP 7.4+, MySQL 5.7+
- **Server**: Apache/Nginx
- **Deployment**: Any web hosting service

## API Endpoints

### Modern Version (Django REST)
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/courses/` - List courses
- `POST /api/courses/` - Create course
- `POST /api/submissions/` - Submit confusion point
- `GET /api/analytics/summary/` - Get AI summary

### Simple Version (PHP)
- `POST /api/register.php` - User registration
- `POST /api/login.php` - User login
- `GET /api/courses.php` - Course management
- `POST /api/pain_points.php` - Submit confusion

## Usage Guide

### For Teachers
1. **Create Account**: Register as a teacher
2. **Create Course**: Set up a new course with a custom room ID
3. **Share Room ID**: Provide students with the room ID
4. **Monitor Submissions**: View real-time confusion points
5. **Review Analytics**: Get AI-powered insights and summaries

### For Students
1. **Create Account**: Register as a student
2. **Join Course**: Enter the room ID provided by your teacher
3. **Submit Confusion**: Anonymously submit topics you're confused about
4. **View Class Insights**: See what others are confused about

## Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd my-app
npm test
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check
```


## Deployment

### Production Deployment (Modern Version)
1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Railway/Heroku
3. **Database**: Use PostgreSQL service
4. **Environment**: Set production environment variables

## License
This project is part of CodeRED 2025 competition.

## Support
For issues and questions:
- Check the troubleshooting section in `simple_clarity/README.md`
- Review the Django backend documentation
- Check browser console for frontend errors

## Roadmap
- Advanced analytics dashboard
- Integration with learning management systems
- Multi-language support
- Advanced AI features
- Real-time notifications
- Video integration for hybrid classes
