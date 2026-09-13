export enum UserRole {
  STUDENT = 'STUDENT',
  PROCTOR = 'PROCTOR',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export enum QuestionStatus {
  ANSWERED = 'ANSWERED',
  NOT_ANSWERED = 'NOT_ANSWERED',
  MARKED_FOR_REVIEW = 'MARKED_FOR_REVIEW',
  NOT_VISITED = 'NOT_VISITED',
}

export enum IncidentType {
  TAB_SWITCH = 'TAB_SWITCH',
  PHONE_DETECTED = 'PHONE_DETECTED',
  MULTIPLE_PERSONS = 'MULTIPLE_PERSONS',
  FACE_MISSING = 'FACE_MISSING',
  UNUSUAL_HEAD_MOVEMENT = 'UNUSUAL_HEAD_MOVEMENT',
  HARDWARE_DISCONNECT = 'HARDWARE_DISCONNECT',
  SUSPICIOUS_AUDIO = 'SUSPICIOUS_AUDIO',
}

export enum CandidateStatus {
  ACTIVE = 'ACTIVE',
  WARNING = 'WARNING',
  FLAGGED = 'FLAGGED',
  TERMINATED = 'TERMINATED',
  SUBMITTED = 'SUBMITTED',
}

export interface OptionChoice {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  isCode?: boolean;
}

export interface Question {
  id: number;
  section: string; // 'Section A: Distributed Systems Core' | 'Section B: System Architecture & Concurrency'
  title: string;
  type: string; // 'Multi-Choice Single Correct (MCQ)'
  correctMarks: number;
  negativeMarks: number;
  prompt: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  subPrompt?: string;
  options: OptionChoice[];
  correctOption: string;
  userSelectedOption?: string;
  status: QuestionStatus;
}

export interface MalpracticeIncident {
  id: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
  type: IncidentType;
  confidence: number;
  details: string;
  evidenceSnapshotUrl: string;
  blurCount?: number;
  reviewed: boolean;
}

export interface CandidateSession {
  id: string;
  rollNumber: string;
  name: string;
  avatarUrl: string;
  paperCode: string;
  status: CandidateStatus;
  riskScore: number; // 0 - 100
  tabSwitchCount: number;
  faceConfidence: number;
  webcamActive: boolean;
  micActive: boolean;
  screenRecordingActive: boolean;
  lastPingMs: number;
  gazeDeviation: string;
  currentQuestion: number;
  answeredCount: number;
  incidents: MalpracticeIncident[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  role: UserRole;
  action: string;
  entity: string;
  ipAddress: string;
  hash: string;
  status: 'SUCCESS' | 'VIOLATION' | 'WARNING';
}

export interface ExamMetadata {
  id: string;
  title: string;
  code: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  stationNode: string;
  clientLatency: string;
}

export type MoodleStep = 'login' | 'dashboard' | 'course' | 'pre-exam' | 'exam';

export interface CourseMaterial {
  id: string;
  type: 'announcement' | 'quiz' | 'file' | 'assignment' | 'forum' | 'url';
  title: string;
  description?: string;
  dueDate?: string;
  quizId?: string;
  completed?: boolean;
  fileSize?: string;
}

export interface CourseTopic {
  id: string;
  title: string;
  summary?: string;
  items: CourseMaterial[];
}

export interface Course {
  id: string;
  code: string;
  shortname: string;
  fullName: string;
  category: string;
  progress: number;
  geometricPattern: 'triangles' | 'circles' | 'hexagons' | 'stripes' | 'grid';
  colorTone: string;
  summary: string;
  instructor: string;
  topics: CourseTopic[];
}

export interface QuizDetail {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  attemptsAllowed: number;
  gradingMethod: string;
  instructions: string[];
  dueDate: string;
  securityMode: 'Secure Browser' | 'Proctored' | 'Standard';
  questions: Question[];
}

export interface SystemReadinessState {
  webcamGranted: boolean;
  micGranted: boolean;
  screenShareGranted: boolean;
  networkLatencyMs: number;
  batteryLevel: number;
  browserVersionValid: boolean;
  photoVerified: boolean;
  fullscreenActive: boolean;
  rulesConsented: boolean;
}
