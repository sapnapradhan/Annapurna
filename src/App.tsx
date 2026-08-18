import React, { useState, useEffect } from 'react';
import { appStore } from './services/store';
import { UserRole } from './types';
import { LandingPage } from './pages/LandingPage';

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
  const [authorityTab, setAuthorityTab] = useState('today');
  const [studentTab, setStudentTab] = useState('home');
  const [selectedMealId, setSelectedMealId] = useState<string | undefined>();

  useEffect(() => {
    const update = () => setRole(appStore.getRole());
    return appStore.subscribe(update);
  }, []);

  const handleLoginSuccess = (selectedRole: UserRole) => {
    appStore.loginAs(selectedRole);
  };

  const handleLogout = () => {
    appStore.logout();
  };

  const handleNavigateAuthority = (tab: string, mealId?: string) => {
    setAuthorityTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  const handleNavigateStudent = (tab: string, mealId?: string) => {
    setStudentTab(tab);
    if (mealId) setSelectedMealId(mealId);
  };

  // 1. Landing Page
  if (role === 'landing') {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Authority Dashboard
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
      </AuthorityLayout>
    );
  }

  // 3. Student Mobile App
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
