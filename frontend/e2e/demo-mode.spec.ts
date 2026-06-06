import { test, expect } from "@playwright/test";

/**
 * Smoke E2E del modo demo (sin wallet). Verifica que la app carga, muestra
 * el estado demo, las tarjetas de métricas y permite navegar las pestañas.
 */
test.describe("Trustlayer — modo demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("carga la app con cabecera y banner de demo", async ({ page }) => {
    await expect(page).toHaveTitle(/Trustlayer/i);
    await expect(
      page.getByRole("heading", { name: /Trustlayer/i })
    ).toBeVisible();
    await expect(page.getByText(/Modo Demo/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Conectar MetaMask/i }).first()
    ).toBeVisible();
  });

  test("muestra las tres tarjetas de métricas", async ({ page }) => {
    await expect(page.getByText("Payment Score").first()).toBeVisible();
    await expect(page.getByText("Pagos Consecutivos").first()).toBeVisible();
    await expect(page.getByText("mcCOP acumulados").first()).toBeVisible();
  });

  test("navega por las pestañas del dashboard", async ({ page }) => {
    // Scope a la barra de pestañas (aria-label="Tabs") para evitar colisiones.
    const tabs = page.getByRole("navigation", { name: "Tabs" });
    for (const label of [
      "Recompensas",
      "Créditos",
      "Logros",
      "Estadísticas",
      "Actividad",
      "Resumen",
    ]) {
      await tabs.getByRole("button", { name: label }).click();
    }
    // Las tarjetas de métricas son persistentes a las pestañas.
    await expect(page.getByText("Payment Score").first()).toBeVisible();
  });
});
