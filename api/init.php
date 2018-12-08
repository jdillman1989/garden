<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$game_map = [];

$tile_size = $currentjson['globals']['tileSize'];

$map_w = $currentjson['globals']['mapW'];
$map_h = $currentjson['globals']['mapH'];

$colors = [
  "#22EE44",
  "#22EE44",
  "#11FF55",
  "#44EE33",
  "#4CEA38",
];

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

  $color = array_rand($colors, 1);
  $sprite = '';
  $pass = false;
  $type = 'building';

  if (is_map_edge($i, $map_w, $map_h)) {
    $sprite = 'fence.png';
  }
  else{
    $type = 'ground';
    $pass = true;
    $rng = mt_rand(0, 1);
    if ($rng) {
      $rng = mt_rand(0, 1);
      $sprite = 'grass'. ($rng + 1) .'.png';
    }
    else{
      $sprite = false;
    }
  }

  switch ($i) {
    case 2:
      $sprite = 'house1.png';
      break;
    case 3:
      $sprite = 'house2.png';
      break;
    case $map_w + 2:
      $sprite = 'house3.png';
      break;
    case $map_w + 3:
      $sprite = 'house4.png';
      break;
  }

  $game_map[] = [
    "id" => $i, 
    "state" => [
      "type" => $i,
      "watered" => 0,
      "ferts" => 0,
      "pass" => $pass,
    ],
    "render" => [
      "base" => $colors[$color],
      "sprite" => $sprite,
    ],
  ];
}

// STATE TYPES:
// ground
// tilled
// corn, beets, grapes, etc
// water
// barn_1, barn_2, barn_3, barn_4, fence, etc

$currentjson['map'] = $game_map;
$currentjson['character']['inv'] = ["corn" => 10];
$currentjson['globals']['init'] = true;

$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);