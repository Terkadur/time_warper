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
game_state = 0; //0 is starting screen, 1 is gameplay, 2 is time travel
tim = 0;

player_path = [];

function preload() {
  block = loadImage("v08/images/lab_block.png");
  human_right = loadImage("v08/images/human_right.png");
  human_left = loadImage("v08/images/human_left.png");
  human_walking_right = [];
  human_walking_right[0] = loadImage("v08/images/human_walking_right_0.png");
  human_walking_right[1] = loadImage("v08/images/human_walking_right_1.png");
  human_walking_left = [];
  human_walking_left[0] = loadImage("v08/images/human_walking_left_0.png");
  human_walking_left[1] = loadImage("v08/images/human_walking_left_1.png");
  player_arrow = loadImage("v08/images/player_arrow.png");
  time_aura = loadImage("v08/images/time_aura.png");
  clock = loadImage("v08/images/clock.png");
  sheet = loadImage("v08/images/numbers.png");
  numbers = [];
}

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
  numbers[0] = sheet.get(0, 288, 64, 80);
  numbers[1] = sheet.get(0, 0, 64, 80);
  numbers[2] = sheet.get(80, 0, 64, 80);
  numbers[3] = sheet.get(160, 0, 64, 80);
  numbers[4] = sheet.get(0, 96, 64, 80);
  numbers[5] = sheet.get(80, 96, 64, 80);
  numbers[6] = sheet.get(160, 96, 64, 80);
  numbers[7] = sheet.get(0, 192, 64, 80);
  numbers[8] = sheet.get(80, 192, 64, 80);
  numbers[9] = sheet.get(160, 192, 64, 80);
  
  game_state = 1;
}

function draw() {
  if (game_state == 1) {
    tim += 0.02; //run time
    tim = round(tim*100)/100; //make time not dumb
    
    //gravity
    player.v_y -= g;
    
    //vertical collision
    //up
    if (player.v_y > 0) {
      if (game_environment[floor(player.x)][ceil(player.y + player.v_y)] == 0 && game_environment[floor(player.x + player.w)][ceil(player.y + player.v_y)] == 0) {
        player.y += player.v_y; //upwards movement
      }
      else {
        player.v_y = 0; //collision
        player.y = ceil(player.y); //sets position
      }
    }
    //down
    if (player.v_y < 0) {
      if (game_environment[floor(player.x)][floor(player.y + player.v_y)] == 0 && game_environment[floor(player.x + player.w)][floor(player.y + player.v_y)] == 0) {
        player.y += player.v_y; //downwards movement
      }
      else {
        player.v_y = 0; //collision
        player.y = floor(player.y); //sets positon
      }
    }
    
    //horizontal movement
    if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && game_environment[floor(player.x + player.v_x + player.w)][floor(player.y)] == 0 && game_environment[floor(player.x + player.v_x + player.w)][ceil(player.y)] == 0) {
      player.x += player.v_x; //rightwards movement
      player.dir = 1; //direction
      player.walk += 0.1; //animates walking (per 10 frames)
      player.walk = player.walk % 2;
    }
    else if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && game_environment[floor(player.x - player.v_x)][floor(player.y)] == 0 && game_environment[floor(player.x - player.v_x)][ceil(player.y)] == 0) {
      player.x -= player.v_x; //leftwards movement
      player.dir = 0; //direction
      player.walk += 0.1; //animates walking (per 10 frames)
      player.walk = player.walk % 2;
    }
    else {
      player.walk = 2; //stationary sprite
    }
    
    //jumping
    if (keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW) && (game_environment[floor(player.x)][player.y - 1] == 1 || game_environment[ceil(player.x)][player.y - 1] == 1)) {
      player.v_y = player.j; //jump
    }
    
    //path tracing
    if (time_warp < 0) {
      player_path.push([player.x, player.y, player.dir, player.walk]); //adds to path
    }
    else if (time_warp < player_path.length - 1) {
      time_warp += 1; //animates past player
    }
  }
  //environment
  background(0); //black background (design)
  for (var i = 0; i < game_environment.length; i++) {
    for (var j = 0; j < game_environment[i].length; j++) {
      if (game_environment[i][j] == 1) {
        image(block, scale*i, height - scale*(j+1), scale*1, scale*1); //shows metal block
      }
    }
  }
  image(clock, scale*7, height - scale*(7+1), scale*2, scale*1); //shows clock
  r = timeRender();
  image(numbers[r[0]], scale*(7 + 6/16), height - scale*(7 + 1 - 5/16), scale*4/16, scale*5/16);
  image(numbers[r[1]], scale*(7 + 11/16), height - scale*(7 + 1 - 5/16), scale*4/16, scale*5/16);
  image(numbers[r[2]], scale*(7 + 18/16), height - scale*(7 + 1 - 5/16), scale*4/16, scale*5/16);
  image(numbers[r[3]], scale*(7 + 23/16), height - scale*(7 + 1 - 5/16), scale*4/16, scale*5/16);
  showPlayer(player.x, player.y, player.dir, player.walk); //shows player
  //shows arrow
  if (player.dir == 0 && player.walk != 2) {
    image(player_arrow, scale*(player.x + 1/16), height - scale*(player.y + 1 + 3/16), scale*5/16, scale*3/16);
  }
  else {
    image(player_arrow, scale*(player.x + 3/16), height - scale*(player.y + 1 + 3/16), scale*5/16, scale*3/16);
  }
  
  if (game_state == 1 && time_warp >= 0) {
    showPlayer(player_path[time_warp][0], player_path[time_warp][1], player_path[time_warp][2], player_path[time_warp][3]); //shows past player
  }
  if (game_state == 2) {
    if (time_warp - 2 >= 0) {
      time_warp -= 2; //animates time travel backwards
      tim -= 0.04;
      tim = round(tim*100)/100;
    }
    else {
      time_warp = 0; //stops animation
      tim = 0;
      game_state = 1;
    }
    showPlayer(player_path[time_warp][0], player_path[time_warp][1], player_path[time_warp][2], player_path[time_warp][3]); //shows player during animation
    image(time_aura, 0, 0, width, height); //time aura
  }
}

function showPlayer(x, y, d, w) {
  if (d == 0) {
    if (w == 2) {
      image(human_left, scale*x, height - scale*(y + 1), scale*1, scale*1); //standing left
    }
    else {
      image(human_walking_left[floor(w)], scale*x, height - scale*(y + 1), scale*1, scale*1); //walking left
    }
  }
  else {
    if (w == 2) {
      image(human_right, scale*x, height - scale*(y + 1), scale*1, scale*1); //standing right
    }
    else {
      image(human_walking_right[floor(w)], scale*x, height - scale*(y + 1), scale*1, scale*1); //walking right
    }
  }
}

function keyReleased() {
  if (key == " " && game_state == 1 && time_warp < 0 && player.v_y == 0) {
    time_warp = player_path.length - 1; //starts animation
    game_state = 2; //sets gamestate to time travel
  }
}

function timeRender() {
  a = floor(tim/10);
  b = floor(tim - 10*a);
  c = floor((tim - 10*a - b)*10);
  d = abs(round((tim - 10*a - b - 0.1*c)*100)) % 10;
  return [a, b, c, d];
}
