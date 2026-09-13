import React, { useState } from 'react';
import { Database, Copy, Check, Key, Link2, FileCode, Server, Shield } from 'lucide-react';

export const DatabaseSchemaExplorer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'diagram' | 'ddl' | 'integrity'>('diagram');

  const fullSqlDdl = `-- =========================================================================
-- ParikshVision: Enterprise Exam Monitoring System (EMS) PostgreSQL Schema
-- Fully Relational Schema with Constraints, Indexes, and Integrity Rules
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enumerated Types
CREATE TYPE user_role_enum AS ENUM ('STUDENT', 'PROCTOR', 'TEACHER', 'ADMIN');
CREATE TYPE exam_attempt_status_enum AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED', 'DISQUALIFIED');
CREATE TYPE incident_type_enum AS ENUM (
    'TAB_SWITCH',
    'PHONE_DETECTED',
    'MULTIPLE_PERSONS',
    'FACE_MISSING',
    'UNUSUAL_HEAD_MOVEMENT',
    'HARDWARE_DISCONNECT',
    'SUSPICIOUS_AUDIO'
);
CREATE TYPE session_status_enum AS ENUM ('ACTIVE', 'PAUSED', 'TERMINATED', 'COMPLETED');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    roll_number VARCHAR(50) UNIQUE,
    reference_photo_url TEXT,
    face_encoding JSONB, -- Stored facial landmarks vector for 1:1 verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    instructor_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) 
        REFERENCES users(id) ON DELETE RESTRICT
);

-- 4. Questions Table (Bank & Exam Associations)
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    code_language VARCHAR(50),
    question_type VARCHAR(50) DEFAULT 'MCQ',
    options JSONB NOT NULL, -- Array of { id: 'A', text: '...' }
    correct_option CHAR(1) NOT NULL,
    correct_marks NUMERIC(4, 2) NOT NULL DEFAULT 4.00,
    negative_marks NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_correct_option CHECK (correct_option IN ('A', 'B', 'C', 'D'))
);

-- 5. ExamAttempts Table
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    status exam_attempt_status_enum NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    total_score NUMERIC(6, 2),
    client_ip VARCHAR(45) NOT NULL,
    idempotent_token UUID UNIQUE NOT NULL,
    answers JSONB DEFAULT '{}'::jsonb, -- Key-value map of questionId -> selectedOption
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempts_student FOREIGN KEY (student_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempts_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE RESTRICT
);

-- 6. ProctoringSessions Table
CREATE TABLE proctoring_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_attempt_id UUID UNIQUE NOT NULL,
    student_id UUID NOT NULL,
    assigned_proctor_id UUID,
    status session_status_enum NOT NULL DEFAULT 'ACTIVE',
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    tab_switch_count INTEGER NOT NULL DEFAULT 0,
    webcam_stream_active BOOLEAN NOT NULL DEFAULT true,
    screen_recording_url TEXT,
    hardware_fingerprint JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proctor_attempt FOREIGN KEY (exam_attempt_id) 
        REFERENCES exam_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_proctor_student FOREIGN KEY (student_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_proctor_assigned FOREIGN KEY (assigned_proctor_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- 7. AnalyticalLogs Table (Immutable Malpractice & Telemetry Events)
CREATE TABLE analytical_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    incident_type incident_type_enum NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    snapshot_evidence_url TEXT,
    event_payload JSONB NOT NULL,
    reviewed_by_proctor_id UUID,
    is_disconfirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_session FOREIGN KEY (session_id) 
        REFERENCES proctoring_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_reviewer FOREIGN KEY (reviewed_by_proctor_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Performance Indexes
CREATE INDEX idx_questions_course ON questions(course_id);
CREATE INDEX idx_attempts_student ON exam_attempts(student_id);
CREATE INDEX idx_proctor_sessions_attempt ON proctoring_sessions(exam_attempt_id);
CREATE INDEX idx_analytical_logs_session ON analytical_logs(session_id);
CREATE INDEX idx_analytical_logs_timestamp ON analytical_logs(timestamp DESC);
CREATE INDEX idx_attempts_status ON exam_attempts(status);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSqlDdl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tables = [
    {
      name: 'users',
      purpose: 'Authentication, candidate registration, and RBAC roles (Student, Proctor, Teacher, Admin).',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'email', type: 'VARCHAR(255) UNIQUE', key: '' },
        { name: 'full_name', type: 'VARCHAR(150)', key: '' },
        { name: 'role', type: 'user_role_enum', key: '' },
        { name: 'roll_number', type: 'VARCHAR(50) UNIQUE', key: '' },
        { name: 'reference_photo_url', type: 'TEXT', key: '' },
        { name: 'face_encoding', type: 'JSONB (Facial Vectors)', key: '' },
      ],
      foreignKeys: [],
    },
    {
      name: 'courses',
      purpose: 'Course module definitions, paper codes, and teacher associations.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'course_code', type: 'VARCHAR(30) UNIQUE', key: '' },
        { name: 'title', type: 'VARCHAR(200)', key: '' },
        { name: 'instructor_id', type: 'UUID', key: 'FK -> users.id' },
      ],
      foreignKeys: ['instructor_id -> users(id)'],
    },
    {
      name: 'questions',
      purpose: 'Dynamic question delivery, options validation, and code stimulus storage.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'course_id', type: 'UUID', key: 'FK -> courses.id' },
        { name: 'section_name', type: 'VARCHAR(100)', key: '' },
        { name: 'question_text', type: 'TEXT', key: '' },
        { name: 'options', type: 'JSONB', key: '' },
        { name: 'correct_option', type: 'CHAR(1)', key: 'CHECK IN (A,B,C,D)' },
        { name: 'correct_marks', type: 'NUMERIC(4,2)', key: '' },
        { name: 'negative_marks', type: 'NUMERIC(4,2)', key: '' },
      ],
      foreignKeys: ['course_id -> courses(id) ON DELETE CASCADE'],
    },
    {
      name: 'exam_attempts',
      purpose: 'Session attempts, immutable submission state, and idempotent submission protection.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'student_id', type: 'UUID', key: 'FK -> users.id' },
        { name: 'course_id', type: 'UUID', key: 'FK -> courses.id' },
        { name: 'status', type: 'exam_attempt_status_enum', key: '' },
        { name: 'idempotent_token', type: 'UUID UNIQUE', key: '' },
        { name: 'answers', type: 'JSONB', key: '' },
        { name: 'total_score', type: 'NUMERIC(6,2)', key: '' },
      ],
      foreignKeys: ['student_id -> users(id)', 'course_id -> courses(id)'],
    },
    {
      name: 'proctoring_sessions',
      purpose: 'Live monitoring state, WebSocket risk score (0-100), and tab switch count.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'exam_attempt_id', type: 'UUID UNIQUE', key: 'FK -> exam_attempts.id' },
        { name: 'student_id', type: 'UUID', key: 'FK -> users.id' },
        { name: 'assigned_proctor_id', type: 'UUID', key: 'FK -> users.id' },
        { name: 'risk_score', type: 'INTEGER (0-100)', key: '' },
        { name: 'tab_switch_count', type: 'INTEGER', key: '' },
        { name: 'screen_recording_url', type: 'TEXT', key: '' },
      ],
      foreignKeys: ['exam_attempt_id -> exam_attempts(id)', 'assigned_proctor_id -> users(id)'],
    },
    {
      name: 'analytical_logs',
      purpose: 'Immutable audit records of all AI/hardware anomalies (Phone, Gaze, Tab-switch).',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', key: 'PK' },
        { name: 'session_id', type: 'UUID', key: 'FK -> proctoring_sessions.id' },
        { name: 'incident_type', type: 'incident_type_enum', key: '' },
        { name: 'confidence_score', type: 'NUMERIC(5,2)', key: '' },
        { name: 'snapshot_evidence_url', type: 'TEXT', key: '' },
        { name: 'event_payload', type: 'JSONB', key: '' },
        { name: 'reviewed_by_proctor_id', type: 'UUID', key: 'FK -> users.id' },
      ],
      foreignKeys: ['session_id -> proctoring_sessions(id) ON DELETE CASCADE'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-[#f8f9ff]">
      {/* Header Banner */}
      <div className="bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-[#0051d5]" />
            <h1 className="text-lg font-bold text-[#0b1c30]">
              ParikshVision PostgreSQL Database Schema & Relational Architecture
            </h1>
          </div>
          <p className="text-xs text-[#45464d] mt-1">
            Exhaustive relational model with 6 core entities: Users, Courses, Questions, ProctoringSessions, AnalyticalLogs, and ExamAttempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied SQL DDL!' : 'Copy SQL DDL'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveSchemaTab('diagram')}
          className={`text-xs px-3.5 py-2 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[40px] ${
            activeSchemaTab === 'diagram' ? 'bg-[#000000] text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Entity Relationship Grid
        </button>
        <button
          onClick={() => setActiveSchemaTab('ddl')}
          className={`text-xs px-3.5 py-2 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[40px] ${
            activeSchemaTab === 'ddl' ? 'bg-[#000000] text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          PostgreSQL DDL Code
        </button>
        <button
          onClick={() => setActiveSchemaTab('integrity')}
          className={`text-xs px-3.5 py-2 rounded-md font-bold transition-colors shrink-0 cursor-pointer min-h-[40px] ${
            activeSchemaTab === 'integrity' ? 'bg-[#000000] text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Integrity & Foreign Keys
        </button>
      </div>

      {/* Tab 1: Entity Cards */}
      {activeSchemaTab === 'diagram' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t.name} className="bg-white rounded-lg p-4 shadow-xs border border-[#e2e8f0] flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono font-bold text-xs text-[#0051d5] flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" />
                  {t.name}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {t.columns.length} columns
                </span>
              </div>

              <p className="text-[11px] text-[#45464d]">{t.purpose}</p>

              <div className="space-y-1 pt-1 border-t border-slate-100 text-xs font-mono">
                {t.columns.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[11px] py-0.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      {c.key.includes('PK') && <Key className="w-3 h-3 text-amber-500" />}
                      {c.key.includes('FK') && <Link2 className="w-3 h-3 text-blue-500" />}
                      {c.name}
                    </span>
                    <span className="text-slate-500 text-[10px] truncate max-w-[130px]">{c.type}</span>
                  </div>
                ))}
              </div>

              {t.foreignKeys.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Relational Links:</span>
                  {t.foreignKeys.map((fk) => (
                    <div key={fk} className="text-[10px] text-blue-600 font-mono">
                      ↳ {fk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: DDL Code */}
      {activeSchemaTab === 'ddl' && (
        <div className="bg-[#131b2e] rounded-lg p-5 shadow-lg border border-slate-700 overflow-x-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-slate-300 text-xs font-mono">
            <span>parikshvision_schema.sql (PostgreSQL 15+)</span>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-400 hover:text-white font-bold cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy All'}
            </button>
          </div>
          <pre className="text-slate-200 text-xs font-mono pt-3 leading-relaxed">
            <code>{fullSqlDdl}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Integrity Constraints */}
      {activeSchemaTab === 'integrity' && (
        <div className="bg-white rounded-lg p-6 shadow-xs border border-[#e2e8f0] space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0051d5]" />
            Relational Integrity & Foreign Key Topology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#eff4ff] p-4 rounded-md border border-[#d3e4fe] space-y-2">
              <span className="font-bold text-[#0051d5] block text-xs">1. Idempotent Submission Guard</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                The <code className="bg-white px-1 py-0.5 rounded font-bold font-mono">exam_attempts.idempotent_token</code> column enforces a <code className="font-mono">UNIQUE</code> constraint. If a candidate double-clicks or experiences flaky internet reconnects, duplicate submissions are rejected at the database engine level.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-md border border-[#d3e4fe] space-y-2">
              <span className="font-bold text-[#0051d5] block text-xs">2. Cascade Deletions & Audit Ledger</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                When a session is created, <code className="bg-white px-1 py-0.5 rounded font-bold font-mono">proctoring_sessions</code> strictly links to <code className="font-mono">exam_attempts</code> via 1:1 foreign key. Malpractice incidents in <code className="font-mono">analytical_logs</code> link via <code className="font-mono">ON DELETE CASCADE</code>, while human reviewer IDs use <code className="font-mono">ON DELETE SET NULL</code> for forensic integrity.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-md border border-[#d3e4fe] space-y-2">
              <span className="font-bold text-[#0051d5] block text-xs">3. Options & Check Constraints</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                The <code className="bg-white px-1 py-0.5 rounded font-bold font-mono">questions.correct_option</code> has a database-level <code className="font-mono">CHECK (correct_option IN ('A','B','C','D'))</code> constraint, preventing arbitrary or missing keys.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-md border border-[#d3e4fe] space-y-2">
              <span className="font-bold text-[#0051d5] block text-xs">4. High-Performance Indexing Strategy</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                B-Tree indexes on <code className="font-mono">session_id</code> and <code className="font-mono">timestamp DESC</code> enable sub-millisecond cursor pagination when rendering high-frequency WebSocket incident streams in the Examiner Dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
