function movePlayer(p, dist) {
  const dests = nodesAtDist(p.loc, dist);
  const dest = pickItem(dests);
  // const oldLoc = p.loc;
  p.loc = dest;
  movePlayerPiece(p);
}