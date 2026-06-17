// import { NavLink } from "react-router-dom";

// const links = [
//   { to: ".", label: "Dashboard" },
//   { to: "assets", label: "Assets" },
//   { to: "employees", label: "Employees" },
//   { to: "assignments", label: "Assignments" }
// ];

// export default function Layout({ children }) {
//   return (
//     <div className="app-shell">
//       <aside className="sidebar">
//         <div className="brand">
//           <span className="brand-mark">AM</span>
//           <div>
//             <strong>Asset Management</strong>
//           </div>
//         </div>

//         <nav className="nav-links">
//           {links.map((link) => (
//             <NavLink
//               key={link.to}
//               to={link.to}
//               relative="path"
//             >
//               {link.label}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>

//       <main className="content">{children}</main>
//     </div>
//   );
// }
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "", label: "Assets", end: true },
  { to: "dashboard", label: "Dashboard" },
  { to: "employees", label: "Employees" },
  { to: "assignments", label: "Assignments" }
];

function getMountPath(pathname) {
  return pathname === "/assets" || pathname.startsWith("/assets/")
    ? "/assets"
    : "";
}

function buildPath(mountPath, childPath) {
  if (!childPath) return mountPath || "/";
  return `${mountPath}/${childPath}`;
}

export default function Layout({ children }) {
  const location = useLocation();
  const mountPath = getMountPath(location.pathname);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AM</span>
          <div>
            <strong>Asset Management</strong>
          </div>
        </div>

        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={buildPath(mountPath, link.to)}
              end={link.end}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}