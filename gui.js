let inputContext = null;

const controlsEl = document.getElementById("controls");
controlsEl.style.border = "3px solid black";
controlsEl.style.width = "300px";
controlsEl.style.height = "600px";
controlsEl.style.backgroundColor = "violet";

const rollBtn = document.getElementById("roll-btn");
rollBtn.style.width = "90%";
rollBtn.style.height = "10%";
rollBtn.style.margin = "5px 5px 5px 5px";
rollBtn.innerHTML = "Roll";

let reportLines = [];
const REPORT_LINE_LIMIT = 22;
const reportEl = document.getElementById("history");

let actPlayer;

rollBtn.onclick = function() { clickRoll(); }

function clickRoll() {
  const r = roll(6);
  report(`${actPlayer.name} rolled a ${r}.`);
  setDist(actPlayer, r);
  inputContext = "move";
  advancePhase();
}

function clickNode(node) {
  if (actPlayer.dests.includes(node)) {
    movePlayer(actPlayer, node);
    advancePhase();
  }
  inputContext = null;
}

function enableRoll() {
  rollBtn.disabled = false;
}

function disableRoll() {
  rollBtn.disabled = true;
}

function showPlayerInfo() {
  document.getElementById("player-name").innterHTML = p0.name;
  document.getElementById("HP").innerHTML = `HP: ${p0.HP}/${p0.base.HP}`;
  ["AT", "DF", "MG", "SP"].forEach(stat => {
    document.getElementById(stat).innerHTML = `${stat}: ${parseInt(p0[stat])}`;
  })
}

function report(line) {
  if (reportLines.length > REPORT_LINE_LIMIT) reportLines.shift();
  reportLines.push(line);
  reportEl.innerHTML = reportLines.join("<br>\n");
}