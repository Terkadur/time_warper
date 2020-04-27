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
game_state = 0; //0 is starting screen, 1 is gameplay, 2 is time travel, 3 is collapse
tim = 0;
button_pressed = 0;

player_path = [];

function preload() {
  block = loadImage("v12/images/lab_block.png");
  portal_on = loadImage("v12/images/portal_on.png");
  portal_off = loadImage("v12/images/portal_off.png");
  button_up = loadImage("v12/images/button_up.png");
  button_down = loadImage("v12/images/button_down.png");
  human_right = loadImage("v12/images/human_right.png");
  human_left = loadImage("v12/images/human_left.png");
  human_walking_right = [];
  human_walking_right[0] = loadImage("v12/images/human_walking_right_0.png");
  human_walking_right[1] = loadImage("v12/images/human_walking_right_1.png");
  human_walking_left = [];
  human_walking_left[0] = loadImage("v12/images/human_walking_left_0.png");
  human_walking_left[1] = loadImage("v12/images/human_walking_left_1.png");
  player_arrow = loadImage("v12/images/player_arrow.png");
  time_aura = loadImage("v12/images/time_aura.png");
  clock = loadImage("v12/images/clock.png");
  sheet = loadImage("v12/images/numbers.png");
  numbers = [];
  portal_glint = [];
}

function setup() {
  createCanvas(1024, 512);
  frameRate(50);
  scale = 64;
  game_width = width/scale; //16
  game_height = height/scale; //8
  
  game_environment = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 3, 0, 0, 1],
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
    [1, 2, 1, 0, 0, 0, 0, 1],
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
  
  for (var i = 0; i < 10; i++) {
    portal_glint[i] = loadImage("v12/images/portal_glint/portal_0" + i + ".png");
  }
  for (i = 10; i < 17; i++) {
    portal_glint[i] = loadImage("v12/images/portal_glint/portal_" + i + ".png");
  }
  
  game_state = 1;
}

function draw() {
  if (game_state == 1 || game_state == 2) {
    baseVisuals();
    if (time_warp >= 0) {
      showPlayer(player_path[time_warp][0], player_path[time_warp][1], player_path[time_warp][2], player_path[time_warp][3]); //shows past player
    }
  }
  
  if (game_state == 1) {
    gameState1();
  }
  
  if (game_state == 2) {
    gameState2();
  }
  
  if (game_state == 3) {
    gameState3();
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

function gameState1() {
  tim += 0.02; //run time
  tim = round(tim*100)/100; //make time not dumb
  
  //gravity
  player.v_y -= g;
  
  //vertical collision
  //up
  if (player.v_y > 0) {
    if (game_environment[floor(player.x)][ceil(player.y + player.v_y)] != 1 && game_environment[floor(player.x + player.w)][ceil(player.y + player.v_y)] != 1) {
      player.y += player.v_y; //upwards movement
    }
    else {
      player.v_y = 0; //collision
      player.y = ceil(player.y); //sets position
    }
  }
  //down
  if (player.v_y < 0) {
    if (game_environment[floor(player.x)][floor(player.y + player.v_y)] != 1 && game_environment[floor(player.x + player.w)][floor(player.y + player.v_y)] != 1) {
      player.y += player.v_y; //downwards movement
    }
    else {
      player.v_y = 0; //collision
      player.y = floor(player.y); //sets positon
    }
  }
  
  //horizontal movement
  if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && game_environment[floor(player.x + player.v_x + player.w)][floor(player.y)] != 1 && game_environment[floor(player.x + player.v_x + player.w)][ceil(player.y)] != 1) {
    player.x += player.v_x; //rightwards movement
    player.dir = 1; //direction
    player.walk += 0.1; //animates walking (per 10 frames)
    player.walk = player.walk % 2;
  }
  else if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && game_environment[floor(player.x - player.v_x)][floor(player.y)] != 1 && game_environment[floor(player.x - player.v_x)][ceil(player.y)] != 1) {
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
  
  if (time_warp >= 0 && abs(player.x - player_path[time_warp][0]) < player.w && abs(player.y - player_path[time_warp][1]) < player.h) {
    game_state = 3;
    radius = 8;
    strength = 2;
    loadPixels();
    arr = Array.from(pixels);
    print(arr);
    updatePixels();
    vel = 1.02;
    centerX = scale*(player.x + player.w/2);
    centerY = height - scale*((player.y - player.h/2) + 1);
  }
}

function gameState2() {
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

function baseVisuals() {
  //environment
  background(0); //black background (design)
  for (var i = 0; i < game_environment.length; i++) {
    for (var j = 0; j < game_environment[i].length; j++) {
      if (game_environment[i][j] == 1) {
        image(block, scale*i, height - scale*(j+1), scale*1, scale*1); //shows metal block
      }
      else if (game_environment[i][j] == 2) {
        if (button_pressed == 1) {
          image(portal_glint[floor(tim * 10) % 17], scale*i, height - scale*(j+1), scale*1, scale*1); //shows portal glint
          image(portal_on, scale*i, height - scale*(j), scale*1, scale*1);
        }
        else {
          image(portal_off, scale*i, height - scale*(j), scale*1, scale*1);
        }
      }
      else if (game_environment[i][j] == 3) {
        if ((floor(player.x + player.w/2) == i && floor(player.y) == j) || (time_warp >= 0 && floor(player_path[time_warp][0] + player.w/2) == i && floor(player_path[time_warp][1]) == j)) {
          image(button_down, scale*i, height - scale*(j+1), scale*1, scale*1); //shows button
          button_pressed = 1;
        }
        else {
          image(button_up, scale*i, height - scale*(j+1), scale*1, scale*1); //shows button
          button_pressed = 0;
        }
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
}

function gameState3() {
  loadPixels();
  for (var x = 0; x < width; x += 4) { //skip the extra pixels
    for (var y = 0; y < height; y += 4) {
      if ((x - centerX)*(x - centerX) + (y - centerY)*(y - centerY) <= radius*radius) { //if in the radius
        angle = atan2(y - centerY, x - centerX);
        rad = dist(x, y, centerX, centerY);
        new_x = round((radius - (radius - rad)/strength) * cos(angle) + centerX); //calculate coordinates of other pixel
        new_y = round((radius - (radius - rad)/strength) * sin(angle) + centerY);
        if (new_x < 0 || new_x > width || new_y < 0 || new_y > height - 1) { //if its outside
          for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) { //make the 4x4 pixels
              pixels[4*((y+j)*width + (x+i)) + 0] = 0;
              pixels[4*((y+j)*width + (x+i)) + 1] = 0;
              pixels[4*((y+j)*width + (x+i)) + 2] = 0;
              pixels[4*((y+j)*width + (x+i)) + 3] = 255;
            }
          }
        }
        else {
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) { //make the 4x4 pixels
              pixels[4*((y+j)*width + (x+i)) + 0] = arr[4*(new_y*width + new_x) + 0]; //take the color
              pixels[4*((y+j)*width + (x+i)) + 1] = arr[4*(new_y*width + new_x) + 1];
              pixels[4*((y+j)*width + (x+i)) + 2] = arr[4*(new_y*width + new_x) + 2];
              pixels[4*((y+j)*width + (x+i)) + 3] = arr[4*(new_y*width + new_x) + 3];
            }
          }
        }
      }  
    }
  }
  updatePixels();
  radius *= vel; //increase radius exponentially
  if (radius >= 10000) {
    game_state = 0;
    print("Uncaught LogicError: Causality is undefined");
  }
}
