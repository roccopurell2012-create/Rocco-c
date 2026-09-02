/**
 * Rocket launch transition — launches from a button, then pulls the next view down.
 */
const Rocket = {
  overlay: null,
  ship: null,
  curtain: null,

  init() {
    this.overlay = document.getElementById("rocket-overlay");
    this.ship = document.getElementById("rocket-ship");
    this.curtain = document.getElementById("curtain");
  },

  /**
   * @param {HTMLElement|null} fromEl — optional button to start from
   * @param {() => void} onMid — called when rocket peaks / page should swap
   * @param {() => void} [onDone] — called when overlay fully clears
   */
  launch(fromEl, onMid, onDone) {
    if (!this.overlay) this.init();

    // Position rocket near the source button if possible
    if (fromEl && this.ship) {
      const rect = fromEl.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      this.ship.style.left = midX + "px";
      this.ship.style.bottom = "auto";
      this.ship.style.top = midY + "px";
      this.ship.style.transform = "translate(-50%, -50%) scale(0.55)";
    } else if (this.ship) {
      this.ship.style.left = "50%";
      this.ship.style.top = "auto";
      this.ship.style.bottom = "20%";
      this.ship.style.transform = "translateX(-50%) scale(0.6)";
    }

    this.overlay.classList.remove("pulling");
    this.overlay.classList.add("active", "launching");

    // Midpoint: rocket near top — swap content + pull curtain
    setTimeout(() => {
      if (typeof onMid === "function") onMid();
      this.overlay.classList.add("pulling");
    }, 900);

    // End: clear overlay
    setTimeout(() => {
      this.overlay.classList.remove("active", "launching", "pulling");
      if (this.ship) {
        this.ship.style.left = "";
        this.ship.style.top = "";
        this.ship.style.bottom = "";
        this.ship.style.transform = "";
      }
      if (typeof onDone === "function") onDone();
    }, 1750);
  },
};

document.addEventListener("DOMContentLoaded", () => Rocket.init());
