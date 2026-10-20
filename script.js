
"use strict";

const pages = [...document.querySelectorAll(".page")];
const navItems = [...document.querySelectorAll(".nav-item")];
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const toast = document.getElementById("toast");

const titles = {
  inicio: "Painel principal",
  rotas: "Rotas e GPS",
  bateria: "Central de bateria",
  historico: "Histórico de trajetos",
  sobre: "Sobre o VERTEX"
};

let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function showPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;

  pages.forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  navItems.forEach(item => {
    const active = item.dataset.page === pageId;
    item.classList.toggle("active", active);

    if (active) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  pageTitle.textContent = titles[pageId] || "VERTEX";
  sidebar.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Navegação principal e atalhos.
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    showPage(button.dataset.page);
  });
});

// Alternância de tema claro/escuro.
function setTheme(theme) {
  const dark = theme === "dark";

  document.body.classList.toggle("dark", dark);
  themeIcon.textContent = dark ? "☀" : "☾";
  themeLabel.textContent = dark ? "Modo escuro" : "Modo claro";

  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#07111f" : "#f2f6fc");

  themeToggle.setAttribute(
    "aria-label",
    dark ? "Ativar tema claro" : "Ativar tema escuro"
  );
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  setTheme(nextTheme);
});

// Usa a preferência do sistema na abertura.
const systemPrefersDark = window.matchMedia?.(
  "(prefers-color-scheme: dark)"
).matches;

setTheme(systemPrefersDark ? "dark" : "light");

// Menu mobile.
document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Seleção de rotas predefinidas.
document.querySelectorAll("[data-route]").forEach(button => {
  button.addEventListener("click", () => {
    const routeName = button.dataset.route;

    if (routeName === "Rota personalizada") {
      document.getElementById("origin").focus();
      showToast("Digite a origem e o destino para configurar a demonstração.");
      return;
    }

    const [origin, destination] = routeName.split(" → ");

    document.getElementById("origin").value = origin;
    document.getElementById("destination").value = destination;
    document.getElementById("routeMessage").textContent =
      `Rota selecionada: ${routeName}. O cálculo real ainda não está integrado.`;

    showToast(`Rota selecionada: ${routeName}`);
  });
});

// Validação básica do formulário de rota.
// Não calcula distância, não consulta mapas e não controla a cadeira.
document.getElementById("createRoute").addEventListener("click", () => {
  const origin = document.getElementById("origin").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const message = document.getElementById("routeMessage");

  if (!origin || !destination) {
    message.textContent = "Preencha o ponto de partida e o destino.";
    showToast("Informe a origem e o destino.");
    return;
  }

  message.textContent =
    `Trajeto configurado para demonstração: ${origin} → ${destination}. ` +
    "Nenhuma rota real foi calculada.";

  showToast("Trajeto registrado apenas na interface demonstrativa.");
});

// Estado inicial explícito da demonstração.
const demoBattery = 85;

function updateDemoBattery(value) {
  const percentage = Math.max(0, Math.min(100, value));

  document.getElementById("batteryValue").textContent = `${percentage}%`;
  document.getElementById("batteryDetail").textContent = `${percentage}%`;
  document.getElementById("bigBatteryValue").textContent = `${percentage}%`;

  document.getElementById("batteryProgress").style.width = `${percentage}%`;
  document.getElementById("batteryProgressLarge").style.width = `${percentage}%`;
  document.getElementById("bigBatteryFill").style.height = `${percentage}%`;
}

updateDemoBattery(demoBattery);

// Não solicitar GPS nem simular conexão física automaticamente.
// A interface informa claramente que esses recursos ainda não foram integrados.
document.getElementById("locationValue").textContent = "Não conectada";
document.getElementById("locationDetail").textContent =
  "GPS aguardando integração";
document.getElementById("connectionValue").textContent = "Offline";
document.getElementById("systemStatus").textContent = "Demonstração";
document.getElementById("connectionText").textContent = "Modo demonstração";
