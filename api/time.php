<?php

////////////////
// Crop Table //
////////////////

$stages = 4;

// hours per growth stage
$crops = [
  'corn' => 12,
  'potatos' => 8
];

////////////////
// Time Setup //
////////////////

$one_day = 86400;
$one_hour = 3600;

$current = file_get_contents('../saves/save.json');
$currentjson = json_decode($current, true);

$last = $currentjson['globals']['cache'];
$now = strtotime('now');
$currentjson['globals']['cache'] = $now;

if ($last) {

  $passed = $now - $last;

  // Dry
  $increments = round(($passed / $one_hour), 3);

  echo("last: ".$last.", \n");
  echo("now: ".$last.", \n");
  echo("passed: ".$passed.", \n");
  echo("increments: ".$increments.", \n");
  echo("\n");

  for ($tile = 0; $tile < count($currentjson['map']); $tile++) {

    $watered = $currentjson['map'][$tile]['state']['watered'];

    if ($watered) {
      $currentjson['map'][$tile]['state']['watered'] = floatval($watered) - $increments;

      echo("watered: ".floatval($watered).", \n");
      echo("dry: ".(floatval($watered) - $increments).", \n");

      if ((floatval($watered) - $increments) <= 0 ) {
        $currentjson['map'][$tile]['state']['watered'] = 0;
        $currentjson['map'][$tile]['render']['base'] = '#A57D28';
      }
    }
  }
}

$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);