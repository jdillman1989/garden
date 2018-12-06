<?php
function adjacent_tiles($tile, $map_w){

  $obj = array();

  $adj = [
    "nw" => ($tile - ($map_w + 1)),
    "ne" => ($tile - ($map_w - 1)),
    "sw" => ($tile + ($map_w - 1)),
    "se" => ($tile + ($map_w + 1)),
    "n" => ($tile - $map_w),
    "e" => ($tile - 1),
    "w" => ($tile + 1),
    "s" => ($tile + $map_w)
  ];

  foreach ($adj as $key => $value) {
    if ($value > -1 && $value <= ($map_w * $map_h)) {
      if (strlen($key) > 1) {
        $obj["far"][$key] = $value;
      }
      else{
        $obj["close"][$key] = $value;
      }
      $obj["all"][$key] = $value;
    }
  }

  return $obj;
}