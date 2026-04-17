import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  ClipboardList, 
  GraduationCap, 
  LayoutDashboard, 
  Library, 
  Lightbulb, 
  MessageSquare, 
  Settings, 
  FileText, 
  Users, 
  FileSearch,
  BookMarked,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, UserProfile } from './types';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import ClassSelection from './components/ClassSelection';
import AuthModal from './components/AuthModal';
import { auth, db } from './lib/firebase';
import { ShieldCheck, LogOut } from 'lucide-react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// View Imports (we'll implement these next)
import TeacherHome from './views/teacher/TeacherHome';
import QuizGenerator from './views/teacher/QuizGenerator';
import StudentSelector from './views/teacher/StudentSelector';
import Resources from './views/shared/Resources';
import LessonPlanner from './views/teacher/LessonPlanner';
import TestPaperGenerator from './views/teacher/TestPaperGenerator';
import SamplePaperGenerator from './views/teacher/SamplePaperGenerator';

import StudentHome from './views/student/StudentHome';
import DoubtSolver from './views/student/DoubtSolver';
import AssignmentAssistant from './views/student/AssignmentAssistant';
import Analyze from './views/student/Analyze';
import ProfileView from './views/shared/ProfileView';

export default function App() {
  const [userClass, setUserClass] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    // Start with a reliable local guest identity to ensure immediate access
    const explorerProfile: UserProfile = {
      uid: 'local-explorer',
      fullName: 'Michaelite Explorer',
      email: 'explorer@stmichaels.edu',
      role: 'student',
      userClass: null,
      createdAt: new Date().toISOString()
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setUserProfile(profile);
          } else {
            const profile: UserProfile = {
              uid: user.uid,
              fullName: 'Michaelite Explorer',
              email: 'guest@stmichaels.edu',
              role: 'student',
              userClass: null,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', user.uid), profile);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error("Firestore profile check failed:", error);
          setUserProfile(explorerProfile);
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.warn("Anonymous Authentication disabled.");
          setUserProfile(explorerProfile);
        }
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Show dashboard loader when role is selected
  useEffect(() => {
    if (role) {
      setViewLoading(true);
      setCurrentView('home');
      const timer = setTimeout(() => setViewLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [role]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const hasShownSplash = sessionStorage.getItem('zehn-splash-shown');
    
    if (hasShownSplash) {
      setLoading(false);
      return;
    }

    if (authInitialized) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('zehn-splash-shown', 'true');
      }, 1500); // Slightly longer for the initial "wow" factor
      return () => clearTimeout(timer);
    }
  }, [authInitialized]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-['Segoe_UI',Roboto,Helvetica,Arial,sans-serif] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-[3px] border-dashed border-[#1a237e]/20 rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-t-[3px] border-[#1a237e] rounded-full absolute top-0 left-0"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#1a237e]" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-[#1a237e] uppercase tracking-tighter leading-none">Zēhn</h1>
            <div className="h-1 w-12 bg-[#1a237e] mx-auto rounded-full"></div>
            <p className="text-[#636e72] text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse pt-2">Building Intellectual Space</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // No real auth modal needed
  if (showAuth && !userProfile && false) {
    return (
      <AuthModal 
        onSuccess={(profile) => {
          if (profile) {
            setUserProfile(profile);
            setRole(profile.role);
            setUserClass(profile.userClass);
          }
          setShowAuth(false);
        }} 
        onContinueGuest={() => setShowAuth(false)} 
      />
    );
  }

  if (!userClass) {
    return <ClassSelection onClassSelect={setUserClass} />;
  }

  if (!role) {
    return <LandingPage onSelectRole={setRole} />;
  }

  const handleLogout = async () => {
    // Completely clear all session data to force re-selection of role and class
    setRole(null);
    setUserClass(null);
    setUserProfile(null);
    setCurrentView('home');
    // We don't necessarily need to sign out from Firebase if we want to stay "anonymous" 
    // but clearing the role forces the Landing Page back.
  };

  const renderView = () => {
    // Shared Views
    if (currentView === 'profile') return <ProfileView userProfile={userProfile} onNavigate={setCurrentView} />;

    if (role === 'teacher') {
      switch (currentView) {
        case 'home': return <TeacherHome onNavigate={setCurrentView} />;
        case 'quiz': return <QuizGenerator userClass={userClass} />;
        case 'selector': return <StudentSelector />;
        case 'resources': return <Resources role="teacher" />;
        case 'lessons': return <LessonPlanner userClass={userClass} />;
        case 'test-paper': return <TestPaperGenerator userClass={userClass} />;
        case 'sample-paper': return <SamplePaperGenerator userClass={userClass} />;
        default: return <TeacherHome onNavigate={setCurrentView} />;
      }
    } else {
      switch (currentView) {
        case 'home': return <StudentHome onNavigate={setCurrentView} />;
        case 'doubt': return <DoubtSolver userClass={userClass} />;
        case 'assignment': return <AssignmentAssistant userClass={userClass} />;
        case 'resources': return <Resources role="student" />;
        case 'analyze': return <Analyze userClass={userClass} />;
        default: return <StudentHome onNavigate={setCurrentView} />;
      }
    }
  };

  return (
    <DashboardLayout 
      role={role} 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={handleLogout}
      userClass={userClass}
      userProfile={userProfile}
    >
      <AnimatePresence mode="wait">
        {viewLoading ? (
          <motion.div
            key="dashboard-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-2 border-dashed border-[#1a237e]/30 rounded-full"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-t-2 border-[#1a237e] rounded-full absolute top-0 left-0"
              ></motion.div>
            </div>
            <p className="text-[#636e72] text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Academy Node</p>
          </motion.div>
        ) : (
          <motion.div
            key={`${role}-${currentView}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderView()}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
