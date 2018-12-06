var ctx = null;
var sprites = {};

window.onload = function(){
  loadSprites();
  $.ajaxSetup({ cache: false });
  ctx = document.getElementById('game').getContext("2d");
  if(ctx==null){
    $('.message').text("page error");
  }
  else{
    loadGame();
  }
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
  console.log(sprites);
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
        thisSprite.onload = function() {
          var src = thisSprite.src;
          var spriteName = src.replace("sprites/", "");
          console.log(spriteName);
          sprites[spriteName] = thisSprite;
        };
      }
    }
  });
}

