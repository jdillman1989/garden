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
  $increments = round(($passed / $one_hour), 3);

  for ($tile = 0; $tile < count($currentjson['map']); $tile++) {

    $watered = $currentjson['map'][$tile]['state']['watered'];

    if ($watered) {

      // Dry
      $currentjson['map'][$tile]['state']['watered'] = floatval($watered) - $increments;

      if ((floatval($watered) - $increments) <= 0 ) {
        $currentjson['map'][$tile]['state']['watered'] = 0;
        $currentjson['map'][$tile]['render']['base'] = '#A57D28';
      }

      // Grow
      $plant = explode('_', $currentjson['map'][$tile]['state']['type']);
      $growth = floatval($plant[1]);
      $grow = $growth + $increments;

      $currentjson['map'][$tile]['state']['type'] = $plant[0].'_'.$grow;

      $current_stage = floor($grow / $crops[$plant[0]]);
      if ($current_stage < 5) {
        $currentjson['map'][$tile]['render']['sprite'] = $plant[0].'-'.$current_stage.'.png';
      }
      if ($current_stage) {
        $currentjson['map'][$tile]['render']['animate'] = true;
      }
    }
  }
}

$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);