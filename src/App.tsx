import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider, useSession } from "@/state/session";
import { ProfileProvider, useProfile } from "@/state/profile";
import { ToastProvider } from "@/state/toast";
import { Splash } from "@/components/ui";
import { AppShell } from "@/components/layout/AppShell";
import WelcomeScreen from "@/screens/Welcome";
import OnboardingScreen from "@/screens/Onboarding";
import TodayScreen from "@/screens/Today";
import LogMealScreen from "@/screens/LogMeal";
import MealDetailScreen from "@/screens/MealDetail";
import HistoryScreen from "@/screens/History";
import ProfileScreen from "@/screens/Profile";

export default function App() {
  return (
    <HashRouter>
      <SessionProvider>
        <ProfileProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ProfileProvider>
      </SessionProvider>
    </HashRouter>
  );
}

/** Gate: session required for /app, completed profile required inside it. */
function AppRoutes() {
  const { status: sessionStatus, session } = useSession();
  const { status: profileStatus, profile } = useProfile();

  if (sessionStatus === "loading" || (session && profileStatus === "loading")) {
    return <Splash />;
  }

  const home = session ? (profile ? "/app/today" : "/onboarding") : "/welcome";

  return (
    <Routes>
      <Route path="/welcome" element={!session ? <WelcomeScreen /> : <Navigate to={home} replace />} />
      <Route
        path="/onboarding"
        element={session ? (profile ? <Navigate to="/app/today" replace /> : <OnboardingScreen />) : <Navigate to="/welcome" replace />}
      />
      <Route
        path="/app"
        element={session ? (profile ? <AppShell /> : <Navigate to="/onboarding" replace />) : <Navigate to="/welcome" replace />}
      >
        <Route index element={<Navigate to="/app/today" replace />} />
        <Route path="today" element={<TodayScreen />} />
        <Route path="log" element={<LogMealScreen />} />
        <Route path="meal/:id" element={<MealDetailScreen />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
      </Route>
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
