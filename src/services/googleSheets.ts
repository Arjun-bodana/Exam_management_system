import { getAccessToken, googleSignIn } from '../lib/firebase';
import { AuditLogEntry, CandidateSession, Question } from '../types';

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowCount: number;
}

async function ensureAccessToken(): Promise<string> {
  let token = await getAccessToken();
  if (!token) {
    const res = await googleSignIn();
    if (!res || !res.accessToken) {
      throw new Error('Google authentication required to access Google Sheets.');
    }
    token = res.accessToken;
  }
  return token;
}

/**
 * Creates a formatted Google Spreadsheet and populates it with headers and data rows.
 */
export async function createGoogleSpreadsheet(
  title: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<ExportResult> {
  const token = await ensureAccessToken();

  // 1. Create Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Audit & Records',
            gridProperties: {
              rowCount: Math.max(rows.length + 10, 100),
              columnCount: headers.length + 2,
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    const errText = await createResponse.text();
    throw new Error(`Failed to create spreadsheet: ${errText}`);
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Append header and rows
  const allValues = [headers, ...rows];
  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Audit & Records'!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );

  if (!appendResponse.ok) {
    const appendErr = await appendResponse.text();
    console.warn('Append response warning:', appendErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowCount: rows.length,
  };
}

/**
 * Export audit logs to Google Sheets
 */
export async function exportAuditLogsToGoogleSheets(logs: AuditLogEntry[]): Promise<ExportResult> {
  const headers = ['Log ID', 'Timestamp (UTC)', 'User Email', 'System Role', 'Security Action', 'Entity Target', 'IP Address', 'SHA-256 Hash', 'Status'];
  const rows = logs.map((log) => [
    log.id,
    log.timestamp,
    log.userEmail,
    log.role,
    log.action,
    log.entity,
    log.ipAddress,
    log.hash,
    log.status,
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const title = `ParikshVision Audit Ledger (${timestamp})`;
  return createGoogleSpreadsheet(title, headers, rows);
}

/**
 * Export exam candidates and oversight results to Google Sheets
 */
export async function exportCandidatesToGoogleSheets(candidates: CandidateSession[]): Promise<ExportResult> {
  const headers = ['Roll Number', 'Candidate Name', 'Paper Code', 'Status', 'Risk Score', 'Tab Switches', 'Total Violations'];
  const rows = candidates.map((c) => [
    c.rollNumber,
    c.name,
    c.paperCode,
    c.status,
    c.riskScore,
    c.tabSwitchCount,
    c.incidents?.length || 0,
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const title = `ParikshVision Exam Cohort Roster - CS543 (${timestamp})`;
  return createGoogleSpreadsheet(title, headers, rows);
}

/**
 * Export student examination summary and question answers to Google Sheets
 */
export async function exportStudentExamReportToGoogleSheets(
  candidate: CandidateSession,
  questions: Question[]
): Promise<ExportResult> {
  const headers = ['Question #', 'Subject Section', 'Question Prompt', 'Candidate Answer', 'Correct Answer', 'Status', 'Marks Awarded'];
  const rows = questions.map((q) => [
    q.id,
    q.section,
    q.prompt.slice(0, 100),
    q.userSelectedOption ? `Option ${q.userSelectedOption}` : 'Unanswered',
    `Option ${q.correctOption}`,
    q.status,
    q.userSelectedOption === q.correctOption ? q.correctMarks : q.userSelectedOption ? -q.negativeMarks : 0,
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const title = `Exam Submission Report - ${candidate.name} (${candidate.rollNumber}) - ${timestamp}`;
  return createGoogleSpreadsheet(title, headers, rows);
}
