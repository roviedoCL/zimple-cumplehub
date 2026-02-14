import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Pages
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ComplaintsPage } from './pages/compliance/ComplaintsPage'
import { ComplaintDetailPage } from './pages/compliance/ComplaintDetailPage'
import { NewComplaintPage } from './pages/compliance/NewComplaintPage'
import { SurveysPage } from './pages/surveys/SurveysPage'
import { SurveyBuilderPage } from './pages/surveys/SurveyBuilderPage'
import { AnalyticsPage } from './pages/analytics/AnalyticsPage'
import { UsersPage } from './pages/users/UsersPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { AIAgentPage } from './pages/ai-agent/AIAgentPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'compliance',
        children: [
          {
            index: true,
            element: <ComplaintsPage />,
          },
          {
            path: 'new',
            element: <NewComplaintPage />,
          },
          {
            path: ':id',
            element: <ComplaintDetailPage />,
          },
        ],
      },
      {
        path: 'surveys',
        children: [
          {
            index: true,
            element: <SurveysPage />,
          },
          {
            path: 'builder',
            element: <SurveyBuilderPage />,
          },
          {
            path: ':id',
            element: <div>Survey Detail</div>,
          },
        ],
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'ai-agent',
        element: <AIAgentPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])