import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ChatPage from "@/pages/ChatPage";
import AboutPage from "@/pages/AboutPage";
import InboxPage from "@/pages/InboxPage";
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyThingsPage from "@/pages/MyThings.tsx";
import NeighborsPage from "@/pages/NeighborsPage.tsx";
import LendedPage from "@/pages/LendedPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* DEFAULT PAGE FOR "/" */}
            <Route index element={<DashboardPage />} />
            {/* EXPLICIT PATHS */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="chat" element={<ChatPage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="mythings" element={<MyThingsPage/>}/>
              <Route path="neighbors" element={<NeighborsPage/>}/>
              <Route path="landed" element={<LendedPage/>}/>
            </Route>

            <Route path="about" element={<AboutPage />} />

            {/* Login */}
            <Route path="login" element={<LoginPage />} />

            {/* OPTIONAL: fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
