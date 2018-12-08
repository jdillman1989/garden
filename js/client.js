var saveCTX = null;
var animCTX = null;
var interactCTX = null;

var saveCanvas = null;
var animCanvas = null;
var interactCanvas = null;

var sprites = {};

var tileSize = 0,
    mapW = 0,
    mapH = 0;

window.onload = function(){
  loadSprites();
  $.ajaxSetup({ cache: false });

  saveCanvas = document.getElementById('save');
  animCanvas = document.getElementById('animation');
  interactCanvas = document.getElementById('interaction');

  saveCTX = saveCanvas.getContext("2d");
  animCTX = animCanvas.getContext("2d");
  interactCTX = interactCanvas.getContext("2d");

  loadGame();

  interactCanvas.addEventListener('mousemove', function(e) {
    var mousePos = getCursorTile(e);
    highlightTile(mousePos);
  }, false);
};

function newGame(){
  $.ajax({
    type: "GET",
    url: 'api/init.php',
    success: function(){
      loadGame();
    },
    failure: function(){
      $('.message').text("server error: init");
    }
  });
}

function loadGame(){
  $.getJSON('saves/save.json', function(data){
    if (data.globals.init){

      tileSize = data.globals.tileSize,
      mapW = data.globals.mapW,
      mapH = data.globals.mapH;
      var map = data.map;

      drawGame(map);
    }
    else{
      newGame();
    }
  });
}

function drawGame(map){
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      var currentPos = ((y*mapW)+x);
      saveCTX.fillStyle = map[currentPos].render.base;
      saveCTX.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);

      var thisSprite = map[currentPos].render.sprite;
      if(thisSprite){
        console.log(sprites[thisSprite]);
        saveCTX.drawImage(sprites[thisSprite], x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
}

function loadSprites(){
  $.ajax({
    type: "GET",
    url: 'api/load_sprites.php',
    complete: function(response) {
      var data = JSON.parse(response.responseText);
      for (var i = 0; i < data.length; i++) {
        var thisSprite = new Image();
        thisSprite.src = data[i];
        var spriteName = data[i].replace("sprites/", "");
        sprites[spriteName] = thisSprite;        
      }
    }
  });
}

function getCursorTile(e) {

  var rect = saveCanvas.getBoundingClientRect();
  var x = e.clientX - rect.left,
      y = e.clientY - rect.top;

  var tile = ((Math.ceil(y / (tileSize * 2)) - 1) * mapW) + (Math.ceil(x / (tileSize * 2)) - 1);
  return tile;
}

function highlightTile(tile) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  var coords = getTileCoordinates(tile);
  interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
  interactCTX.fillRect(coords.x, coords.y, tileSize, tileSize);
}

function getTileCoordinates(tile){

  var yIndex = Math.floor(tile / mapW);
  var xIndex = tile - (yIndex * mapW);

  var y = yIndex * tileSize;
  var x = xIndex * tileSize;
  return {x:x, y:y};
}

// 0  1  2  3  4  5  6  7
// 8  9  10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31
