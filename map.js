const ISLAND_MAP = `
C - I - C           X
|       |           |
C       C       C - C - I               C - C
|       |       |       |               |   |
C       C       M - - - C - - - C - C - M   C
|       |       |                           |
C       C - - - C                           C
|                                           |
M < I < W                       I > W > $ - C
v       ^                       ^       v   |
I   $ - $ - $ - $ - - - $ - $ - S < I   M - C
v   ^                               ^   v
S > I                               S < I
    |                               |
    $                               W
    |                               |
    S                               $
    |                               |
    $ - M - I - I < I > M - $ - I - I
                    |
                    x
`;

const CONNECTORS = new Set(["-", "|", "<", ">", "^", "v"]);

function asciiMapToMapCharArr(ascii) {
  const lines = ascii.replace(/\t/g, "    ").trimEnd().split("\n");
  const width = Math.max(...lines.map(l => l.length));
  const fullGrid = lines.map(l => l.padEnd(width, " ").split(""));
  return fullGrid.map(l => l.filter((c, i) => { return !(i % 2) }));
}

const islandCharArr = asciiMapToMapCharArr(ISLAND_MAP);
console.log("IN: ")
console.log(islandCharArr.map(l => l.join("")));

function makeNode(i, j, ch, grid) {
  if (grid[i][j]) return;
  grid[i][j] =  {
    kind: 'node',
    zn: 0,
    ch: ch,
    i: i,
    j: j,
    e: null,
    n: null,
    s: null,
    w: null
  }
  return grid[i][j];
}

function addEdge(i, j, ch, mapCharArr, grid) {
  if (grid[i][j]) return;
  let westNode, northNode, southNode, eastNode = [null, null, null, null];
  const nonPrimaries = [];
  switch (ch) {
    // caller scans i+ so there's no horizontal paths are
    // always encountered immediate right of a node
    case "-":
    case "<":
    case ">":
      westNode = grid[i-1][j];

      nonPrimaries.length = 0;
      // remember mapCharrArr index order is backwards
      while (mapCharArr[j][i + 1 + nonPrimaries.length] === ch)
        nonPrimaries.push([i + 1 + nonPrimaries.length, j]);

      eastNode = grid[i + 1 + nonPrimaries.length][j];

      if (ch !== "<") westNode.e = eastNode;
      if (ch !== ">") eastNode.w = westNode;

      break;
    case "|":
    case "v":
    case "^":
      northNode = grid[i][j - 1];

      nonPrimaries.length = 0;
      // remember mapCharrArr index order is backwards
      while (mapCharArr[j][i + 1 + nonPrimaries.length] === ch)
        nonPrimaries.push([i + 1 + nonPrimaries.length, j]);

      southNode = grid[i][j + 1 + nonPrimaries.length];

      if (ch !== "^") northNode.s = southNode;
      if (ch !== "v") southNode.n = northNode;

      break;
  }
  grid[i][j] = {
    kind: 'edge',
    zn: 0,
    ch: ch,
    i: i,
    j: j,
    e: eastNode,
    n: northNode,
    s: southNode,
    w: westNode,
    isPrimary: true
  }
  nonPrimaries.forEach(coord => {
    const [cI, cJ] = coord;
    grid[i][j] = {
      kind: 'edge',
      zn: 0,
      ch: ch,
      i: cI,
      j: cJ,
      e: eastNode,
      n: northNode,
      s: southNode,
      w: westNode,
      isPrimary: false
    }
  });
  return;
}

function mapCharArrToGrid(mapCharArr) {
  const grid = [];
  const width = mapCharArr[0].length;
  const height = mapCharArr.length;
  const connectors = new Set(["-", "<", ">", "|"]);
  let ch;

  // set all nodes first
  for (var i = 0; i < width; i++) {
    grid[i] = [];
    for (var j = 0; j < height; j++) {
      ch = mapCharArr[j][i];
      if (ch === ' ' || connectors.has(ch)) grid[i][j] = null;
      else makeNode(i, j, ch, grid);
    }
  }

  // then connect all roads using already existing nodes
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      ch = mapCharArr[j][i];
      if (connectors.has(ch)) addEdge(i, j, ch, mapCharArr, grid);
    }
  }

  return grid;
}

function printGrid(grid) {
  var [w, h] = [grid.length, grid[0].length];
  for (var j = 0; j < h; j++) {
    let line = "";
    for (var i = 0; i < w; i++) {
      line += "" + (grid[i][j]?.ch || " ");
    }
    console.log(line);
  }
}

const grid = mapCharArrToGrid(islandCharArr);

console.log("OUT: ")
printGrid(grid);

