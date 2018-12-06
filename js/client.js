var ctx = null;
var canvas = null;
var sprites = {};

window.onload = function(){
  loadSprites();
  $.ajaxSetup({ cache: false });
  canvas = document.getElementById('game');
  ctx = canvas.getContext("2d");
  if(ctx==null){
    $('.message').text("page error");
  }
  else{
    loadGame();
  }

  canvas.addEventListener('mousemove', function(e) {
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

      var tileSize = data.globals.tileSize,
          mapW = data.globals.mapW,
          mapH = data.globals.mapH;

      for(var y = 0; y < mapH; ++y){
        for(var x = 0; x < mapW; ++x){
          var currentPos = ((y*mapW)+x);
          ctx.fillStyle = data.map[currentPos].render.base;
          ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);

          var thisSprite = data.map[currentPos].render.sprite;
          if(thisSprite){
            console.log(sprites[thisSprite]);
            ctx.drawImage(sprites[thisSprite], x*tileSize, y*tileSize, tileSize, tileSize);
          }
        }
      }
    }
    else{
      newGame();
    }
  });
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

  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left,
      y = e.clientY - rect.top;

  var tile = ((Math.ceil(y / 16) - 1) * 20) + (Math.ceil(x / 16) - 1);
  return tile;
}

function highlightTile(tile) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  loadGame();

  var coords = getTileCoordinates(tile);
  ctx.fillStyle = "#AFA";
  ctx.fillRect(coords.x, coords.y, 16, 16);
}

function getTileCoordinates(tile){

  var yIndex = Math.floor(tile / 20);
  var xIndex = tile - (yIndex * 20);

  var y = yIndex * 16;
  var x = xIndex * 16;
  return {x:x, y:y};
}
