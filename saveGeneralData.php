<?php

$json = $_POST['jsonString'];
$fp = fopen('data/general.json', 'w+');
fwrite($fp, $json);
fclose($fp);

?>