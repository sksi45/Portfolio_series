(() => {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reducedMotion) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);
  document.documentElement.classList.add("has-custom-cursor");

  let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
  const labels = { view: "VIEW", play: "▶", link: "↗", drag: "↔", close: "×" };

  function animate() {
    x += (tx - x) * 0.24;
    y += (ty - y) * 0.24;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    raf = requestAnimationFrame(animate);
  }
  function move(e) {
    tx = e.clientX;
    ty = e.clientY;
    cursor.classList.add("visible");
    const target = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
    const interactive = e.target instanceof Element ? e.target.closest("a,button,[role='button']") : null;
    cursor.classList.toggle("hover", Boolean(interactive && !target));
    cursor.classList.toggle("tagged", Boolean(target));
    cursor.classList.toggle("view", target?.dataset.cursor === "view");
    cursor.textContent = target ? (labels[target.dataset.cursor] || "") : "";
  }
  function leave() { cursor.classList.remove("visible"); }
  function down() { cursor.classList.add("down"); }
  function up() { cursor.classList.remove("down"); }

  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerleave", leave);
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  animate();

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(raf);
    document.documentElement.classList.remove("has-custom-cursor");
  }, { once: true });
})();