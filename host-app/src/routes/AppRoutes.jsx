import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { lazy, Suspense, useEffect, useState } from "react";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AccessGuard from "../components/AccessGuard";
// import loadRemote from "../utils/loadRemote";
import PermissionManagement from "../pages/Admin/PermissionManagement";
import ModuleMaintenance from "../pages/Admin/ModuleMaintenance";
import { getModules } from "../services/moduleRegistry";
import { loadRemoteComponent } from "../utils/federationLoader";


/*
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
*/

function AppRoutes() {
  const [remoteModules, setRemoteModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const modules = await getModules();
        setRemoteModules(modules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  if (loading) {
    return <div>Loading routes...</div>;
  }

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

        {remoteModules.map((module) => {
          const RemoteComponent = lazy(async () => {
            try {
              const comp = await loadRemoteComponent(module.name, module.remoteUrl, module.exposedModule);
              return comp.default ? comp : { default: comp };
            } catch (err) {
              console.error(`Failed to load module ${module.name}`, err);
              return { default: () => <h2>{module.name} service unavailable. Please try again later.</h2> };
            }
          });

          // Ensure route has a wildcard for inner routing if not provided
          const routePath = module.route.endsWith("/*") ? module.route : `${module.route}/*`;

          return (
            <Route
              key={module.id}
              path={routePath}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AccessGuard moduleName={module.name}>
                      <Suspense fallback={<h2>Loading...</h2>}>
                        <RemoteComponent />
                      </Suspense>
                    </AccessGuard>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          );
        })}

        {/* 
        <Route
          path="/employees/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="EmployeeModule">
                  <Suspense fallback={<h2>Loading...</h2>}>
                    <EmployeeApp />
                  </Suspense>
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="InventoryModule">
                  <Suspense fallback={<h2>Loading...</h2>}>
                    <InventoryApp />
                  </Suspense>
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="AssetModule">
                  <Suspense fallback={<h2>Loading...</h2>}>
                    <AssetApp />
                  </Suspense>
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpdesk/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="HelpdeskModule">
                  <Suspense fallback={<h2>Loading...</h2>}>
                    <HelpdeskApp />
                  </Suspense>
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        */}

        <Route
          path="/:role/permissions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="PermissionModule">
                  <PermissionManagement />
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/:role/maintenance"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccessGuard moduleName="MaintenanceModule">
                  <ModuleMaintenance />
                </AccessGuard>
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;