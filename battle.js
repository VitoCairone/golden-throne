function getDamage(enac, targ) {
	var dam = 1;
	var variance = 0;
	if (enac.Cmd === "Magic") {
		dam = enac.MG + Math.random() * 6 - targ.MG;
		variance = (enac.MG + targ.MG) * 0.05;
		dam += variance * (Math.random() * 2 - 1);

		if (targ.Cmd === "Ward") {
			blockRatio = 0.5 + Math.random() * 0.2;
			dam *= (1 - blockRatio);
		}
	} else {
		dam = 10 + enac.AT - targ.DF;
		variance = (enac.AT + targ.DF) * 0.05;
		dam += variance * (Math.random() * 2 - 1);

		var blockRatio = 0;
		if (targ.Cmd === "Defend") {
			blockRatio = 0.5 + Math.random() * 0.2;
			if (enac.Cmd === "Superstrike") {
				// Superstrike ignores 50-70% Defend effect
				blockRatio *= (0.3 + Math.random() * 0.2);
			}
		}
		dam *= (1 - blockRatio);
	}
	if (dam < 0.5) return 0;
	return Math.round(dam, 0);
}

function hitRate(enac, targ) {
  const chance = 0.75 + (enac.SP - targ.SP) * 0.002;
  return Math.max(0.25, Math.min(0.95, chance));
}

function doesAGoFirst(a, b) {
	const aSP = a.SP * (0.85 + Math.random() * 0.3);
	const bSP = b.SP * (0.85 + Math.random() * 0.3);
	if (aSP === bSP) return (Math.random() >= 0.5);
	return aSP > bSP;
}

const startClasses = {
	warrior: {AT: 5, DF: 4, MG: 1, SP: 2, MHP: 5,
		level: {AT: 2, DF: 1, MHP: 1},
		skills: [
			{name: "Muscle", effect: "AT & DF +50%"},
			{name: "Overload", effect: "Double AT on success, half DF on failure" }
		],
		field: "At turn start, chance to gain AT Boost"
	},
	mage: {AT: 5, DF: 2, MG: 3, SP: 3, MHP: 4, 
		level: {MG: 2, SP: 1, MHP: 1},
		skills: [
			{ name: "Meditate", effect: "Doubles MG" },
			{ name: "Restrict", effect: "Seals one random enemy command"}
		],
		field: "Can use 2 Field Magic per turn"
	},
	thief: {AT: 5, DF: 3, MG: 1, SP: 4, MHP: 4,
		level: {AT: 1, SP: 2, MHP: 1},
		skills: [
			{name: "Steal", effect: "Steal posesssions or gold"},
			{name: "Escape", effect: "Exit battle with no penalty"}
		],
		field: "Steal opponent posessions when passing by"
	},
};

function levelUp(fi, times = 1, stats = "auto") {
  const cls = allClasses[fi.cls]
  const clsStats = Object.keys(cls.level);
  // TODO: reporting
  clsStats.forEach(stat => {
    fi.base[stat] += cls.level[stat] * times;
  });
  if (stats === "auto") {
    for (var i = 0; i < (2 * times); i++) {
      var randStat = pickItem(allFiveStats);
      fi.base[randStat] += 1;
    }
  } else {
    console.log("NYI - non-auto stat level up");
  }
  battleReset(fi);
}

const startClassList = Object.keys(startClasses);
startClassList.forEach(cls => {
	startClasses[cls].name = cls;
})

const allClasses = {
	cleric: {
		level: {MG: 1, DF: 1, MHP: 2},
		skills: [
			{name: "Heal", effect: "Recover HP"},
			{name: "Prayer", effect: "Random Stat +50% or Status Immunity"}
		]
	},
	ninja: {
		level: {AT: 2, SP: 2},
		skills: [
			{name: "Sneak Hit", effect: "Cut enemy HP in half + instant KO chance"},
			{name: "Stealth", effect: "Triple SP + Vanish until any damage dealt"}
		],
		field: "Mark opponents on passing by. Battle opponent within 3 turns for +50% AT & SP"
	},
	windrunner: {
		level: {SP: 3, AT: 1},
		skills: [
			{name: "Quicken", effect: "Doubles SP"},
			{name: "Reflexes", effect: "Chance [[Speed Portion max 50%]] to swap to best Reaction"}
		],
		field: "Random chance (25%*) to begin with Double Spinner"
	},
	titan: {
		level: {DF: 2, MHP: 2},
		skills: [
			{name: "Steel Guard", effect: "Doubles DF"},
			{name: "Unstoppable", effect: "Status Immunity"}
		],
		field: "Acts as Blockade to all opponents"
	},
	alchemist: {
		level: {AT: 1, DF: 1, MG: 2},
		skills: [
			{name: "Item", effect: "Use an Item or Field Magic in battle"},
			{name: "Mix", effect: "Mix two Items or Field Magics in battle"}
		],
		field: "Chance at turn start to duplicate Items or Field Magics"
	},
	charmer: {
		level: {SP: 1, DF: 1, MG: 2},
		skills: [
			{name: "Tame", effect: "Charm an enemy below your level."},
			{name: "Enchant", effect: "Charm an enemy for a while."}
		],
		field: "All Gold purchases discounted 20%."
	},
	wizard: {
		level: { DF: 1, MG: 3},
		skills: [
			{name: "Magic Blast", effect: "Stops enemy in place"},
			{name: "Grand Power", effect: "MG & SP Doubled & Vanish until any damage dealt"}
		],
		field: "Field Magic Power +50% and Teleport between Temples."
	},
	necromancer: {
		level: { SP: 1, MG: 3},
		skills: [
			{name: "Corrupt", effect: "Halves a random enemy stat"},
			{name: "Undying", effect: "Chance to revive from KO with 10% HP and All Stats +50%."}
		],
		field: "Defeated foes may be resurrected as Undead."
	},
	hybrid: {
		level: {AT: 1, MG: 1, SP: 1, DF: 1},
		skills: [
			{name: "Wild Power", effect: "Replace this at battle start with a random Skill"},
			{name: "Mirror Match", effect: "Become a copy of the enemy"}
		],
		field: "Equip any 1 or 2 learned Skills and any learned Field Bonus."
	}
}

startClassList.forEach(starter => {
	allClasses[starter] = startClasses[starter];
});
const allClassesList = Object.keys(startClasses);

var g_nextId = 1;

function getNextId() {
	var nextId = g_nextId;
	g_nextId += 1;
	return nextId;
}

function pickItem(list) {
	if (!list || !(list.length)) return list;
	return list[Math.floor(Math.random() * list.length)];
}

function randomClass() {
	return pickItem(["mage", "thief", "warrior"]);
}

const allFiveStats = ["AT", "DF", "SP", "MG", "MHP"]
// TODO: consider removing allSix and always handle HP separately
const allSixStats = ["AT", "DF", "HP", "SP", "MG", "MHP"];

function capStart(str) {
  if (!str || !str?.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function makeFi(opts) {
	const def = startClasses;
	const cls = opts?.cls || randomClass();
	const newFi = {
		id: opts?.id || getNextId(),
		base: {},
		cls: cls,
		AT: opts?.AT || def[cls].AT,
		DF: opts?.DF || def[cls].DF,
		HP: opts?.HP || opts?.MHP * 10 || def[cls].MHP * 10,
		SP: opts?.SP || def[cls].SP,
		MG: opts?.MG || def[cls].MG,
		MHP: opts?.MHP || def[cls].MHP,
		name: opts?.name || capStart(cls),
		oppId: null,
		priorAtkCmd: null,
		priorDefCmd: null,
		Skill: "Charge",
		Magic: "Pickpocket",
		isSkillOn: false,
	}
	allSixStats.forEach(stat => {
		newFi.base[stat] = newFi[stat];
	});
	return newFi;
}

function execSkill(enac, targ = null) {
	switch (enac.Skill) {
		case "Charge":
			const bestAT = Math.max(enac.AT, enac.base.AT);
			enac.AT = Math.round(enac.AT + 0.5 * bestAT, 0);
			enac.isSkillOn = true;
			console.log(`${enac.name}'s AT rose to ${enac.AT}!`)
			break;
		default:
			console.log("ERR: UNKNOWN SKILL");
	}
	return {winner: null, result: null};
}

function applyDamage(struck, dam) {
	struck.HP -= dam;
	if (struck.HP <= 0) struck.HP = 0;
}

function report(code, opts) {
	var enac, targ, struck, dam;
	switch (code) {
		case "miss":
			enac = opts.enac;
			targ = opts.targ;
			console.log(`${enac.name} misses ${targ.name} with ${enac.Cmd}.`);
			break;
		case "counter-miss":
			enac = opts.enac;
			targ = opts.targ;
			console.log(`${targ.name} misses ${enac.name} with Counter-Attack.`);
			break;
		case "struck":
			struck = opts.struck;
			dam = opts.dam;
			var atkName = struck.opp.Cmd;
			if (opts.counterResult === "hit") atkName === "Counter"
			else if (atkName === "Magic") atkName = struck.opp.Magic;
			else if (atkName === "Skill") atkName = struck.opp.Skill;

			if (opts.counterResult === "pierce")
				console.log(`${struck.opp.name} broke through ${struck.name}'s Counter!`);
			console.log(`${struck.opp.name} strikes ${struck.name} with ${atkName} for ${dam} damage!`)
			console.log(`${struck.name} has ${struck.HP} HP remaining!`)
			break;
		case "KO":
			console.log(`${opts.kod.name} is defeated!`);
			break;
		case "commands":
			enac = opts.enac;
			targ = opts.targ;
			console.log(`${enac.name} used ${enac.Cmd}. ${targ.name} used ${targ.Cmd}.`);
	}
}

function resolveBatRound(enac, targ) {
	if (targ.Cmd === "Give Up")
		return {winner: enac, result: "forfeit"};

	report("commands", {enac, targ});

	if (enac.Cmd === "Skill")
		return execSkill(enac, targ);
	
	const isCounterAttempt = (enac.Cmd === "Superstrike" && targ.Cmd === "Counter");
	var doesHit = hitRate(enac, targ) >= Math.random();
	if (doesHit) {
		var dam = getDamage(enac, targ);
		var counterResult = null;
		if (isCounterAttempt) {
			if (Math.random() < 0.1) { // TODO: vary based on SPD
				counterResult = "pierce";
			} else {
				counterResult = hitRate(targ, enac) >= Math.random() ? "hit" : "miss";
			}
		}
		if (counterResult === "miss") {
			report("counter-miss", {enac, targ});
			return {winner: null, result: null};
		}
		const struck = counterResult === "hit" ? enac : targ;
		struck.opp = struck === enac ? targ : enac;
		applyDamage(struck, dam);
		report("struck", {struck, dam, counterResult});
		// assume no double KOs for now
		if (targ.HP <= 0) {
			report("ko", {kod: targ});
			return {winner: enac, result: "KO"};
		}
		if (enac.HP <= 0) {
			report("ko", {kod: enac});
			return {winner: targ, result: "KO"};
		}
	} else {
		report("miss", {enac, targ});
	}

	return {winner: null, result: null}
}

function setCommand(player, mode) {
  var opts;
  if (mode === "act") {
    opts = ["Attack", "Superstrike", "Magic"];
    if (!player.isSkillOn) opts = opts.concat(["Skill"]);
  } else {
    opts = ["Defend", "Counter", "Ward"];
  }
  player.Cmd = pickItem(opts);
}

function battleReset(fi) {
	allSixStats.forEach(stat => {
		fi[stat] = fi.base[stat];
	});
	fi.isSkillOn = false;
}


const OUT_LEN = 78;
function banner() { return "=".repeat(OUT_LEN); }
function center(text, char = " ") {
  const rptLen = (OUT_LEN - text.length - 2)/2;
  return char.repeat(rptLen) + " " + text + " " + char.repeat(rptLen);
}

function fullBattle(p1, p2) {
  console.log(banner());
  console.log(center(`${p1.name} vs ${p2.name}!`))
  console.log(center("Battle Start!"))
  console.log(banner());
	battleReset(p1);
	battleReset(p2);
	var enac, targ;
	var p1Spd = Math.random() * p1.SP;
	var p2Spd = Math.random() * p2.SP;
	if (p1Spd > p2Spd) {
		enac = p1;
		targ = p2;
	} else {
		enac = p2;
		targ = p1;
	}

	var result = {};
	while (!result.winner) {
		setCommand(enac, "act");
		setCommand(targ, "react");
		result = resolveBatRound(enac, targ);
		var oldTarg = targ;
		targ = enac;
		enac = oldTarg;
	}
}

const fi1 = makeFi();
const fi2 = makeFi(
	{cls: pickItem(startClassList.filter(cls => cls != fi1.cls))}
);

fullBattle(fi1, fi2);