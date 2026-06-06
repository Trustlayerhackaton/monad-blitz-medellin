import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración E2E de CrediPass. Levanta el dev server de Next.js y
 * ejecuta las pruebas contra http://localhost:3000.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  // Serie con un worker: evita saturar el dev server de Next durante la
  // primera compilación on-demand (que puede tardar ~30s).
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 60_000,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
