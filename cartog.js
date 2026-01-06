const grid = asciiMapToGrid(ISLAND_MAP);
const [gridW, gridH] = [grid.length, grid[0].length];

const bodyEl = document.getElementsByTagName("body")[0];
bodyEl.style.backgroundColor = "#0f0";
for (var j = 0; j < gridH; j++) {
  for (var i = 0; i < gridW; i++) {
    let ch = grid[i][j]?.ch || "b";
    let div = document.createElement("div");
    div.id = `grid-${i}-${j}`;
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.left = `${i * 30}px`;
    div.style.top = `${j * 30}px`;
    div.style.backgroundColor = `#0f0`;
    console.log("ch = " + ch);
    switch (ch) {
      case "-":
      case "<":
      case ">":
        // console.log("horiz");
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
        // console.log("vert");
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
    bodyEl.appendChild(div);
  }
}

console.log("Ran cartog")
console.log([gridW, gridH]);