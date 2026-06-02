import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuthStore } from "./store/auth"
import Login from "./pages/Login"
import AppLayout from "./layout/AppLayout"
import { RequireRole } from "./hooks/useRole"
import Bookings from "./pages/Bookings"
import Users from "./pages/Users"
import Dashboard from "./pages/Dashboard"
import AuthLayout from "./layout/AuthLayout"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  const role = useAuthStore((state) => state.user?.role)
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={role && role === "Owner" ? <Navigate to="/dashboard" replace /> : <Navigate to="/bookings" replace />}
          />

          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <RequireGuest>
                  <Login />
                </RequireGuest>
              }
            />
          </Route>

          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/bookings" element={<Bookings />} />

            <Route
              path="/users"
              element={
                <RequireRole roles={["Admin"]}>
                  <Users />
                </RequireRole>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireRole roles={["Admin", "Owner"]}>
                  <Dashboard />
                </RequireRole>
              }
            />
          </Route>

          <Route>
            <Route
              path="*"
              element={
                <RequireAuth>
                  <Navigate to="/not-found" replace />
                </RequireAuth>
              }
            />
            <Route
              path="/not-found"
              element={<NotFound />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
