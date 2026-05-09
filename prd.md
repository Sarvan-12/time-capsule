# 📦 Product Requirements Document (PRD)
## Digital Time Capsule — Future Message Delivery Platform

---

**Document Version:** 1.0  
**Date:** May 2026  
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**Project Type:** Full-Stack Web Application  
**Status:** Draft

---

## 1. Product Overview

### 1.1 Vision

A **Digital Time Capsule** is a web platform that allows users to compose messages, attach media, and schedule them for delivery to one or more recipients at a specified future date. The platform combines emotional storytelling with scheduled communication — bridging today's thoughts with tomorrow's moments.

### 1.2 Problem Statement

People often want to send meaningful messages to their future selves, loved ones, or the world — for milestone events like birthdays, graduations, anniversaries, or personal reflections — but have no reliable platform that ensures private, time-locked delivery.

### 1.3 Solution

A secure MERN-based platform where users can:
- Create rich, multimedia capsules
- Set an exact unlock/delivery date
- Choose recipients (self, others, or public)
- Trust that messages remain sealed until the chosen date

---

## 2. Target Audience

| Segment | Use Case |
|---|---|
| Individuals | Messages to their future self |
| Parents | Letters to their children for future milestones |
| Couples | Anniversary or relationship milestone messages |
| Teachers / Mentors | Notes to students to be opened after graduation |
| Organizations | Corporate time capsules for company milestones |
| Content Creators | Public capsules for community engagement |

---

## 3. Core Features

### 3.1 User Authentication & Profiles
- User registration and login (JWT-based auth)
- OAuth login (Google)
- Profile management (avatar, bio, display name)
- Email verification on signup
- Password reset via email

### 3.2 Capsule Creation
- Rich text editor (bold, italic, headings, lists, emojis)
- Media attachments: images, audio recordings, video clips, documents
- Multiple recipients (email-based, registered users, or self)
- Capsule title, description, and cover image
- Tags / categories (e.g., personal, family, professional)
- Draft saving (auto-save)

### 3.3 Scheduled Delivery System
- Date & time picker for unlock date (minimum: 1 day in future)
- Delivery modes:
  - **Email delivery** — send capsule content via email at unlock time
  - **In-app unlock** — capsule becomes viewable on the platform at the set date
  - **Both** — email + in-app notification
- Recurring capsules (e.g., "every year on this date")
- Timezone-aware scheduling

### 3.4 Capsule Privacy & Access Control
- **Private** — only creator and named recipients can access
- **Shared** — recipients can view and react
- **Public** — visible to all users after unlock date
- Password protection option for extra security
- Capsule sealing — once submitted, content is locked and cannot be edited

### 3.5 Dashboard & Capsule Management
- "My Capsules" view with status: Draft / Sealed / Delivered
- Countdown timer for each sealed capsule
- Inbox: capsules received from others
- Search and filter by tag, date, status
- Delete drafts (sealed capsules cannot be deleted)

### 3.6 Notifications
- Email notifications: capsule created, capsule delivered, capsule received
- In-app notifications (bell icon)
- Reminder email 7 days before an upcoming unlock

### 3.7 Public Capsule Feed (Optional / V2)
- Browse public capsules from the community
- Like, comment, and share reactions
- Featured capsules curated by admins

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router v6, Tailwind CSS |
| State Management | Redux Toolkit or Zustand |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT (Access + Refresh tokens), bcryptjs |
| File Storage | Cloudinary (images/video) or AWS S3 |
| Email Service | Brevo REST API (axios) |
| Job Scheduling | node-cron or Agenda.js (MongoDB-backed) |
| Deployment | Vercel (Frontend), Render / Railway (Backend), MongoDB Atlas |

### 4.2 High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                  CLIENT                      │
│         React.js + Tailwind CSS             │
│   (Capsule UI, Dashboard, Auth Pages)       │
└────────────────────┬────────────────────────┘
                     │ REST API (JSON)
                     ▼
┌─────────────────────────────────────────────┐
│               BACKEND SERVER                │
│          Node.js + Express.js               │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Auth APIs │  │Capsule   │  │Scheduler │  │
│  │/register │  │APIs      │  │(cron job)│  │
│  │/login    │  │/create   │  │          │  │
│  │/refresh  │  │/view     │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────┬─────────────┬──────────────┬─────────┘
       │             │              │
       ▼             ▼              ▼
  MongoDB Atlas  Cloudinary /   Brevo API
  (Data Store)   AWS S3         (Email)
                 (Media)        
```

### 4.3 Database Schema (MongoDB)

#### `users` Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "passwordHash": "string",
  "avatar": "string (URL)",
  "isVerified": "boolean",
  "createdAt": "Date"
}
```

#### `capsules` Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": "string (rich HTML)",
  "coverImage": "string (URL)",
  "media": ["string (URLs)"],
  "tags": ["string"],
  "creator": "ObjectId (ref: users)",
  "recipients": [
    { "email": "string", "userId": "ObjectId (optional)" }
  ],
  "unlockDate": "Date",
  "deliveryMode": "email | in-app | both",
  "privacy": "private | shared | public",
  "passwordHash": "string (optional)",
  "status": "draft | sealed | delivered",
  "isRecurring": "boolean",
  "recurringInterval": "yearly | null",
  "createdAt": "Date",
  "deliveredAt": "Date"
}
```

#### `notifications` Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "message": "string",
  "type": "capsule_received | capsule_delivered | reminder",
  "isRead": "boolean",
  "capsuleId": "ObjectId (ref: capsules)",
  "createdAt": "Date"
}
```

---

## 5. API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login and receive tokens |
| POST | `/logout` | Invalidate refresh token |
| POST | `/refresh` | Get new access token |
| GET | `/me` | Get current user profile |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password with token |

### Capsule Routes (`/api/capsules`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a new capsule (draft or seal) |
| GET | `/` | Get all capsules by current user |
| GET | `/:id` | Get a single capsule by ID |
| PUT | `/:id` | Update a draft capsule |
| DELETE | `/:id` | Delete a draft capsule |
| POST | `/:id/seal` | Seal a draft capsule |
| GET | `/inbox` | Get capsules received by user |
| GET | `/public` | Get public capsules (post-unlock) |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all notifications for user |
| PATCH | `/:id/read` | Mark notification as read |
| DELETE | `/:id` | Delete a notification |

---

## 6. Frontend Pages & Components

### Pages
| Page | Route | Description |
|---|---|---|
| Landing Page | `/` | Product intro, CTA, features |
| Register | `/register` | Sign up form |
| Login | `/login` | Login form |
| Dashboard | `/dashboard` | Overview: my capsules, inbox, stats |
| Create Capsule | `/capsule/new` | Multi-step capsule creation form |
| View Capsule | `/capsule/:id` | View sealed/delivered capsule |
| Edit Capsule | `/capsule/:id/edit` | Edit draft capsule |
| Inbox | `/inbox` | Capsules received from others |
| Public Feed | `/explore` | Browse public capsules |
| Profile | `/profile` | User profile and settings |
| 404 | `*` | Not found page |

### Key Components
- `CapsuleCard` — display capsule with countdown
- `RichTextEditor` — content editor (Quill.js or TipTap)
- `MediaUploader` — drag-and-drop file upload
- `CountdownTimer` — live countdown to unlock
- `RecipientSelector` — add recipients by email/username
- `DateTimePicker` — unlock date selection with timezone support
- `NotificationBell` — real-time in-app notifications
- `CapsuleStatusBadge` — Draft / Sealed / Delivered

---

## 7. Scheduling & Delivery Logic

The scheduler runs as a background cron job in the Node.js server:

```
Every 1 minute (or 1 hour for production):
  1. Query MongoDB for capsules where:
     - status == "sealed"
     - unlockDate <= now()
     - deliveredAt == null

  2. For each matched capsule:
     a. If deliveryMode includes "email":
        → Send formatted email to all recipients via Brevo API
     b. If deliveryMode includes "in-app":
        → Create notification documents for each recipient
        → Update capsule status to "delivered"
     c. Mark capsule as delivered (deliveredAt = now())
     d. If isRecurring:
        → Clone capsule with unlockDate += 1 year, status = "sealed"
```

---

## 8. Security Considerations

- All passwords hashed using **bcryptjs** (salt rounds: 12)
- JWT access tokens expire in **15 minutes**; refresh tokens in **7 days**
- Capsule content encrypted at rest in MongoDB (field-level encryption optional)
- Rate limiting on auth routes (express-rate-limit)
- Input sanitization to prevent XSS (DOMPurify on frontend, sanitize-html on backend)
- Media file type validation (whitelist: jpg, png, gif, mp4, mp3, pdf)
- HTTPS enforced in production
- CORS configured to allow only the frontend origin

---

## 9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page Load Time | < 2 seconds (LCP) |
| API Response Time | < 500ms for 95th percentile |
| Uptime | 99.5% |
| Email Delivery Accuracy | 99%+ (no missed deliveries) |
| Scalability | Handle 10,000 capsules/month at launch |
| Mobile Responsiveness | Fully responsive (320px – 2560px) |
| Accessibility | WCAG 2.1 AA compliance |

---

## 10. Development Phases & Milestones

### Phase 1 — Foundation (Weeks 1–2)
- [ ] Project setup (Vite + React, Express server, MongoDB Atlas)
- [ ] User authentication (register, login, JWT, refresh tokens)
- [ ] Email verification flow
- [ ] Basic routing and protected routes

### Phase 2 — Core Features (Weeks 3–5)
- [ ] Capsule creation (rich text editor, media upload)
- [ ] Capsule sealing and status management
- [ ] Dashboard with capsule list and countdown timers
- [ ] Recipient management

### Phase 3 — Delivery System (Week 6)
- [ ] Cron job for scheduled delivery
- [ ] Email notification on delivery (Brevo API)
- [ ] In-app notification system
- [ ] Inbox for received capsules

### Phase 4 — Polish & Advanced (Weeks 7–8)
- [ ] Public capsule feed
- [ ] Password-protected capsules
- [ ] Recurring capsule support
- [ ] 7-day reminder emails
- [ ] Profile management
- [ ] Mobile responsiveness pass

### Phase 5 — Testing & Deployment (Week 9)
- [ ] Unit tests (Jest, React Testing Library)
- [ ] API integration tests (Supertest)
- [ ] Deployment to Vercel + Render + MongoDB Atlas
- [ ] Performance audit (Lighthouse)
- [ ] Security audit

---

## 11. Out of Scope (V1)

- Native mobile apps (iOS/Android)
- Real-time chat or collaboration
- Blockchain-based sealing/verification
- Paid subscription tiers
- Video calling integrations

---

## 12. Success Metrics

| Metric | Goal (3 months post-launch) |
|---|---|
| Registered Users | 500+ |
| Capsules Created | 2,000+ |
| Capsules Delivered | 200+ |
| Email Open Rate | > 40% |
| DAU/MAU Ratio | > 20% |
| Avg. Session Duration | > 4 minutes |

---

## 13. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Email not delivered (spam filters) | Medium | Use verified Brevo API, SPF/DKIM records |
| Server downtime causes missed deliveries | Low | Use persistent Agenda.js job queue backed by MongoDB |
| Media storage costs exceed budget | Medium | Set file size limits (max 10MB/capsule), use Cloudinary free tier |
| Users lose access to account | Medium | Strong password reset flow, optional 2FA in V2 |
| Capsule content accidentally deleted | Low | Soft deletes only; permanent delete only for drafts |

---

## 14. Appendix

### Recommended NPM Packages

**Backend:**
- `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`
- `axios` (for Brevo API)
- `node-cron` or `agenda`
- `multer` (file uploads), `cloudinary`
- `express-rate-limit`, `helmet`, `cors`
- `dotenv`, `express-validator`

**Frontend:**
- `react`, `react-router-dom`, `axios`
- `@tiptap/react` or `react-quill` (rich text editor)
- `react-datepicker`, `date-fns`
- `react-dropzone` (media upload)
- `zustand` or `@reduxjs/toolkit`
- `tailwindcss`, `lucide-react`
- `react-hot-toast` (notifications)

---

*This document is a living specification. Updates should be versioned and reviewed by the development team before implementation.*