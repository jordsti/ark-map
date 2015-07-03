<?php

require_once("classes/PinFile.php");

$pf = new PinFile();
$action = 'none';
if(isset($_GET['action']))
{
	$action = $_GET['action'];
}

if(strcmp($action, 'get_pins') == 0)
{
	$pins = $pf->pins;
	echo json_encode($pins);
}
else if(strcmp($action, 'add_pin') == 0)
{
	if(isset($_POST['pin-x']) &&
	isset($_POST['pin-y']) &&
	isset($_POST['pin-note']))
	{
		$pin = new Pin();
		$pin->x = $_POST['pin-x'];
		$pin->y = $_POST['pin-y'];
		$pin->note = $_POST['pin-note'];
		
		$pf->addPin($pin);
		
		echo json_encode($pin);
	}
}
