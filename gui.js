const controlsEl = document.createElement("div");
controlsEl.style.border = "3px solid black";
controlsEl.style.width = "100px";
controlsEl.style.height = "600px";
// controlsEl.style.display = "inline-block";
controlsEl.style.backgroundColor = "violet";

const rollBtn = document.createElement("button");
rollBtn.style.width = "90%";
rollBtn.style.height = "10%";
rollBtn.style.margin = "5px 5px 5px 5px";
rollBtn.innerHTML = "Roll";
controlsEl.appendChild(rollBtn);

rollBtn.onclick = function() {
  const r = roll(6);
  console.log("Rolled " + r);
  setDist(p0, r);
  const dest = pickItem(p0.dests);
  movePlayer(p0, dest);
}

bodyEl.appendChild(controlsEl);