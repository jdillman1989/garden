<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$game_map = [];

$tile_size = $currentjson['globals']['tileSize'];

$map_w = $currentjson['globals']['mapW'];
$map_h = $currentjson['globals']['mapH'];

// $colors = [
//   "#4BA42F",
//   "#4BA42F",
//   "#4BA42F",
//   "#4BA42F",
//   "#4BA42F",
//   "#4BA42F",
//   "#7CD466",
// ];

function is_map_edge($tile, $map_w, $map_h){
        
  if (
    // top
    $tile < $map_w || 
    // left
    ($tile % $map_w) == 0 || 
    // right
    (($tile + 1) % $map_w) == 0 || 
    // bottom
    $tile > (($map_w * $map_h) - $map_w)
    ) {
    return true;
  }
  else{
    return false;
  }
}

for ($i=0; $i < ($map_w * $map_h) + 1; $i++) {

  // $color = array_rand($colors, 1);
  $sprite = '';
  $pass = false;
  $type = 'building';

  if (is_map_edge($i, $map_w, $map_h)) {
    $sprite = 'post';
  }
  else{
    $type = 'ground';
    $pass = true;
    $rng = mt_rand(0, 1);
    if ($rng) {
      $rng = mt_rand(0, 1);
      $sprite = 'grass'. ($rng + 1);
    }
    else{
      $sprite = false;
    }
  }

  switch ($i) {
    case 2:
      $sprite = 'house1';
      $type = 'building';
      $pass = false;
      break;
    case 3:
      $sprite = 'house2';
      $type = 'building';
      $pass = false;
      break;
    case $map_w + 2:
      $sprite = 'house3';
      $type = 'building';
      $pass = false;
      break;
    case $map_w + 3:
      $sprite = 'house4';
      $type = 'building';
      $pass = false;
      break;
  }

  $game_map[] = [
    "id" => $i, 
    "state" => [
      "type" => $type,
      "watered" => 0,
      "ferts" => 0,
    ],
    "render" => [
      // "base" => $colors[$color],
      "base" => '#4BA42F',
      "sprite" => $sprite,
      "animate" => false,
    ],
  ];
}

// STATE TYPES:
// ground
// tilled
// corn, beets, grapes, etc
// water
// barn_1, barn_2, barn_3, barn_4, post, etc

$currentjson['map'] = $game_map;
$currentjson['pets'] = ['creet' => 5];
$currentjson['character']['inv'] = ["hoe" => 1, "sickle" => 1, "watering" => 1, "corn" => 10];
$currentjson['globals']['init'] = true;

$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);