player = {
  x: 1,
  y: 1,
  v_y: 0,
  v_x: 0.125,
  w: 1,
  h: 1
};


function setup() {
  createCanvas(1024, 512);
  frameRate(50);
  scale = 64;
  game_width = width/scale; //16
  game_height = height/scale; //8
  
  game_environment = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];
}

function draw() {
  if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && game_environment[floor(player.x + player.v_x + player.w - 0.001)][floor(player.y)] == 0 && game_environment[floor(player.x + player.v_x + player.w - 0.001)][ceil(player.y)] == 0) {
    print(player.x + player.v_x);
    player.x += player.v_x;
  }
  else if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && game_environment[floor(player.x - player.v_x)][floor(player.y)] == 0 && game_environment[floor(player.x - player.v_x)][ceil(player.y)] == 0) {
    player.x -= player.v_x;
  }
  background(0);
  for (var i = 0; i < game_environment.length; i++) {
    for (var j = 0; j < game_environment[i].length; j++) {
      if (game_environment[i][j] == 1) {
        noStroke();
        fill(255, 0, 0);
        rect(scale*i, height - scale*(j + 1), scale*1, scale*1);
      }
    }
  }
  ShowPlayer();
}

function ShowPlayer() {
  noStroke();
  fill(0, 0, 255);
  rect(scale*player.x, height - scale*(player.y + 1), scale*1, scale*1);
}
