WEAPON_AT_BY_NAME = {
  'Stick': 2,
  'Dagger': 10,
  'Sword': 20,
  'Longsword': 25
}

SHIELD_DF_BY_NAME = {
  'Makeshift Shield': 2,
  'Wood Shield': 4,
  'Sturdy Shield': 8,
  'Iron Shield': 10
}

function weaponAT(x) {
  let name = x?.weapon ? x.weapon : x;
  if (name in WEAPON_AT_BY_NAME) return WEAPON_AT_BY_NAME[name];
  console.log("ERR: Invalid arg to weaponAT");
  console.log(x);
  return 0;
}

function shieldDF(x) {
  let name = x?.shield ? x.shield : x;
  if (name in SHIELD_DF_BY_NAME) return SHIELD_DF_BY_NAME[name];
  console.log("ERR: Invalid arg to shieldDF");
  console.log(x);
  return 0;
}

function setWeapon(p, weapon) {
  // TODO: When setting a stat change, re-sum all active things on base
  // if (p.weapon) p.AT -= weaponAT(p);
  p.weapon = weapon;
  // p.AT += weaponAT(p);
}

function setShield(p, shield) {
  // TODO: When setting a stat change, re-sum all active things on base
  // if (p.shield) p.DF -= shieldDF(p);
  p.shield = shield;
  // p.DF += shieldDF(p);
}

function startSpinner(kind, p) {
  let choices;
  // console.log(kind);
  switch (kind) {
    case "Item": choices = ["1 Crystal", "2 Crystal", "5 Crystal", "2 Spinner", "Power Potion", "Manabrew"];
    break;
    case "Magic": choices = ["Scorch", "Scorch", "Zap", "Slow", "Chill", "Enfeeble"];
    break;
    case "Weapon": choices = ["Stick", "Dagger", "Dagger", "Sword", "Sword", "Longsword"];
    break;
    case "Shield": choices = ["Wood Shield", "Wood Shield", "Sturdy Shield", "Sturdy Shield", "Makeshift Shield", "Iron Shield"]
    break;
    case "Gold": choices = [10, 25, 50, 50, 100, 200];
    break;
    default:
      console.log("ERR: Unknown kind to startSpinner");
      console.log(kind);
      return;
  }

  const got = pickItem(choices);
  switch (kind) {
    case "Gold": p.gold += got; break;
    case "Magic": p.fieldMagics.push(got); break;
    case "Item": p.items.push(got); break;
    case "Weapon": setWeapon(p, got); break;
    case "Shield": setShield(p, got); break;
  }

  console.log(`${p.name} got ${got}${kind === "Gold" ? " gold" : ""} from ${kind} space.`);
}

let actPhaseIdx = 0;
const phaseNames = [
  'Field Action', // currently this is just Roll but will have other options
  'Choose Destination',
  // 'Arrived',
  'Next Player',
]

function advancePhase() {
  // phase names should suggest the player input waited on.
  actPhaseIdx = (actPhaseIdx + 1) % 3;
  console.log(`--- ${actPlayer.name} (${actPlayer.idx}) phase ${actPhaseIdx} ---`);
  switch (actPhaseIdx) {
    case 0:
      if (actPlayer.isHuman) {
        enableRoll();
      } else {
        clickRoll();
      }
      break;
    case 1: 
      if (actPlayer.isHuman) {
        disableRoll();
      } else {
        // TODO: intentful movement for CPU players
        clickNode(pickItem(actPlayer.dests));
      }
      break;
    case 2:
      actPlayer = actPlayer.nextPlayer;
      console.log(`${actPlayer.name}'s turn!`)
      advancePhase();
  }
}

function startCombat(p) {
  console.log("Combat from Map NYI");
  return;
}

function endGame(first) {
  console.log(`${first.name} arrived first! ${first.name} gained 200 Bonus gold!)`);
  // ignore exact ties for now
  let winner = p0;
  [p1, p2, p3].forEach(p => {
    if (p.gold > winner.gold) winner = p;
  });
  console.log(`${winner.name} is the winner!`);
}

function runArrival(p) {
  switch (p.loc.ch) {
    case "C": return startCombat(p); // TODO: random encounters
    case "I": return startSpinner("Item", p);
    case "M": return startSpinner("Magic", p);
    case "$": return startSpinner("Gold", p);
    case "W": return startSpinner("Weapon", p);
    case "S": return startSpinner("Shield", p);
    case "X": return endGame(p);
    default:
      console.log("ERR: unhandled arrival node ch");
      console.log(p.loc.ch);
  }
}

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
  runArrival(p);
}