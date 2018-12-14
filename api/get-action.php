<?php

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$tileset = explode(',', $_GET["tiles"]);
$item = $_GET["item"];

$currentjson['globals']['processing'] = true;
$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);

$inv_index = array_keys($currentjson['character']['inv']);

if ($item < count($inv_index)) {
  $item_name = $inv_index[$item];
  $item_amt = $currentjson['character']['inv'][$item_name];

  switch ($item_name) {
    case "hoe":
      till($tileset, $currentjson);
      break;

    case "can":
      water($tileset, $currentjson);
      break;
    
    default:
      plant($tileset, $currentjson, $item_name, $item_amt);
      break;
  }
}
else{
  $currentjson['globals']['processing'] = false;
  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
}

function till($tileset, $currentjson){
  $i = 0;
  foreach ($tileset as $tile) {
    $tile = intval($tile);

    if ($currentjson['map'][$tile]['state']['type'] != "ground") {
      continue;
    }

    $currentjson['map'][$tile]['render']['sprite'] = 'till.png';
    $currentjson['map'][$tile]['state']['type'] = 'tilled';

    while(($i + 1) < count($tileset)) {
      if ($currentjson['map'][$tileset[$i + 1]]['state']['type'] != "ground") {
        $i++;
      }
      else{
        $currentjson['map'][$tileset[$i + 1]]['render']['sprite'] = 'dig.png';
        break;
      }
    }

    $update = json_encode($currentjson, JSON_PRETTY_PRINT);
    file_put_contents('../saves/save.json', $update);
    sleep(2);
    $i++;
  }

  $currentjson['globals']['processing'] = false;
  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
}

function water($tileset, $currentjson){

}

function plant($tileset, $currentjson, $item_name, $item_amt){
  $i = 0;
  foreach ($tileset as $tile) {
    $tile = intval($tile);

    if ($currentjson['map'][$tile]['state']['type'] != "tilled") {
      continue;
    }

    if ($item_amt < 1) {
      unset($currentjson['character']['inv'][$item_name]);
      $update = json_encode($currentjson, JSON_PRETTY_PRINT);
      file_put_contents('../saves/save.json', $update);
      break;
    }

    $item_amt--;

    $currentjson['map'][$tile]['render']['sprite'] = $item_name.'-seed.png';
    $currentjson['map'][$tile]['state']['type'] = $item_name.'.0';
    $currentjson['character']['inv'][$item_name] = $item_amt;

    $update = json_encode($currentjson, JSON_PRETTY_PRINT);
    file_put_contents('../saves/save.json', $update);
    sleep(1);
    $i++;
  }

  $currentjson['globals']['processing'] = false;
  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
}
