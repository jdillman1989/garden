<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$tileset = $_GET["data"];

var_dump($_GET["data"]);

foreach ($tileset as $tile) {
  $currentjson['map'][$tile]['render']['sprite'] = 'till.png';
  $currentjson['map'][$tile]['state']['type'] = 'tilled';
  $currentjson['map'][$tile + 1]['render']['sprite'] = 'dig.png';
  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
  sleep(2);
}
