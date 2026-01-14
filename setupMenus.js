document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------
     Element References
  -------------------------------------------------- */
  const altView = document.getElementById("alt-view");
  const startScreen = document.getElementById("start-screen");
  const playersScreen = document.getElementById("players-screen");
  const setupScreen = document.getElementById("player-setup");
  const mainView = document.getElementById("main-view");

  const startBtn = document.getElementById("start-btn");
  const doneBtn = document.getElementById("done-btn");

  const sexSelect = document.getElementById("sex-sel");
  const jobSelect = document.getElementById("job-sel");
  const colorSelect = document.getElementById("color-sel");
  const nameInput = document.getElementById('name-inp');

  startBtn.style.width = "400px";
  startBtn.style.height = "200px";


  let totalHumanPlayers = 1;
  let currentPlayerIndex = 0;
  const playerConfigs = [];

  /* --------------------------------------------------
     Utility
  -------------------------------------------------- */
  function showOnly(element) {
    [startScreen, playersScreen, setupScreen].forEach(div => {
      div.style.display = "none";
    });
    element.style.display = "block";
  }

  function advanceToMainView() {
    altView.style.display = "none";
    mainView.style.display = "flex";
  }

  /* --------------------------------------------------
     Initialize UI
  -------------------------------------------------- */
  // altView.appendChild(startScreen);
  // altView.appendChild(playersScreen);
  // altView.appendChild(setupScreen);

  showOnly(startScreen);
  mainView.style.display = "none";

  /* --------------------------------------------------
     Start Screen
  -------------------------------------------------- */

  function clickStart() { showOnly(playersScreen); }

  startBtn.addEventListener("click", () => clickStart());

  /* --------------------------------------------------
     Player Count Selection
  -------------------------------------------------- */
  playersScreen.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.id;
      const humans = parseInt(id[0], 10); // e.g. "2-v-1"
      totalHumanPlayers = humans;
      currentPlayerIndex = 0;
      playerConfigs.length = 0;
      prepareSetupForPlayer();
    });
  });

  /* --------------------------------------------------
     Setup Screen Logic
  -------------------------------------------------- */
  function prepareSetupForPlayer() {
    document.getElementById("player-idx").innerHTML = (currentPlayerIndex + 1).toString();
    nameInput.value = "Name";
    sexSelect.value = "Male";
    jobSelect.value = "Warrior";
    colorSelect.value = "Red";

    showOnly(setupScreen);
  }

  doneBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const sex = sexSelect.value;
    const job = jobSelect.value;
    const color = colorSelect.value;

    if (!name) {
      alert("Name is required.");
      return;
    }

    if (currentPlayerIndex === 1) {
      if (playerConfigs[0].name === name) {
        alert("Second player may not have the same name.");
        return;
      }
      // color overlaps shouldn't happen anyway due to disabled option
      if (playerConfigs[0].color === color) {
        alert("Second player may not have the same color.");
        return;
      }
    }
    
    document.getElementById(`${color}-opt`).disabled = true;

    playerConfigs.push({ name, sex, job, color });
    currentPlayerIndex++;

    if (currentPlayerIndex < totalHumanPlayers) {
      prepareSetupForPlayer();
    } else {
      advanceToMainView();
      console.log("Players configured:", playerConfigs);
    }
  });

  document.addEventListener("keydown", function(event) {
    // Check if the key pressed is the 'Enter' key
    if (event.key === "Enter") {
      // Optional: Prevent the default action (e.g., form submission if one is present)
      // event.preventDefault();

      if (startScreen.style.display === "block") {
        clickStart();
      };
    } else if (event.key === "ArrowUp") {
      ;
    }
  });
});