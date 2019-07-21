window.onload = function(){

  ///////////
  // Setup //
  ///////////

  $.ajaxSetup({ cache: false });

  // var c = document.createElement('canvas');
  // var ctx = c.getContext('2d');
  // var W, H;
  // document.body.appendChild(c);

  saveCanvas = document.getElementById('save');
  animCanvas = document.getElementById('animation');
  interactCanvas = document.getElementById('interaction');
  uiCanvas = document.getElementById('ui');

  saveCTX = saveCanvas.getContext("2d");
  animCTX = animCanvas.getContext("2d");
  interactCTX = interactCanvas.getContext("2d");
  uiCTX = uiCanvas.getContext("2d");

  updateTime();

  loadGame();

  var dragging = false;
  var startSelect = 0;

  ////////////////////////
  // Interaction Events //
  ////////////////////////

  interactCanvas.addEventListener('mousedown', function(e) {
    dragging = true;
    startSelect = getCursorTile(e, false);
  }, false);

  interactCanvas.addEventListener('mouseup', function(e) {

    dragging = false;

    watch();

    var data = currentSelection.join(",");

    $.ajax({
      type: "GET",
      url: 'api/get-action.php',
      data: {tiles:data, item:currentSlot}
    });

  }, false);

  interactCanvas.addEventListener('mousemove', function(e) {
    var mousePos = getCursorTile(e, false);
    highlightTile(mousePos);
    if(dragging){

      var startyIndex = Math.floor(startSelect / mapW),
          startxIndex = startSelect - (startyIndex * mapW),
          endyIndex = Math.floor(mousePos / mapW),
          endxIndex = mousePos - (endyIndex * mapW);

      // Drag Direction ↖
      if (startyIndex >= endyIndex && startxIndex >= endxIndex) {
        selectTiles(endyIndex, endxIndex, startyIndex, startxIndex);
      }
      // Drag Direction ↗
      else if (startyIndex >= endyIndex && startxIndex <= endxIndex) {
        selectTiles(endyIndex, startxIndex, startyIndex, endxIndex);
      }
      // Drag Direction ↙
      else if (startyIndex <= endyIndex && startxIndex >= endxIndex) {
        selectTiles(startyIndex, endxIndex, endyIndex, startxIndex);
      }
      // Drag Direction ↘
      else{
        selectTiles(startyIndex, startxIndex, endyIndex, endxIndex);
      }
    }
  }, false);

  ///////////////
  // UI Events //
  ///////////////

  uiCanvas.addEventListener('mouseup', function(e) {
    thisSlot = getCursorTile(e, true);
    changeSlot(thisSlot);
  }, false);

  /////////////////
  // Update Time //
  /////////////////

  var check = setInterval(function(){
    updateTime();
    look();
  }, 120000);

  ////////////////
  // Animations //
  ////////////////

  var setIdle = setInterval(function(){
    for(var i = 0; i < animals.length; ++i){
      var rng = Math.floor(Math.random() * 4);
      if (!rng) {
        animate(animals, animals[i].id, [1], 150);
      }
      if (rng == 1) {
        animate(animals, animals[i].id, [2], 700);
      }
    }
  }, 1500);

  var setLooped = setInterval(function(){
    for(var i = 0; i < plants.length; ++i){
      animate(plants, plants[i].id, [1], 700);
    }
  }, 2000);

  var setMove = setInterval(function(){

    $.getJSON('saves/save.json', function(data){

      for(var i = 0; i < animals.length; ++i){
        var rng = Math.floor(Math.random() * 5);
        if (!rng) {
          var adjObj = adjacentTiles(animals[i].tile);
          var adj = Object.values(adjObj.all);
          var dest = randomAdjacentTile(adj, data.map, "ground");
          if (dest) {
            animateMove(animals[i].id, dest.coords);
            animate(animals, animals[i].id, [3,4], 600);
          }
        }
      }
    });
  }, 4000);
};