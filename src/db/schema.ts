import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('student'),
  rollNumber: text('roll_number'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const examSessions = pgTable('exam_sessions', {
  id: serial('id').primaryKey(),
  rollNumber: text('roll_number').notNull(),
  candidateName: text('candidate_name').notNull(),
  paperCode: text('paper_code').notNull(),
  status: text('status').notNull(),
  riskScore: integer('risk_score').default(0),
  tabSwitches: integer('tab_switches').default(0),
  score: integer('score').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const malpracticeIncidents = pgTable('malpractice_incidents', {
  id: serial('id').primaryKey(),
  rollNumber: text('roll_number').notNull(),
  candidateName: text('candidate_name').notNull(),
  incidentType: text('incident_type').notNull(),
  details: text('details').notNull(),
  confidence: text('confidence').default('95.0'),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  userEmail: text('user_email').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  hash: text('hash').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const googleSheetsExports = pgTable('google_sheets_exports', {
  id: serial('id').primaryKey(),
  spreadsheetId: text('spreadsheet_id').notNull(),
  spreadsheetUrl: text('spreadsheet_url').notNull(),
  sheetTitle: text('sheet_title').notNull(),
  exportedBy: text('exported_by').notNull(),
  rowCount: integer('row_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
