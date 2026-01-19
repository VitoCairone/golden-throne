const [p0, p1, p2, p3] = [0, 1, 2, 3].map(idx => makePlayer(idx));
p0.nextPlayer = p1;
p1.nextPlayer = p2;
p2.nextPlayer = p3;
p3.nextPlayer = p0;

actPlayer = p0;

// console.log("!!!!!!!");
// console.log(p0)

showPlayerInfo();