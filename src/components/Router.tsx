import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';

// Pages
import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import GuideLoginPage from '@/components/pages/GuideLoginPage';
import ToursPage from '@/components/pages/ToursPage';
import TourDetailPage from '@/components/pages/TourDetailPage';
import ProfilePage from '@/components/pages/ProfilePage';
import GuideDashboardPage from '@/components/pages/GuideDashboardPage';
import TouristDashboardPage from '@/components/pages/TouristDashboardPage';
import FindGuidePage from '@/components/pages/FindGuidePage';
import GuideProfilePage from '@/components/pages/GuideProfilePage';
import BookingPage from '@/components/pages/BookingPage';

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
        path: "tours",
        element: <ToursPage />,
      },
      {
        path: "tours/:id",
        element: <TourDetailPage />,
      },
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
          <MemberProtectedRoute messageToSignIn="Sign in as a guide to access your dashboard">
            <GuideDashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "find-guide",
        element: <FindGuidePage />,
      },
      {
        path: "guide/:id",
        element: <GuideProfilePage />,
      },
      {
        path: "booking/:id",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to book a guide">
            <BookingPage />
          </MemberProtectedRoute>
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
