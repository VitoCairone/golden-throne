let actPhase = null;

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
  if (typeof x === "string") return WEAPON_AT_BY_NAME[x];
  if (x?.weapon) return WEAPON_AT_BY_NAME[x.weapon];
  console.log("ERR: Invalid arg to weaponAT");
  console.log(weaponNameOrPlayer);
  return 0;
}

function shieldDF(x) {
  if (typeof x === "string") return SHIELD_DF_BY_NAME[x];
  if (x?.shield) return SHIELD_DF_BY_NAME[x.shield];
  console.log("ERR: Invalid arg to weaponAT");
  console.log(weaponNameOrPlayer);
  return 0;
}

function setWeapon(p, weapon) {
  // TODO: When setting a stat change, re-sum all active things on base
  if (p.weapon) p.AT -= weaponAT(p);
  p.weapon = weapon;
  p.AT += weaponAT(p);
}

function setShield(p, shield) {
  // TODO: When setting a stat change, re-sum all active things on base
  if (p.shield) p.DF -= shieldDF(p);
  p.shield = shield;
  p.DF += shieldDF(p);
}

function startSpinner(kind, p) {
  let choices;
  // console.log(kind);
  switch (kind) {
    case "Item": choices = ["1 Crystal", "2 Crystal", "5 Crystal", "2 Spinner", "Power Potion", "Manabrew"];
    break;
    case "Magic": choices = ["Scorch", "Scorch", "Zap", "Slow", "Chill", "Enfeeble"];
    break;
    case "Weapon": chocies = ["Stick", "Dagger", "Dagger", "Sword", "Sword", "Longsword"];
    break;
    case "Shield": choices = ["Wood Shield", "Wood Shield", "Sturdy Shield", "Sturdy Shield", "Makeshift Shield", "Iron Shield"]
    break;
    case "Coin": choices = [10, 25, 50, 50, 100, 200];
    break;
  }
  const got = pickItem(choices);

  switch (kind) {
    case "Coin": p.coins += got; break;
    case "Magic": p.fieldMagics.push(got); break;
    case "Item": p.items.push(got); break;
    case "Weapon": setWeapon(p, weapon); break;
    case "Shield": setShield(p, shield); break;
  }

  console.log(`Player got ${got}${kind === "Coins" ? " coins" : ""} from ${kind} space.`);
}

function startCombat(p) {
  console.log("Combat from Map NYI");
  return;
}

function runArrival(p) {
  switch (p.loc.ch) {
    case "C":
      // TODO: random encounters
      return startCombat(p);
    case "I": return startSpinner("Item", p);
    case "M": return startSpinner("Magic", p);
    case "$": return startSpinner("Coin", p);
  }
}

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
  actPhase = "Arrival"
  runArrival(p);
}