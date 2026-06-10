import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { lazy, Suspense } from "react";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import loadRemote from "../utils/loadRemote";


const EmployeeApp = lazy(() =>
  loadRemote(
  import("employee_mf/EmployeeApp"),
  "Employee Module"
  )
);

const AssetApp = lazy(() =>
  loadRemote(
  import("asset_management/AssetApp"),
  "Asset Module"
  )
);

const HelpdeskApp = lazy(() =>
  loadRemote( 
  import("helpdesk/HelpdeskApp"),
  "Helpdesk Module"
  )
);

const InventoryApp = lazy(() =>
  loadRemote( 
  import("inventory/AppRoutes"),
  "Inventory Module",
  )
); 

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<h2>Loading...</h2>}>
                  <EmployeeApp />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<h2>Loading...</h2>}>
                  <InventoryApp />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<h2>Loading...</h2>}>
                  <AssetApp />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<h2>Loading...</h2>}>
                  <HelpdeskApp />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;