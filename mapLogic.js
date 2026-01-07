function setDist(p, dist) {
  p.dist = dist;
  p.dests = nodesAtDist(p.loc, dist);
  p.dests.forEach(d => showDestination(d));
}

function movePlayer(p, dest) {
  p.loc = dest;
  p.dests.forEach(d => unshowDestination(d));
  movePlayerPiece(p);
  p.dests.length = 0;
}