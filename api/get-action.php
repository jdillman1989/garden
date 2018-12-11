<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$tileset = explode(',', $_GET["data"]);

$currentjson['globals']['processing'] = true;
$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);

$i = 0;
foreach ($tileset as $tile) {
  $tile = intval($tile);

  if ($currentjson['map'][$tile]['state']['type'] != "ground") {
    continue;
  }

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

$currentjson['globals']['processing'] = false;
$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);
