import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { RoleProtectedRoute } from '@/components/ui/role-protected-route';

// Pages
import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import GuideLoginPage from '@/components/pages/GuideLoginPage';
import GuideOnboardingPage from '@/components/pages/GuideOnboardingPage';
import ToursPage from '@/components/pages/ToursPage';
import TourDetailPage from '@/components/pages/TourDetailPage';
import ProfilePage from '@/components/pages/ProfilePage';
import GuideDashboardPage from '@/components/pages/GuideDashboardPage';
import TouristDashboardPage from '@/components/pages/TouristDashboardPage';
import FindGuidePage from '@/components/pages/FindGuidePage';
import GuideProfilePageOld from '@/components/pages/GuideProfilePage';
import BookingPage from '@/components/pages/BookingPage';

// New Tourist Pages
import TouristProfilePage from '@/components/pages/TouristProfilePage';
import TouristDashboardNewPage from '@/components/pages/TouristDashboardNewPage';

// New Guide Pages
import GuideProfilePageNew from '@/components/pages/GuideProfilePage';
import GuideMyToursPage from '@/components/pages/GuideMyToursPage';
import GuideBookingsPage from '@/components/pages/GuideBookingsPage';
import GuideNewDashboardPage from '@/components/pages/GuideNewDashboardPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "guide-login",
        element: <GuideLoginPage />,
      },
      {
        path: "guide-onboarding",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to become a guide">
            <GuideOnboardingPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "tours",
        element: <ToursPage />,
      },
      {
        path: "tours/:id",
        element: <TourDetailPage />,
      },
      // Old routes (kept for backward compatibility)
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your dashboard">
            <TouristDashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "guide-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={['guide']}>
            <GuideNewDashboardPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "find-guide",
        element: <FindGuidePage />,
      },
      {
        path: "guide/:id",
        element: <GuideProfilePageOld />,
      },
      {
        path: "booking/:id",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to book a guide">
            <BookingPage />
          </MemberProtectedRoute>
        ),
      },
      // New Tourist Routes
      {
        path: "tourist-profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <TouristProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "tourist-dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={['tourist']}>
            <TouristDashboardNewPage />
          </RoleProtectedRoute>
        ),
      },
      // New Guide Routes
      {
        path: "guide-profile",
        element: (
          <RoleProtectedRoute allowedRoles={['guide']}>
            <GuideProfilePageNew />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "guide-my-tours",
        element: (
          <RoleProtectedRoute allowedRoles={['guide']}>
            <GuideMyToursPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "guide-bookings",
        element: (
          <RoleProtectedRoute allowedRoles={['guide']}>
            <GuideBookingsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
