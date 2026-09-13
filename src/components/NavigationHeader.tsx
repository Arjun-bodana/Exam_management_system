import React, { useState } from 'react';
import {
  ShieldCheck,
  Video,
  LayoutDashboard,
  Database,
  UserCheck,
  AlertTriangle,
  HelpCircle,
  Users,
  EyeOff,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  FileText,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavigationHeaderProps {
  activeTab: 'examroom' | 'proctor-dashboard' | 'readiness' | 'admin' | 'audit' | 'schema';
  setActiveTab: (tab: 'examroom' | 'proctor-dashboard' | 'readiness' | 'admin' | 'audit' | 'schema') => void;
  violationCount: number;
  onOpenViolationModal: () => void;
  currentRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onOpenGuidelines?: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  setActiveTab,
  violationCount,
  onOpenViolationModal,
  currentRole = UserRole.STUDENT,
  onChangeRole,
  onOpenGuidelines,
  onBack,
  canGoBack = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStudent = currentRole === UserRole.STUDENT;

  const handleSelectTab = (tab: 'examroom' | 'proctor-dashboard' | 'readiness' | 'admin' | 'audit' | 'schema') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (role: UserRole, defaultTab: 'examroom' | 'proctor-dashboard' | 'admin') => {
    onChangeRole?.(role);
    setActiveTab(defaultTab);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131b2e] text-[#ffffff] border-b border-[#3f465c]/40 shadow-sm">
      <div className="h-16 w-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand, Back Option & Institutional Cert */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {onBack && canGoBack && (
            <button
              onClick={onBack}
              id="globalHeaderBackButton"
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              title="Back to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86a8ff]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleSelectTab('examroom')}
            title="Go to Exam Room"
          >
            <div className="w-8 h-8 rounded-md bg-[#316bf3] flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[13px] sm:text-[14px] leading-tight font-black uppercase tracking-wider text-white">
                PARIKSHVISION
              </span>
              <span className="text-[9px] sm:text-[9.5px] leading-tight text-[#7c839b] tracking-widest uppercase font-semibold truncate">
                {isStudent ? 'STUDENT TERMINAL' : 'GOVERNANCE'}
              </span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#7c839b]/30 hidden xl:block"></div>

          {/* Privacy badge for students */}
          {isStudent ? (
            <div className="hidden xl:flex items-center gap-1.5 bg-[#000000]/40 px-3 py-1 rounded border border-[#3f465c]/30 text-emerald-400 text-[11px] font-medium">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Private Session: Only your video is monitored</span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 bg-[#000000]/40 px-3 py-1 rounded border border-[#3f465c]/30">
              <span className="text-[10px] text-[#dae2fd] uppercase tracking-wider font-semibold">
                CHIEF PROCTOR OVERSIGHT CONSOLE
              </span>
            </div>
          )}
        </div>

        {/* Center: Role-Sensitive Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {/* Always accessible to student: Exam Room */}
          <button
            onClick={() => handleSelectTab('examroom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'examroom'
                ? 'bg-[#000000]/70 text-white border border-[#316bf3]/50 shadow-inner'
                : 'text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#316bf3]" />
            <span>{isStudent ? 'My Exam Room' : 'Exam Simulation'}</span>
          </button>

          {/* Pre-Exam Diagnostics (Accessible to both) */}
          <button
            onClick={() => handleSelectTab('readiness')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'readiness'
                ? 'bg-[#000000]/70 text-white border border-[#316bf3]/50 shadow-inner'
                : 'text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{isStudent ? 'Camera Check' : 'System Readiness'}</span>
          </button>

          {/* Student Helper: Guidelines Modal */}
          {isStudent && (
            <button
              onClick={() => onOpenGuidelines?.()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Exam Rules & Tips</span>
            </button>
          )}

          {/* PROCTOR & ADMIN ONLY TABS - Hidden from student */}
          {!isStudent && (
            <>
              <button
                onClick={() => handleSelectTab('proctor-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'proctor-dashboard'
                    ? 'bg-[#000000]/70 text-white border border-[#316bf3]/50 shadow-inner'
                    : 'text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Examiner Live Dashboard</span>
              </button>

              <button
                onClick={() => handleSelectTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#000000]/70 text-white border border-[#316bf3]/50 shadow-inner'
                    : 'text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Exam & Questions</span>
              </button>

              <button
                onClick={() => handleSelectTab('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'schema'
                    ? 'bg-[#000000]/70 text-white border border-[#316bf3]/50 shadow-inner'
                    : 'text-[#7c839b] hover:text-white hover:bg-[#3f465c]/20'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>DB Schema</span>
              </button>
            </>
          )}
        </nav>

        {/* Right: Security pill, Role Switcher for Tester/Invigilator, and Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Violation warning button if any */}
          {violationCount > 0 && (
            <button
              onClick={onOpenViolationModal}
              className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] px-2 sm:px-2.5 py-1 rounded-md text-xs font-bold transition-colors animate-pulse cursor-pointer"
              title="Click to view Proctor Violation Warning Modal"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{violationCount} Violation{violationCount > 1 ? 's' : ''}</span>
              <span className="sm:hidden">{violationCount}</span>
            </button>
          )}

          {/* Desktop Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-[#0b1426] p-1 rounded-lg border border-[#3f465c]/50 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#7c839b] px-1.5 hidden xl:inline">
              Role:
            </span>
            <button
              onClick={() => handleRoleChange(UserRole.STUDENT, 'examroom')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentRole === UserRole.STUDENT
                  ? 'bg-[#316bf3] text-white shadow-xs'
                  : 'text-[#7c839b] hover:text-white'
              }`}
              title="Switch to Student / Candidate View"
            >
              <span>Student</span>
            </button>

            <button
              onClick={() => handleRoleChange(UserRole.PROCTOR, 'proctor-dashboard')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentRole === UserRole.PROCTOR
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#7c839b] hover:text-white'
              }`}
              title="Switch to Invigilator / Proctor View"
            >
              <span>Proctor</span>
            </button>

            <button
              onClick={() => handleRoleChange(UserRole.ADMIN, 'admin')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                currentRole === UserRole.ADMIN
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#7c839b] hover:text-white'
              }`}
              title="Switch to Administrator View"
            >
              <span>Admin</span>
            </button>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#3f465c]/30">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {isStudent ? 'Arjun Bodana' : currentRole === UserRole.PROCTOR ? 'INV-84920' : 'Dean of Exams'}
              </div>
              <div className="text-[10px] text-[#7c839b] leading-none uppercase font-semibold">
                {isStudent ? 'Candidate (20251651029)' : currentRole === UserRole.PROCTOR ? 'Chief Invigilator' : 'System Admin'}
              </div>
            </div>
            <img
              alt="Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#316bf3]/50"
              src={
                isStudent
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGiaP_OofAlwIWcctK6Vzl3jz9Z9KsQgMPuzufKg0VRhi_8epuH96RGpB2wRP83ZKVEV0yIggQ945M7bNcIPL2yZDO-0bHwkdaAfcydPQ5m3ZGVdniLk-KeudeH2KMBdVvc8wjx_zr6TA6eIpKSN9tXnj7s2XkiKb4MPhoFs41URUnmfog7Y3KlAaJqVSM-f0YQzBhsdYVGbnUg5NcGPwtTlbCMDJvfKWV-JJyXEDejRTR6p-Rw6g'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIsbNsOUICVU7LUFiyii16ctbtYmK2McJJKbnVZkJKG8JJyoApSp4ViwgU6cpMlLbslrkxs5k8kcJ_uQoVG8tjBjeTMwbO5H9TzgXH7WQvnCI8v3yKv5DKdHGsLbu1Fqw3xyuEQNSHLrpZllGUr6ZEYImRVwiDRD7nY1x_I74Kp0VfF26Huq-c4N5GILom2Rv7jV-5kWgHY-z3oebTelt8cf9r1sDrlLqqlxcutpDWlUTgLkskafE'
              }
            />
          </div>

          {/* Mobile Hamburger Toggle Button (Flipkart / Amazon Mobile Pattern) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#0b1426] text-white hover:bg-[#3f465c]/30 border border-[#3f465c]/40 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu (Full responsive coverage on phones) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1424] border-t border-[#3f465c]/40 px-4 py-3.5 flex flex-col gap-3.5 shadow-2xl animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Mobile Role Switcher */}
          <div className="bg-[#131b2e] p-2.5 rounded-lg border border-[#3f465c]/50 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[#7c839b] uppercase tracking-wider">
              Switch Role View:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleRoleChange(UserRole.STUDENT, 'examroom')}
                className={`py-2 px-2 rounded text-xs font-bold text-center transition-all cursor-pointer ${
                  currentRole === UserRole.STUDENT
                    ? 'bg-[#316bf3] text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#0b1426] text-[#7c839b] hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange(UserRole.PROCTOR, 'proctor-dashboard')}
                className={`py-2 px-2 rounded text-xs font-bold text-center transition-all cursor-pointer ${
                  currentRole === UserRole.PROCTOR
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#0b1426] text-[#7c839b] hover:text-white'
                }`}
              >
                Proctor
              </button>
              <button
                onClick={() => handleRoleChange(UserRole.ADMIN, 'admin')}
                className={`py-2 px-2 rounded text-xs font-bold text-center transition-all cursor-pointer ${
                  currentRole === UserRole.ADMIN
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#0b1426] text-[#7c839b] hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1 text-sm font-medium">
            {onBack && (
              <button
                onClick={() => {
                  onBack();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left bg-white/10 text-white font-bold hover:bg-white/20 transition-colors cursor-pointer border border-white/15 mb-1 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#86a8ff]" />
                <span>← Back to Previous Screen</span>
              </button>
            )}

            <button
              onClick={() => handleSelectTab('examroom')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'examroom'
                  ? 'bg-[#316bf3]/20 text-white font-bold border border-[#316bf3]/40'
                  : 'text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#316bf3]" />
                <span>{isStudent ? 'My Exam Room' : 'Exam Simulation'}</span>
              </div>
              <span className="text-[10px] text-[#7c839b] bg-[#131b2e] px-2 py-0.5 rounded">Active</span>
            </button>

            <button
              onClick={() => handleSelectTab('readiness')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === 'readiness'
                  ? 'bg-[#316bf3]/20 text-white font-bold border border-[#316bf3]/40'
                  : 'text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Camera & Hardware Diagnostic</span>
              </div>
            </button>

            {isStudent && (
              <button
                onClick={() => {
                  onOpenGuidelines?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Exam Guidelines & Marking Scheme</span>
                </div>
              </button>
            )}

            {!isStudent && (
              <>
                <button
                  onClick={() => handleSelectTab('proctor-dashboard')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === 'proctor-dashboard'
                      ? 'bg-[#316bf3]/20 text-white font-bold border border-[#316bf3]/40'
                      : 'text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Examiner Live Proctor Dashboard</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab('admin')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#316bf3]/20 text-white font-bold border border-[#316bf3]/40'
                      : 'text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>Question Bank & Exam Authoring</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab('schema')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeTab === 'schema'
                      ? 'bg-[#316bf3]/20 text-white font-bold border border-[#316bf3]/40'
                      : 'text-[#a1a7bb] hover:bg-[#3f465c]/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>PostgreSQL D1–D6 Schema</span>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Mobile Student Info Banner */}
          <div className="bg-[#131b2e] p-3 rounded-lg border border-[#3f465c]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                alt="Candidate avatar"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#316bf3]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGiaP_OofAlwIWcctK6Vzl3jz9Z9KsQgMPuzufKg0VRhi_8epuH96RGpB2wRP83ZKVEV0yIggQ945M7bNcIPL2yZDO-0bHwkdaAfcydPQ5m3ZGVdniLk-KeudeH2KMBdVvc8wjx_zr6TA6eIpKSN9tXnj7s2XkiKb4MPhoFs41URUnmfog7Y3KlAaJqVSM-f0YQzBhsdYVGbnUg5NcGPwtTlbCMDJvfKWV-JJyXEDejRTR6p-Rw6g"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white">Arjun Bodana</span>
                <span className="text-[10.5px] text-[#7c839b] font-mono">Roll: 20251651029</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded font-medium">
              Private Feed
            </span>
          </div>
        </div>
      )}
    </header>
  );
};


