<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$tileset = explode(',', $_GET["data"]);

$i = 0;
foreach ($tileset as $tile) {
  $tile = intval($tile);
  $currentjson['map'][$tile]['render']['sprite'] = 'till.png';
  $currentjson['map'][$tile]['state']['type'] = 'tilled';

  if (($i + 1) < count($tileset)) {
    $currentjson['map'][$tileset[$i + 1]]['render']['sprite'] = 'dig.png';
  }

  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
  sleep(2);
  $i++;
}
