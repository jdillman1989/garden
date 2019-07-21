function animate(obj, animated, frames, duration){

  var currentFrame = 0;
  obj[animated].frame = frames[currentFrame];
  updateAnim();

  var thisAnim = setInterval(function(){
    currentFrame++;
    if(currentFrame >= frames.length){
      clearInterval(thisAnim);
      obj[animated].frame = 0;
      updateAnim();
    }
    else{
      obj[animated].frame = frames[currentFrame];
      updateAnim();
    }
  }, duration / frames.length);
}

function animateMove(animal, dest){
  var speed = 0.5;
  if (animals[animal].x != dest.x || animals[animal].y != dest.y){

    if (animals[animal].x < dest.x) {
      animals[animal].x = animals[animal].x + speed;
    }
    else if (animals[animal].x > dest.x){
      animals[animal].x = animals[animal].x - speed;
    }

    if (animals[animal].y < dest.y) {
      animals[animal].y = animals[animal].y + speed;
    }
    else if (animals[animal].y > dest.y){
      animals[animal].y = animals[animal].y - speed;
    }
    updateAnim();
    window.requestAnimationFrame(function(){
      animateMove(animal, dest);
    });
  }
  else{
    animals[animal].tile = getCoordinatesTile(dest.x, dest.y);
  }
}

function updateAnim(){
  animCTX.clearRect(0, 0, animCanvas.width, animCanvas.height);
  for(var i = 0; i < animals.length; ++i){
    // drawSprite(animCTX, animals[i].x, animals[i].y, animals[i].sprite[animals[i].frame], tileSize);
  }
  for(var i = 0; i < plants.length; ++i){
    // drawSprite(animCTX, plants[i].x, plants[i].y, plants[i].sprite[plants[i].frame], tileSize);
  }
}

function randomAdjacentTile(tileSet, mapData, type){
  var result = {};
  var rand = Math.floor(Math.random() * tileSet.length);
  var dest = tileSet[rand];
  var occupied = occupiedTiles();

  if(mapData[dest].state.type == type && !occupied.includes(dest)){
    result.coords = getTileCoordinates(dest);
    result.tile = dest;
    return result;
  }
  else{
    tileSet.splice(rand, 1);
    if (tileSet.length) {
      randomAdjacentTile(tileSet, mapData, type);
    }
    else{
      return false;
    }
  }
}

function occupiedTiles(){
  var result = [];
  for(var i = 0; i < animals.length; ++i){
    result.push(animals[i].tile);
  }
  return result;
}