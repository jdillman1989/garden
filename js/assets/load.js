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

      tileSize = data.globals.tileSize;
      mapW = data.globals.mapW;
      mapH = data.globals.mapH;
      processing = data.globals.processing;

      slotSize = data.globals.slotSize;
      uiW = data.globals.uiW;
      uiH = data.globals.uiH;

      var map = data.map;
      var name = data.character.name;
      var money = data.character.money;
      var inv = data.character.inv;
      var pets = data.pets;

      if(data.globals.processing){
        watch();
      }

      drawGame(map);
      drawUI(name, money, inv);
      drawAnim(pets);
      updateAnim();

    }
    else{
      newGame();
    }
  });
}

function drawGame(map){
  saveCTX.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
  animCTX.clearRect(0, 0, animCanvas.width, animCanvas.height);
  var k = 0;
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      var currentPos = ((y*mapW)+x);
      saveCTX.fillStyle = map[currentPos].render.base;
      saveCTX.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);

      var thisSprite = map[currentPos].render.sprite;
      if(thisSprite){
        if (map[currentPos].render.animate) {

          var that = {};

          that.x = x*tileSize;
          that.y = y*tileSize;
          that.tile = getCoordinatesTile(that.x, that.y);
          that.id = k;
          that.frame = 0;
          that.sprite = sprites[thisSprite];

          plants.push(that);
          k++;
        }
        else{
          saveCTX.drawImage(
            sprites[thisSprite],
            0,               // sprite x
            0,               // sprite y
            tileSize,        // sprite width
            tileSize,        // sprite height
            x*tileSize,      // canvas x
            y*tileSize,      // canvas y
            tileSize,        // canvas draw width
            tileSize         // canvas draw height
          );
        }
      }
    }
  }
}

function drawUI(name, money, inv){
  uiCTX.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

  var items = Object.keys(inv);
  var quantities = Object.values(inv);

  var i = 0;
  for(var y = 0; y < uiH; ++y){
    for(var x = 0; x < uiW; ++x){
      var slot = sprites["slot.png"];
      if(i == currentSlot){
        slot = sprites["slot-sel.png"];
      }
      uiCTX.drawImage(slot, x*slotSize, y*slotSize, slotSize, slotSize);
      if(i < items.length){
        uiCTX.drawImage(sprites[items[i] + "-inv.png"], x*slotSize, y*slotSize, slotSize, slotSize);
      }
      i++;
    }
  }

  uiCTX.font = "12px Courier";
  uiCTX.fillStyle = "white";
  uiCTX.fillText(name + "  $" + money, 0, (slotSize*uiH) + 15);
}

function drawAnim(pets){

  var startTiles = [
    getTileCoordinates(52),
    getTileCoordinates(53),
    getTileCoordinates(51),
    getTileCoordinates(54),
    getTileCoordinates(26),
    getTileCoordinates(29)
  ];

  var types = Object.keys(pets);
  var quantities = Object.values(pets);
  var k = 0;

  for (var i = 0; i < types.length; i++) {
    for (var j = 0; j < quantities[i]; j++) {

      var that = {};

      that.x = startTiles[j]['x'];
      that.y = startTiles[j]['y'];
      that.tile = getCoordinatesTile(that.x, that.y);
      that.id = k;
      that.frame = 0;
      that.sprite = sprites[types[i] + ".png"];

      animals.push(that);
      k++;
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

function watch(){
  var watch = setInterval(function(){
    $.getJSON('saves/save.json', function(data){
      drawGame(data.map);
      drawUI(data.character.name, data.character.money, data.character.inv);
      if(!data.globals.processing){
        clearInterval(watch);
      }
    });
  }, 1500);
}

function look(){
  if (!processing) {
    $.getJSON('saves/save.json', function(data){
      drawGame(data.map);
      drawUI(data.character.name, data.character.money, data.character.inv);
    });
  }
}

function updateTime(){
  $.ajax({
    type: "GET",
    url: 'api/time.php'
  });
}