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
  if ($passed > $one_hour) {
    $increments = floor($passed / $one_hour);

    foreach ($currentjson['map'] as $tile) {

      $watered = $currentjson['map'][$tile]['state']['watered'];

      if ($watered) {
        $currentjson['map'][$tile]['state']['watered'] = intval($watered) - $increments;

        if ((intval($watered) - $increments) <= 0 ) {
          $currentjson['map'][$tile]['state']['watered'] = 0;
          $currentjson['map'][$tile]['render']['base'] = '#A57D28';
        }
      }
    }
  }
}

$update = json_encode($currentjson, JSON_PRETTY_PRINT);
file_put_contents('../saves/save.json', $update);