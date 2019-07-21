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

    case "watering":
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

    $currentjson['map'][$tile]['render']['sprite'] = 'till';
    $currentjson['map'][$tile]['state']['type'] = 'tilled';

    while(($i + 1) < count($tileset)) {
      if ($currentjson['map'][$tileset[$i + 1]]['state']['type'] != "ground") {
        $i++;
      }
      else{
        $currentjson['map'][$tileset[$i + 1]]['render']['sprite'] = 'dig';
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
  $i = 0;
  foreach ($tileset as $tile) {
    $tile = intval($tile);

    if ($currentjson['map'][$tile]['state']['type'] == "ground" || $currentjson['map'][$tile]['state']['type'] == "building" || $currentjson['map'][$tile]['state']['type'] == "water" || $currentjson['map'][$tile]['state']['type'] == "tilled") {
      continue;
    }

    $currentjson['map'][$tile]['state']['watered'] = 36;
    $currentjson['map'][$tile]['render']['base'] = '#4C310B';

    $update = json_encode($currentjson, JSON_PRETTY_PRINT);
    file_put_contents('../saves/save.json', $update);
    sleep(1);
    $i++;
  }

  $currentjson['globals']['processing'] = false;
  $update = json_encode($currentjson, JSON_PRETTY_PRINT);
  file_put_contents('../saves/save.json', $update);
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

    if ($currentjson['map'][$tile]['state']['watered']) {
      $currentjson['map'][$tile]['render']['base'] = '#4C310B';
    }
    else{
      $currentjson['map'][$tile]['render']['base'] = '#A57D28';
    }
    $currentjson['map'][$tile]['render']['sprite'] = $item_name.'_0';
    $currentjson['map'][$tile]['state']['type'] = $item_name.'_0';
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
