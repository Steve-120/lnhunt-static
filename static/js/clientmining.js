document.addEventListener("DOMContentLoaded", () => {

    const CRACK_DELAY = 0;
    const MINE_TIME = 3000;
    const CRACK_IMG_PATH = "../static/images/crack/";
  
    let timers = new Map();
  
    document.querySelectorAll(".mineable-word").forEach((el) => {
  
      const rect = el.getBoundingClientRect();
      const crackImg = document.createElement("img");
      crackImg.src = CRACK_IMG_PATH + "empty.png";
      crackImg.style.position = "absolute";
      crackImg.style.left = "-2px";
      crackImg.style.right = "-2px";
      crackImg.style.pointerEvents = "none";
      crackImg.style.width = (rect.width + 4) + "px";
      crackImg.style.height = (rect.height + 4) + "px";
      crackImg.style.imageRendering = "pixelated";
      el.appendChild(crackImg);
  
      el.addEventListener("mousedown", () => {
        if (el.classList.contains("mined")) return;
  
        cancelMining(el);
  
        const t = { crackTimer: null, mineTimer: null, frameId: null, startTime: null };
        timers.set(el, t);
  
        t.crackTimer = setTimeout(() => {
          t.startTime = Date.now();
          el.classList.add("cracking");
  
          const updateProgress = () => {
            if (!t.startTime) return;
            const elapsed = Date.now() - t.startTime;
            const progress = Math.min(elapsed / (MINE_TIME - CRACK_DELAY), 1);
            el.style.setProperty("--progress", progress * 100);
  
            if (progress < 1) {
              t.frameId = requestAnimationFrame(updateProgress);
              crackImg.src =
                CRACK_IMG_PATH + "destroy_stage_" + Math.floor(10 * progress) + ".png";
            }
          };
  
          t.frameId = requestAnimationFrame(updateProgress);
  
          t.mineTimer = setTimeout(() => {
            const word = el.dataset.mineable;
  
            addToInventory(word);
  
            cancelMining(el);
            el.classList.add("mined");
  
            document.dispatchEvent(
              new CustomEvent("inventory:add", { detail: { word } })
            );
          }, MINE_TIME - CRACK_DELAY);
  
        }, CRACK_DELAY);
      });
  
      const cancelMining = (el) => {
        const t = timers.get(el);
        if (!t) return;
  
        clearTimeout(t.crackTimer);
        clearTimeout(t.mineTimer);
        cancelAnimationFrame(t.frameId);
  
        el.classList.remove("cracking");
        el.style.setProperty("--progress", 0);
        crackImg.src = CRACK_IMG_PATH + "empty.png";
        timers.delete(el);
      };
  
      el.addEventListener("mouseup", () => cancelMining(el));
      el.addEventListener("mouseleave", () => cancelMining(el));
      el.addEventListener("touchend", () => cancelMining(el));
      el.addEventListener("touchcancel", () => cancelMining(el));
    });
  });
  