import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/ui/navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Core pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import NotFound from "./pages/NotFound";

// Feature pages
import Dashboard from "./pages/Dashboard";
import DietPlan from "./pages/DietPlan";
import WorkoutPlan from "./pages/WorkoutPlan";
import Progress from "./pages/Progress";
import DailyLog from "./pages/DailyLog";
import WeeklyCheckin from "./pages/WeeklyCheckin";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

// Blog
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Floating Chat Widget
import ChatWidget from "./pages/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected: Dashboard + Features */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/diet"
            element={
              <ProtectedRoute>
                <DietPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/workout"
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log/daily"
            element={
              <ProtectedRoute>
                <DailyLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkin/weekly"
            element={
              <ProtectedRoute>
                <WeeklyCheckin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Blog (public) */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Floating Chatbot */}
        <ChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
