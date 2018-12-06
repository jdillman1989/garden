<?php

$dir = new DirectoryIterator('../sprites');
$files = array();
foreach ($dir as $fileinfo) {
  $name = $fileinfo->getFilename();
  if ($name != '.DS_Store' && $name != '.' && $name != '..') {
    $files[] = '../sprites/'.$name;
  }
}
$response = json_encode($files);
echo $response;