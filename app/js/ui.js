function getCursorTile(e, ui) {

  if(ui){
    var size = slotSize,
        width = uiW,
        rect = uiCanvas.getBoundingClientRect();
  }
  else{
    var size = tileSize,
        width = mapW,
        rect = saveCanvas.getBoundingClientRect();
  }

  var x = e.clientX - rect.left,
      y = e.clientY - rect.top;

  var tile = ((Math.ceil(y / (size * 2)) - 1) * width) + (Math.ceil(x / (size * 2)) - 1);
  return tile;
}

function selectTiles(startyIndex, startxIndex, endyIndex, endxIndex) {

  var selectedTiles = [];

  for(var y = startyIndex; y <= endyIndex; ++y){
    for(var x = startxIndex; x <= endxIndex; ++x){
      var currentPos = ((y*mapW)+x);
      selectedTiles.push(currentPos);
    }
  }

  currentSelection = selectedTiles;

  highlightTiles(selectedTiles);
}

function highlightTile(tile) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  var coords = getTileCoordinates(tile);
  interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
  interactCTX.fillRect(coords.x, coords.y, tileSize, tileSize);
}

function highlightTiles(tiles) {
  interactCTX.clearRect(0, 0, interactCanvas.width, interactCanvas.height);

  for (var i = 0; i < tiles.length; i++) {
    var coords = getTileCoordinates(tiles[i]);
    interactCTX.fillStyle = "rgba(180, 255, 180, 0.6)";
    interactCTX.fillRect(coords.x, coords.y, tileSize, tileSize);
  }
}

function changeSlot(currentSlot){
  // uiCTX.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

  var i = 0;
  for(var y = 0; y < uiH; ++y){
    for(var x = 0; x < uiW; ++x){
      var slotSprite = slot[0];
      if(i == currentSlot){
        slotSprite = slot_sel[0];
      }
      drawSprite(uiCTX, x*slotSize, y*slotSize, slotSprite, slotSize);
      i++;
    }
  }
}