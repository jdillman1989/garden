var ctx = null;

window.onload = function(){
  loadSprites();
  $.ajaxSetup({ cache: false });
  ctx = document.getElementById('game').getContext("2d");
  if(ctx==null){
    $('.message').text("page error");
  }
  else{
    requestAnimationFrame(loadGame);
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
  $.getJSON('saves/save.json', function(data){
    if (data.globals.init){
      console.log("save:");
      console.log(data);

      var tileSize = data.globals.tileSize,
          mapW = data.globals.mapW,
          mapH = data.globals.mapH;

      for(var y = 0; y < mapH; ++y){
        for(var x = 0; x < mapW; ++x){
          var currentPos = ((y*mapW)+x);
          ctx.fillStyle = data.render.base;
          ctx.fillRect( x*tileSize, y*tileSize, tileSize, tileSize);

          if(data.render.sprite){
            sprite = new Image();
            sprite.src = "sprites/" + data.render.sprite;
            sprite.onload = function() {
              context.drawImage(sprite, x*tileSize, y*tileSize);
            };
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
    success: function(response){
      var data = JSON.parse(response.responseText);
      console.log("sprites:");
      console.log(response);
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var thisSprite = new Image();
        thisSprite.src = data[i];
      }
    },
    failure: function(){
      $('.message').text("server error: loadSprites");
    }
  });
}

