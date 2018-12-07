var saveCTX = null;
var animCTX = null;
var interactCTX = null;

var saveCanvas = null;
var animCanvas = null;
var interactCanvas = null;

var sprites = {};

var tileSize = 0,
    mapW = 0,
    mapH = 0,
    map = [];

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
      mapH = data.globals.mapH,
      map = data.map;

      drawGame(tileSize, mapW, mapH, map);
    }
    else{
      newGame();
    }
  });
}

function drawGame(){
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

  var tile = ((Math.ceil(y / (16 * 2)) - 1) * 20) + (Math.ceil(x / (16 * 2)) - 1);
  return tile;
}

function highlightTile(tile) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  var coords = getTileCoordinates(tile);
  interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
  interactCTX.fillRect(coords.x, coords.y, 16, 16);
}

function getTileCoordinates(tile){

  var yIndex = Math.floor(tile / 20);
  var xIndex = tile - (yIndex * 20);

  var y = yIndex * 16;
  var x = xIndex * 16;
  return {x:x, y:y};
}
