player = {
  x: 1,
  y: 1,
  v_y: 0,
  v_x: 0.125,
  w: 11/16,
  h: 1,  
  j: 0.5,
  dir: 1,
  walk: 2
};
g = 0.05;
time_warp = -1;

player_path = [];


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
  
  block = loadImage("v05/images/lab_block.png");
  human_right = loadImage("v05/images/human_right.png");
  human_left = loadImage("v05/images/human_left.png");
  human_walking_right = [];
  human_walking_right[0] = loadImage("v05/images/human_walking_right_0.png");
  human_walking_right[1] = loadImage("v05/images/human_walking_right_1.png");
  human_walking_left = [];
  human_walking_left[0] = loadImage("v05/images/human_walking_left_0.png");
  human_walking_left[1] = loadImage("v05/images/human_walking_left_1.png");
}

function draw() {
  //gravity
  player.v_y -= g;
  
  //vertical collision
  //up
  if (player.v_y > 0) {
    if (game_environment[floor(player.x)][ceil(player.y + player.v_y)] == 0 && game_environment[floor(player.x + player.w)][ceil(player.y + player.v_y)] == 0) {
      player.y += player.v_y;
    }
    else {
      player.v_y = 0;
      player.y = ceil(player.y);
    }
  }
  //down
  if (player.v_y < 0) {
    if (game_environment[floor(player.x)][floor(player.y + player.v_y)] == 0 && game_environment[floor(player.x + player.w)][floor(player.y + player.v_y)] == 0) {
      player.y += player.v_y;
    }
    else {
      player.v_y = 0;
      player.y = floor(player.y);
    }
  }
  
  //horizontal movement
  if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && game_environment[floor(player.x + player.v_x + player.w)][floor(player.y)] == 0 && game_environment[floor(player.x + player.v_x + player.w)][ceil(player.y)] == 0) {
    player.x += player.v_x;
    player.dir = 1;
    player.walk += 0.1;
    player.walk = player.walk % 2;
  }
  else if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && game_environment[floor(player.x - player.v_x)][floor(player.y)] == 0 && game_environment[floor(player.x - player.v_x)][ceil(player.y)] == 0) {
    player.x -= player.v_x;
    player.dir = 0;
    player.walk += 0.1;
    player.walk = player.walk % 2;
  }
  else {
    player.walk = 2;
  }
  
  //jumping
  if (keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW) && (game_environment[floor(player.x)][player.y - 1] == 1 || game_environment[ceil(player.x)][player.y - 1] == 1)) {
    player.v_y = player.j;
  }
  background(0);
  for (var i = 0; i < game_environment.length; i++) {
    for (var j = 0; j < game_environment[i].length; j++) {
      if (game_environment[i][j] == 1) {
        image(block, scale*i, height - scale*(j+1), scale*1, scale*1);
      }
    }
  }
  ShowPlayer(player.x, player.y, player.dir, player.walk);
  //if (time_warp < 0) {
    player_path.push([player.x, player.y, player.dir, player.walk]);
  //}
  if (time_warp >= 0) {
    ShowPlayer(player_path[time_warp][0], player_path[time_warp][1], player_path[time_warp][2], player_path[time_warp][3]);
    time_warp += 1;
  }
}

function ShowPlayer(x, y, d, w) {
  if (d == 0) {
    if (w == 2) {
      image(human_left, scale*x, height - scale*(y + 1), scale*1, scale*1);
    }
    else {
      image(human_walking_left[floor(w)], scale*x, height - scale*(y + 1), scale*1, scale*1);
    }
  }
  else {
    if (w == 2) {
      image(human_right, scale*x, height - scale*(y + 1), scale*1, scale*1);
    }
    else {
      image(human_walking_right[floor(w)], scale*x, height - scale*(y + 1), scale*1, scale*1);
    }
  }
}

function keyReleased() {
  if (key == " ") {
    time_warp = 0;
  }
}
