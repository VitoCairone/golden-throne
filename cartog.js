const grid = asciiMapToGrid(ISLAND_MAP);
const [gridW, gridH] = [grid.length, grid[0].length];

const tilePx = 30;

const bodyEl = document.getElementsByTagName("body")[0];
bodyEl.style.backgroundColor = "#0f0";
bodyEl.style.display = "flex";

const fieldEl = document.getElementById("field");
fieldEl.style.width = gridW * tilePx;
fieldEl.style.height = gridH * tilePx;

for (var j = 0; j < gridH; j++) {
  for (var i = 0; i < gridW; i++) {
    let ch = grid[i][j]?.ch || "b";
    let div = document.createElement("div");
    div.id = `grid-${i}-${j}`;
    div.style.width = `${tilePx}px`;
    div.style.height = `${tilePx}px`;
    div.style.left = `${i * tilePx}px`;
    div.style.top = `${j * tilePx}px`;
    div.style.backgroundColor = `#0f0`;
    // report("ch = " + ch);
    switch (ch) {
      case "-":
      case "<":
      case ">":
        // report("horiz");
        div.style.borderTop = "10px solid #0f0";
        div.style.borderBottom = "10px solid #0f0";
        div.style.height = "10px";
        // div.style.borderTop = "3px solid #0f0";
        // div.style.borderBottom = "3px solid #0f0";
        div.style.backgroundColor = "#550";
        break;
      case "|":
      case "^":
      case "v":
        // report("vert");
        div.style.borderLeft = "10px solid #0f0";
        div.style.borderRight = "10px solid #0f0";
        div.style.width = "10px";
        div.style.backgroundColor = "#550";
        break;
      case "$":
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "gold";
        div.innerHTML = `<center>$</center>`;
        break;
      case "C":
        div.style.borderRadius = "15px";
        div.style.backgroundColor = "yellow";
        break;
      case "I":
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "green";
        break;
      case "M":
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "purple";
        break;
      case "W":
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "cyan";
        break;
      case 'x':
        div.style.borderRadius = "15px";
        div.style.backgroundColor = "white";
        break;
      case "S":
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "silver";
        break;
      case "X":
        div.style.backgroundColor = "red";
        div.style.borderRadius = "15px"
    }
    div.style.position = "absolute";
    div.className = `grid ch-${ch}`;

    if (ch !== "b") grid[i][j].el = div;

    if (grid[i][j]?.kind === "node") {
      const node = grid[i][j];
      div.onclick = function() { clickNode(node); }
    }

    fieldEl.appendChild(div);
  }
}

const startNode = nodesByChar['x'][0];
const colors = [
  "red", "green", "blue", "yellow", "orange", "purple"
]
let freeColors = [...colors];

function toUpper(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function makePlayer(idx) {
  // this method returns a Player,
  // with fields used on the Map, excepting in Combat
  const p = {
    id: idx,
    gold: 0,
    items: [],
    fieldMagics: [],
    loc: startNode,
  };
  console.log("made ")
  console.log(p);
  p.color = pickItem(freeColors);
  freeColors = freeColors.filter(c => c !== p.color);
  p.name = toUpper(p.color);
  p.isHuman = (p.id === 0);

  makeFighterByClass(p);

  console.log(`Called setFighterStartClass for ${p.name}}`)

  const div = document.createElement("div");
  // div.style.backgroundColor = p.color;
  // div.style.width = "15px";
  // div.style.height = "15px";
  div.style.width = "0px";
  div.style.height = "0px";
  div.style.borderLeft = `20px solid transparent`;
  div.style.borderRight = `20px solid transparent`;
  div.style.borderBottom = `20px solid ${p.color}`;
  div.style.position = "absolute";
  div.style.zIndex = 104 - p.id;
  p.el = div;

  movePlayerPiece(p);
  fieldEl.appendChild(div);
  return p;
}

function movePlayerPiece(p) {
  p.el.style.left = `${Math.round(tilePx * p.loc.i + (p.id - 2) * (tilePx / 3), 0)}px`;
  p.el.style.top = `${tilePx * p.loc.j + 4}px`;
}

function showDestination(node) { 
  // report("show");
  // report(node);
  node.el.style.border = "5px solid white"; 
  node.el.style.height = `${tilePx - 10}px`; 
  node.el.style.width = `${tilePx - 10}px`; 
}

function unshowDestination(node) { 
  node.el.style.border = "none"; 
  node.el.style.height = `${tilePx}px`; 
  node.el.style.width = `${tilePx}px`; 
}