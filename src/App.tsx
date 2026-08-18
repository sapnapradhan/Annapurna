import React, { useState, useEffect } from 'react';
import { appStore } from './services/store';
import { UserRole } from './types';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';

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

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | 'landing'>(appStore.getRole());
  const [authView, setAuthView] = useState<'none' | 'register' | 'login'>('none');
  const [authorityTab, setAuthorityTab] = useState('today');
  const [studentTab, setStudentTab] = useState('home');
  const [selectedMealId, setSelectedMealId] = useState<string | undefined>();

  useEffect(() => {
    const update = () => {
      const currentRole = appStore.getRole();
      setRole(currentRole);
      if (currentRole !== 'landing') {
        setAuthView('none');
      }
    };
    return appStore.subscribe(update);
  }, []);

  const handleLoginSuccess = (selectedRole: UserRole) => {
    setAuthView('none');
  };

  const handleLogout = () => {
    appStore.logout();
    setAuthView('none');
  };

  const handleNavigateAuthority = (tab: string, mealId?: string) => {
    setAuthorityTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  const handleNavigateStudent = (tab: string, mealId?: string) => {
    setStudentTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  // Auth Views
  if (authView === 'register') {
    return (
      <RegisterPage
        onNavigateLogin={() => setAuthView('login')}
        onSuccessRedirect={() => setAuthView('login')}
      />
    );
  }

  if (authView === 'login') {
    return (
      <LoginPage
        onNavigateRegister={() => setAuthView('register')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Landing Page
  if (role === 'landing') {
    return (
      <LandingPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setAuthView('register')}
        onNavigateLogin={() => setAuthView('login')}
      />
    );
  }

  // Authority Dashboard
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

  // Student Mobile App
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
