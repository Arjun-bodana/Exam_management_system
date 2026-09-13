# ParikshVision 🛡️ - Enterprise-Grade Exam Management System

![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=spring)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)

ParikshVision is a highly secure, scalable, and progressive Exam Management System (EMS). Designed with a mobile-first philosophy, it enforces strict examination rules—such as forward-only navigation and tab-locking—while concurrently monitoring candidates using real-time AI computer vision.

---

## ✨ Core Features

### 👨‍🎓 For Students (Distraction-Free Environment)
*   **Progressive UI:** Clean, step-by-step Moodle-inspired interface to minimize cognitive load.
*   **Strict Forward-Only Navigation:** Prevents returning to previously answered or skipped questions.
*   **Floating Camera Overlay:** A draggable, collapsible live webcam feed that doesn't obstruct exam content.
*   **Offline Resilience:** Asynchronous auto-saving of answers to `localStorage` during internet dropouts.

### 🕵️‍♂️ For Proctors & Admins (Live Monitoring)
*   **Real-Time AI Proctoring:** Continuous frame analysis via WebSockets to detect:
    *   Missing Face / Multiple Faces
    *   Mobile Phone Detection (YOLO)
    *   Unusual Head Movements (MediaPipe)
*   **Live Risk Dashboard:** High-density data grid displaying active candidates with dynamic risk scores (0-100).
*   **Incident Logging:** Automated capture of evidence snapshots and tab-switch violations.

---

## 🏗️ System Architecture

ParikshVision follows a modern microservices-inspired architecture:
1.  **Frontend Shell:** React + Vite + TypeScript for a blazing-fast SPA.
2.  **Core API (Backend):** Java Spring Boot handling RBAC (Role-Based Access Control), Exam Scheduling, and Result processing.
3.  **AI Microservice:** Python FastAPI utilizing OpenCV and ML models to process WebRTC/WebSocket video frames.
4.  **Databases:** PostgreSQL (Relational data: Users, Exams) + MongoDB (Unstructured data: Audit logs, Incident snapshots).

---

## 🚀 Local Development Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Java JDK](https://www.oracle.com/java/technologies/downloads/) (v17 or higher)
*   [Python](https://www.python.org/) (v3.10 or higher)
*   PostgreSQL & MongoDB

### 1. Frontend Setup
```bash
# Clone the repository
git clone [https://github.com/yourusername/ParikshVision.git](https://github.com/yourusername/ParikshVision.git)

# Navigate to the frontend directory
cd ParikshVision/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
