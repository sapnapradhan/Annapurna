import React, { useState, useEffect } from 'react';
import { appStore } from './services/store';
import { UserRole } from './types';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { FoodRescuePage } from './pages/FoodRescuePage';
import { CinematicIntro } from './components/common/CinematicIntro';
import { AnnapurnaGravityLogoIntro } from './components/common/AnnapurnaGravityLogoIntro';

// Authority Pages
import { AuthorityLayout } from './components/authority/AuthorityLayout';
import { TodayMealsPage } from './pages/authority/TodayMealsPage';
import { MenuManagementPage } from './pages/authority/MenuManagementPage';
import { MealTimingPage } from './pages/authority/MealTimingPage';
import { QRGeneratorPage } from './pages/authority/QRGeneratorPage';
import { LiveAttendancePage } from './pages/authority/LiveAttendancePage';
import { FeedbackDashboardPage } from './pages/authority/FeedbackDashboardPage';
import { PostMealConsumptionPage } from './pages/authority/PostMealConsumptionPage';
import { SurplusRedistributionPage } from './pages/authority/SurplusRedistributionPage';
import { ForecastingPage } from './pages/authority/ForecastingPage';
import { AuthoritySettingsPage } from './pages/authority/AuthoritySettingsPage';

// Student Pages
import { StudentLayout } from './components/student/StudentLayout';
import { StudentHomePage } from './pages/student/StudentHomePage';
import { StudentMealsPage } from './pages/student/StudentMealsPage';
import { StudentCheckInPage } from './pages/student/StudentCheckInPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentMyMealsPage } from './pages/student/StudentMyMealsPage';
import { StudentMyReviewsPage } from './pages/student/StudentMyReviewsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentImpactPage } from './pages/student/StudentImpactPage';

type AppStep = 'intro' | 'main';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | 'landing'>(appStore.getRole());
  
  // Website opens IMMEDIATELY into the Annapurna Squishy Gravity Logo Intro on link open!
  const [mainView, setMainView] = useState<'landing' | 'register' | 'login' | 'rescue' | 'gravity-intro'>('gravity-intro');

  const [step, setStep] = useState<AppStep>('main');

  const [authorityTab, setAuthorityTab] = useState('today');
  const [studentTab, setStudentTab] = useState('home');
  const [selectedMealId, setSelectedMealId] = useState<string | undefined>();

  useEffect(() => {
    const update = () => {
      const currentRole = appStore.getRole();
      setRole(currentRole);
      if (currentRole === 'authority' || currentRole === 'student') {
        setMainView('landing');
      }
    };
    return appStore.subscribe(update);
  }, []);

  const handleIntroComplete = () => {
    setStep('main');
  };

  const handleReplayIntro = () => {
    setStep('intro');
  };

  const handleLoginSuccess = (selectedRole: UserRole) => {
    appStore.setRole(selectedRole);
    setRole(selectedRole);
    setMainView('landing');
  };

  const handleLogout = () => {
    appStore.logout();
    setRole('landing');
    setMainView('landing');
  };

  const handleNavigateAuthority = (tab: string, mealId?: string) => {
    setAuthorityTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  const handleNavigateStudent = (tab: string, mealId?: string) => {
    setStudentTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  // 1. Cinematic Story Entry (On Demand)
  if (step === 'intro') {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  // 2. Annapurna Squishy Gravity Logo Intro (Opens First on Link Open!)
  if (mainView === 'gravity-intro') {
    return <AnnapurnaGravityLogoIntro onEnterPlatform={() => setMainView('landing')} />;
  }

  // 3. Dedicated Food Rescue Hub Route
  if (mainView === 'rescue') {
    return <FoodRescuePage onBackToHome={() => setMainView('landing')} />;
  }

  // 4. Auth Views (Only if role is landing)
  if (role === 'landing' && mainView === 'register') {
    return (
      <RegisterPage
        onNavigateLogin={() => setMainView('login')}
        onSuccessRedirect={() => setMainView('login')}
      />
    );
  }

  if (role === 'landing' && mainView === 'login') {
    return (
      <LoginPage
        onNavigateRegister={() => setMainView('register')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // 5. Main Landing Page
  if (role === 'landing') {
    return (
      <LandingPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setMainView('register')}
        onNavigateLogin={() => setMainView('login')}
        onNavigateRescue={() => setMainView('rescue')}
        onReplayIntro={handleReplayIntro}
      />
    );
  }

  // 6. Authority Dashboard
  if (role === 'authority') {
    return (
      <AuthorityLayout
        activeTab={authorityTab}
        setActiveTab={setAuthorityTab}
        onLogout={handleLogout}
      >
        {authorityTab === 'today' && <TodayMealsPage onNavigate={handleNavigateAuthority} />}
        {authorityTab === 'menu' && <MenuManagementPage />}
        {authorityTab === 'timing' && <MealTimingPage />}
        {authorityTab === 'qr' && <QRGeneratorPage selectedMealId={selectedMealId} />}
        {authorityTab === 'live' && <LiveAttendancePage selectedMealId={selectedMealId} />}
        {authorityTab === 'feedback' && <FeedbackDashboardPage />}
        {authorityTab === 'consumption' && <PostMealConsumptionPage />}
        {authorityTab === 'surplus' && <SurplusRedistributionPage />}
        {authorityTab === 'forecasting' && <ForecastingPage />}
        {authorityTab === 'settings' && <AuthoritySettingsPage />}
      </AuthorityLayout>
    );
  }

  // 7. Student Mobile App
  return (
    <StudentLayout
      activeTab={studentTab}
      setActiveTab={setStudentTab}
      onLogout={handleLogout}
    >
      {studentTab === 'home' && <StudentHomePage onNavigate={handleNavigateStudent} />}
      {studentTab === 'meals' && <StudentMealsPage onNavigate={handleNavigateStudent} />}
      {studentTab === 'checkin' && <StudentCheckInPage selectedMealId={selectedMealId} onNavigate={handleNavigateStudent} />}
      {studentTab === 'attendance' && <StudentAttendancePage />}
      {studentTab === 'my-meals' && <StudentMyMealsPage />}
      {studentTab === 'my-reviews' && <StudentMyReviewsPage />}
      {studentTab === 'profile' && <StudentProfilePage onNavigate={handleNavigateStudent} />}
      {studentTab === 'impact' && <StudentImpactPage />}
    </StudentLayout>
  );
};

export default App;
