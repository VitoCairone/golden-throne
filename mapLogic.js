let actPhase = null;

function setDist(p, dist) {
  p.dist = dist;
  p.dests = nodesAtDist(p.loc, dist);
  p.dests.forEach(d => showDestination(d));
  actPhase = "Choose Destination";
}

function movePlayer(p, dest) {
  p.loc = dest;
  p.dests.forEach(d => unshowDestination(d));
  movePlayerPiece(p);
  p.dests.length = 0;
  actPhase = "Others Players Moving";
}