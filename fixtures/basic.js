const a = { x: 10, y: 20 };
a.x = 99;
a.y++;

function add(a, b) {
  return a + b;
}

add(a.x, a.y);
