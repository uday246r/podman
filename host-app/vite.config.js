import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: "host",
        remotes: {
          employee_mf: env.VITE_EMPLOYEE_MF_URL || "https://employeesfederation.onrender.com/assets/remoteEntry.js",
          asset_management: env.VITE_ASSET_MF_URL || "https://assetmanagementsystem-0sqh.onrender.com/assets/remoteEntry.js",
          helpdesk: env.VITE_HELPDESK_MF_URL || "https://helpdesk-frontend-45xw.onrender.com/assets/remoteEntry.js",
          inventory: env.VITE_INVENTORY_MF_URL || "https://inventorymanagement-rm.onrender.com/assets/remoteEntry.js"
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: false,
          },
          "react-router": {
            singleton: true,
            requiredVersion: false,
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: false,
          }
        },
      }),
    ],

    build: {
      target: "esnext",
    },

    server: {
      host: "0.0.0.0",
      port: 3000,
      cors: true,
    },
  };
});