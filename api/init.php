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

for ($i=0; $i < ($map_w * $map_h) + 1; $i++) {

  $color = array_rand($colors, 1);

  $rng = mt_rand(0, 1);
  $sprite = '';
  if ($rng) {
    $rng = mt_rand(0, 1);
    $sprite = 'grass'. ($rng + 1) .'.png';
  }
  else{
    $sprite = false;
  }

  $game_map[] = [
    "id" => $i, 
    "state" => [
      "type" => "ground",
      "watered" => 0,
      "ferts" => 0,
      "pass" => true,
    ],
    "render" => [
      "base" => $colors[$color[0]],
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