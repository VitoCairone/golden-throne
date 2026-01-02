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

function asciiMapToGrid(ascii) {
  const lines = ascii.replace(/\t/g, "    ").trimEnd().split("\n");
  const width = Math.max(...lines.map(l => l.length));
  const fullGrid = lines.map(l => l.padEnd(width, " ").split(""));
  return fullGrid.map(l => l.filter((c, i) => { return !(i % 2) }));
}

console.log(asciiMapToGrid(ISLAND_MAP).map(l => l.join("")));

function exitsOutFrom(grid, x, y) {

  // TODO: since nodes are presently read from maps,
  // just swep through and read all connections at once, no need to be
  // relative to anywhere or globally connected

  const w = grid[0].length;
  const h = grid.length;
  const rv = {};

  if (x >= 2 && (grid[y][x-1] === "-" || grid[y][x-1] === "<")) {
    rv.west = grid[y][x-2];
  }
  if (x <= w - 3 && (grid[y][x+1] === "-" || grid[y][x+1] === ">")) {
    rv.east = grid[y][x+2];
  }
  if (y >= 2 && (grid[y-1][x] === "|" || grid[y-1][x] === "^")) {
    rv.north = grid[y-2][x];
  }
  if (y <= h - 3 && (grid[y+1][x] === "|" || grid[y+1][x] === "v")) {
    rv.south = grid[y+2][x];
  }

  return rv;
}

function nodesAtExastDist(grid, x, y, dist) {
  // node = getNodeAt(x, y)
  const start = grid[y][x];
  const travelled = 0;
  exits = exitsOutFrom(x, y);
}
