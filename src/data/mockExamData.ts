import { CandidateSession, CandidateStatus, IncidentType, MalpracticeIncident, Question, QuestionStatus, AuditLogEntry, UserRole } from '../types';

export const INITIAL_CANDIDATE_ARJUN: CandidateSession = {
  id: '20251651029',
  rollNumber: '20251651029',
  name: 'Arjun Bodana',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGiaP_OofAlwIWcctK6Vzl3jz9Z9KsQgMPuzufKg0VRhi_8epuH96RGpB2wRP83ZKVEV0yIggQ945M7bNcIPL2yZDO-0bHwkdaAfcydPQ5m3ZGVdniLk-KeudeH2KMBdVvc8wjx_zr6TA6eIpKSN9tXnj7s2XkiKb4MPhoFs41URUnmfog7Y3KlAaJqVSM-f0YQzBhsdYVGbnUg5NcGPwtTlbCMDJvfKWV-JJyXEDejRTR6p-Rw6g',
  paperCode: 'CS543 Web Services',
  status: CandidateStatus.ACTIVE,
  riskScore: 28,
  tabSwitchCount: 1,
  faceConfidence: 99.4,
  webcamActive: true,
  micActive: true,
  screenRecordingActive: true,
  lastPingMs: 11.8,
  gazeDeviation: '0.02° LOCKED',
  currentQuestion: 25,
  answeredCount: 24,
  incidents: [
    {
      id: 'SEC-VIOLATION-04928-E',
      candidateId: '20251651029',
      candidateName: 'Arjun Bodana',
      timestamp: '10:17:42 UTC',
      type: IncidentType.TAB_SWITCH,
      confidence: 98.5,
      details: 'Tab switching, split-screen action, or loss of window focus detected via Page Visibility API.',
      evidenceSnapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGiaP_OofAlwIWcctK6Vzl3jz9Z9KsQgMPuzufKg0VRhi_8epuH96RGpB2wRP83ZKVEV0yIggQ945M7bNcIPL2yZDO-0bHwkdaAfcydPQ5m3ZGVdniLk-KeudeH2KMBdVvc8wjx_zr6TA6eIpKSN9tXnj7s2XkiKb4MPhoFs41URUnmfog7Y3KlAaJqVSM-f0YQzBhsdYVGbnUg5NcGPwtTlbCMDJvfKWV-JJyXEDejRTR6p-Rw6g',
      blurCount: 1,
      reviewed: false,
    },
  ],
};

export const INITIAL_CANDIDATES: CandidateSession[] = [
  INITIAL_CANDIDATE_ARJUN,
  {
    id: 'cand-02',
    rollNumber: 'IND-2025-98242',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    paperCode: 'CS543 Web Services',
    status: CandidateStatus.ACTIVE,
    riskScore: 12,
    tabSwitchCount: 0,
    faceConfidence: 99.8,
    webcamActive: true,
    micActive: true,
    screenRecordingActive: true,
    lastPingMs: 14.2,
    gazeDeviation: '0.01° LOCKED',
    currentQuestion: 31,
    answeredCount: 29,
    incidents: [],
  },
  {
    id: 'cand-03',
    rollNumber: 'IND-2025-98243',
    name: 'Rohan Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    paperCode: 'CS-804 Adv. Distributed Systems',
    status: CandidateStatus.WARNING,
    riskScore: 78,
    tabSwitchCount: 2,
    faceConfidence: 81.2,
    webcamActive: true,
    micActive: true,
    screenRecordingActive: true,
    lastPingMs: 28.5,
    gazeDeviation: '3.40° OFF-CENTER',
    currentQuestion: 18,
    answeredCount: 14,
    incidents: [
      {
        id: 'SEC-VIOLATION-04930-P',
        candidateId: 'cand-03',
        candidateName: 'Rohan Verma',
        timestamp: '10:22:15 UTC',
        type: IncidentType.PHONE_DETECTED,
        confidence: 94.2,
        details: 'Secondary handheld mobile device detected in lower bounding quadrant (YOLOv8 confidence 0.94).',
        evidenceSnapshotUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80',
        blurCount: 2,
        reviewed: false,
      },
    ],
  },
  {
    id: 'cand-04',
    rollNumber: 'IND-2025-98244',
    name: 'Sneha Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    paperCode: 'CS543 Web Services',
    status: CandidateStatus.FLAGGED,
    riskScore: 92,
    tabSwitchCount: 3,
    faceConfidence: 62.4,
    webcamActive: true,
    micActive: true,
    screenRecordingActive: true,
    lastPingMs: 18.0,
    gazeDeviation: '8.10° EXTREME',
    currentQuestion: 9,
    answeredCount: 8,
    incidents: [
      {
        id: 'SEC-VIOLATION-04933-M',
        candidateId: 'cand-04',
        candidateName: 'Sneha Patel',
        timestamp: '10:29:40 UTC',
        type: IncidentType.MULTIPLE_PERSONS,
        confidence: 96.8,
        details: 'Secondary individual visible behind candidate field of view (MediaPipe FaceCount = 2).',
        evidenceSnapshotUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80',
        blurCount: 3,
        reviewed: false,
      },
    ],
  },
  {
    id: 'cand-05',
    rollNumber: 'IND-2025-98245',
    name: 'Vikram Singh',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    paperCode: 'CS-804 Adv. Distributed Systems',
    status: CandidateStatus.ACTIVE,
    riskScore: 8,
    tabSwitchCount: 0,
    faceConfidence: 99.5,
    webcamActive: true,
    micActive: true,
    screenRecordingActive: true,
    lastPingMs: 9.4,
    gazeDeviation: '0.00° LOCKED',
    currentQuestion: 44,
    answeredCount: 40,
    incidents: [],
  },
  {
    id: 'cand-06',
    rollNumber: 'IND-2025-98246',
    name: 'Ananya Iyer',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    paperCode: 'CS-804 Adv. Distributed Systems',
    status: CandidateStatus.WARNING,
    riskScore: 54,
    tabSwitchCount: 1,
    faceConfidence: 88.0,
    webcamActive: true,
    micActive: false,
    screenRecordingActive: true,
    lastPingMs: 33.1,
    gazeDeviation: '1.20° SLIGHT',
    currentQuestion: 21,
    answeredCount: 19,
    incidents: [
      {
        id: 'SEC-VIOLATION-04938-H',
        candidateId: 'cand-06',
        candidateName: 'Ananya Iyer',
        timestamp: '10:33:04 UTC',
        type: IncidentType.HARDWARE_DISCONNECT,
        confidence: 99.0,
        details: 'Microphone peripheral stream interrupted or muted via client interface.',
        evidenceSnapshotUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        blurCount: 1,
        reviewed: false,
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-99201',
    timestamp: '2026-09-12 10:15:00 UTC',
    userEmail: 'arjun.bodana@university.edu',
    role: UserRole.STUDENT,
    action: 'SESSION_INITIALIZED',
    entity: 'ExamAttempt #8920',
    ipAddress: '198.51.100.42',
    hash: 'SHA256:4a8b9f...e021',
    status: 'SUCCESS',
  },
  {
    id: 'AUD-99202',
    timestamp: '2026-09-12 10:15:22 UTC',
    userEmail: 'arjun.bodana@university.edu',
    role: UserRole.STUDENT,
    action: 'FULLSCREEN_ENTERED',
    entity: 'SystemReadiness',
    ipAddress: '198.51.100.42',
    hash: 'SHA256:7c3a11...b902',
    status: 'SUCCESS',
  },
  {
    id: 'AUD-99203',
    timestamp: '2026-09-12 10:17:42 UTC',
    userEmail: 'arjun.bodana@university.edu',
    role: UserRole.STUDENT,
    action: 'PAGE_BLUR_DETECTED',
    entity: 'PageVisibilityWatcher',
    ipAddress: '198.51.100.42',
    hash: 'SHA256:1f42cd...88a4',
    status: 'VIOLATION',
  },
  {
    id: 'AUD-99204',
    timestamp: '2026-09-12 10:20:10 UTC',
    userEmail: 'proctor.lead@secureexam.gov',
    role: UserRole.PROCTOR,
    action: 'ACKNOWLEDGE_INCIDENT',
    entity: 'SEC-VIOLATION-04928-E',
    ipAddress: '10.0.4.12',
    hash: 'SHA256:990efa...55c2',
    status: 'SUCCESS',
  },
  {
    id: 'AUD-99205',
    timestamp: '2026-09-12 10:22:15 UTC',
    userEmail: 'rohan.verma@university.edu',
    role: UserRole.STUDENT,
    action: 'AI_PHONE_DETECTED',
    entity: 'YOLOv8InferenceService',
    ipAddress: '203.0.113.88',
    hash: 'SHA256:bb401e...fa19',
    status: 'VIOLATION',
  },
];

// Helper to generate 60 questions with question 25 being the exact one from screenshot
export function generateExamQuestions(): Question[] {
  const questions: Question[] = [];

  for (let i = 1; i <= 60; i++) {
    const isSecA = i <= 20;
    const section = isSecA ? 'Section A: Distributed Systems Core' : 'Section B: System Architecture & Concurrency';

    if (i === 25) {
      questions.push({
        id: 25,
        section: 'Section B: System Architecture & Concurrency',
        title: 'Question 25',
        type: 'Multi-Choice Single Correct (MCQ)',
        correctMarks: 4.0,
        negativeMarks: 1.0,
        prompt:
          'Which consensus protocol mechanism is primarily responsible for preventing split-brain conditions and maintaining single-leader authority during an asymmetrical network partition?',
        options: [
          {
            id: 'A',
            text: 'Periodic leader heartbeat leases combined with majority quorum validation across active voting replicas.',
          },
          {
            id: 'B',
            text: 'Unsynchronized client gossip broadcasts that append conflicting state logs without term verification.',
          },
          {
            id: 'C',
            text: 'Round-robin DNS failover routing executed at edge ingress proxy gateways.',
          },
          {
            id: 'D',
            text: 'Optimistic local write-ahead log appending without two-phase commit verification.',
          },
        ],
        correctOption: 'A',
        userSelectedOption: 'A',
        status: QuestionStatus.ANSWERED,
      });
      continue;
    }

    // Assign status according to standard distribution: 24 answered (1-12, 15-24, 25), 2 marked review (13, 14), 34 not visited (26-60)
    let status = QuestionStatus.NOT_VISITED;
    let selectedOption: string | undefined = undefined;

    if (i < 13 || (i >= 15 && i <= 24)) {
      status = QuestionStatus.ANSWERED;
      selectedOption = ['A', 'B', 'C', 'D'][(i * 3) % 4];
    } else if (i === 13 || i === 14) {
      status = QuestionStatus.MARKED_FOR_REVIEW;
      selectedOption = 'A';
    }

    const topics = [
      'Byzantine Fault Tolerance (BFT) message complexity in PBFT',
      'Vector Clocks and causality detection in Dynamo-style stores',
      'Two-Phase Commit (2PC) coordinator crash recovery protocols',
      'Spanner TrueTime API bounded clock skew and uncertainty window',
      'Consistent Hashing ring replication factor and virtual nodes',
      'Chandy-Lamport distributed snapshot marker propagation',
      'CAP theorem trade-offs under asynchronous network partitions',
      'Paxos synod consensus leader election invariants',
    ];

    const topic = topics[(i - 1) % topics.length];

    questions.push({
      id: i,
      section,
      title: `Question ${i}`,
      type: 'Multi-Choice Single Correct (MCQ)',
      correctMarks: 4.0,
      negativeMarks: 1.0,
      prompt: `Regarding ${topic}: Analyze the primary system guarantee under edge-case network partitions, Byzantine failure thresholds, and latency bounds. Which assertion holds true under strict linearizability?`,
      options: [
        { id: 'A', text: `Invariants hold if at least 2f+1 non-faulty replicas actively reach consensus before timeout thresholds expire.` },
        { id: 'B', text: `Monotonic clock skew compensation eliminates all stale state reads without additional synchronization barriers.` },
        { id: 'C', text: `Write quorum W and Read quorum R must satisfy W + R > N to ensure strict read-your-writes consistency.` },
        { id: 'D', text: `Asynchronous replication degrades gracefully by guaranteeing eventual consistency without partition stalling.` },
      ],
      correctOption: 'C',
      userSelectedOption: selectedOption,
      status,
    });
  }

  return questions;
}
