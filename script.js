"use strict";
const CONFIG = {
  nombre: "Kaory",
  fecha: "2026-11-14T20:30:00-05:00",
  whatsapp: "51933181134",
  mensaje: "Confirmo mi asistencia a tus XV",
  mapa: "https://maps.app.goo.gl/8szHEMMyeoCNK5z7A",
};
const welcome = document.getElementById("welcome"),
  envelope = document.getElementById("openEnvelope"),
  invitation = document.getElementById("invitation"),
  music = document.getElementById("music"),
  musicButton = document.getElementById("musicButton");
let opened = false;
async function playMusic() {
  try {
    music.volume = 0.45;
    await music.play();
    musicButton.classList.add("playing");
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-pressed", "true");
    musicButton.setAttribute("aria-label", "Pausar música");
  } catch {
    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
    musicButton.setAttribute("aria-pressed", "false");
  }
}
function openInvitation() {
  if (opened) return;
  opened = true;
  envelope.classList.add("open");
  envelope.disabled = true;
  playMusic();
  setTimeout(() => welcome.classList.add("opening"), 1200);
  setTimeout(() => {
    welcome.hidden = true;
    invitation.hidden = false;
    document.body.classList.remove("locked");
    musicButton.hidden = false;
    window.scrollTo(0, 0);
    showVisibleElements();
  }, 2400);
}
envelope.addEventListener("click", openInvitation);
musicButton.addEventListener("click", async () => {
  if (music.paused) await playMusic();
  else {
    music.pause();
    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.setAttribute("aria-label", "Reproducir música");
  }
});
const target = new Date(CONFIG.fecha).getTime();
const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};
const pad = (n) => String(n).padStart(2, "0");
function updateCountdown() {
  if (!Number.isFinite(target)) return;
  const remaining = Math.max(0, target - Date.now());
  const days = Math.floor(remaining / 86400000),
    hours = Math.floor(remaining / 3600000) % 24,
    minutes = Math.floor(remaining / 60000) % 60,
    seconds = Math.floor(remaining / 1000) % 60;
  fields.days.textContent = pad(days);
  fields.hours.textContent = pad(hours);
  fields.minutes.textContent = pad(minutes);
  fields.seconds.textContent = pad(seconds);
  document.getElementById("countdownMessage").textContent =
    remaining === 0 ? "¡Ha llegado el gran día!" : "";
}
updateCountdown();
setInterval(updateCountdown, 1000);
const elements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.08 },
);
elements.forEach((el) => observer.observe(el));
function showVisibleElements() {
  elements.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.classList.add("visible");
  });
}
document.getElementById("whatsappButton").href =
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensaje)}`;

// NUEVA SECCIÓN: reutiliza el mismo <audio id="music"> y el botón flotante.
// No cambia la apertura del sobre ni las demás funciones existentes.
const kaoryDanceVideo = document.getElementById("kaoryDanceVideo");
const kaoryMusicToggle = document.getElementById("kaoryMusicToggle");
const kaoryMusicRestart = document.getElementById("kaoryMusicRestart");
const kaoryMusicLoop = document.getElementById("kaoryMusicLoop");
const kaoryMusicSeek = document.getElementById("kaoryMusicSeek");
kaoryDanceVideo.muted = true;
kaoryDanceVideo.defaultMuted = true;
function syncKaoryMusicControls() {
  const playing = !music.paused;
  kaoryMusicToggle.textContent = playing ? "❚❚" : "▶";
  kaoryMusicToggle.setAttribute(
    "aria-label",
    playing ? "Pausar música" : "Reproducir música",
  );
  kaoryMusicToggle.setAttribute("aria-pressed", String(playing));
  // El botón flotante existente sigue mostrando el mismo estado.
  musicButton.classList.toggle("playing", playing);
  musicButton.textContent = playing ? "♫" : "♪";
  musicButton.setAttribute("aria-pressed", String(playing));
  musicButton.setAttribute(
    "aria-label",
    playing ? "Pausar música" : "Reproducir música",
  );
}
kaoryMusicToggle.addEventListener("click", async () => {
  if (music.paused) await playMusic();
  else music.pause();
  syncKaoryMusicControls();
});
kaoryMusicRestart.addEventListener("click", () => {
  music.currentTime = 0;
});
kaoryMusicLoop.addEventListener("click", () => {
  music.loop = !music.loop;
  kaoryMusicLoop.setAttribute("aria-pressed", String(music.loop));
  kaoryMusicLoop.setAttribute(
    "aria-label",
    music.loop ? "Desactivar repetición" : "Activar repetición",
  );
});
music.addEventListener("timeupdate", () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    kaoryMusicSeek.value = String((100 * music.currentTime) / music.duration);
  }
});
kaoryMusicSeek.addEventListener("input", () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    music.currentTime = (music.duration * Number(kaoryMusicSeek.value)) / 100;
  }
});
for (const eventName of ["play", "pause", "ended"])
  music.addEventListener(eventName, syncKaoryMusicControls);
syncKaoryMusicControls();
// Reproduce el video únicamente cuando la sección sea visible; siempre sin audio.
const kaoryVideoObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !invitation.hidden) {
        const attempt = kaoryDanceVideo.play();
        if (attempt && typeof attempt.catch === "function")
          attempt.catch(() => {});
      } else kaoryDanceVideo.pause();
    }
  },
  { threshold: 0.15 },
);
kaoryVideoObserver.observe(kaoryDanceVideo);
// La sección comienza oculta dentro de <main>; cuando se abre el sobre,
// se inicia el video si está visible, sin alterar la lógica anterior.
const kaoryOpenObserver = new MutationObserver(() => {
  if (!invitation.hidden) {
    const r = kaoryDanceVideo.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) {
      const attempt = kaoryDanceVideo.play();
      if (attempt && typeof attempt.catch === "function")
        attempt.catch(() => {});
    }
    kaoryOpenObserver.disconnect();
  }
});
kaoryOpenObserver.observe(invitation, {
  attributes: true,
  attributeFilter: ["hidden"],
});
