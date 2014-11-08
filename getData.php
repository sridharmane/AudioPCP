<?php
include ("commonphp.php");
header('Content-Type: application/json');

$mode = null;
$step = null;
/**
 * Open a connection
 */
$conn = connect();

/**
 * create the SQL statement
 */
$modeCount = array();

$sql[0] = "SELECT count(*) as count from master where mode=0";
$sql[1] = "SELECT count(*) as count from master where mode=1";
$sql[2] = "SELECT count(*) as count from master where mode=2";
for ($i = 0; $i < 3; $i++) {
	$result[$i] = mysql_query($sql[$i], $conn) or die(mysql_error());
	$data = mysql_fetch_assoc($result[$i]);
	array_push($modeCount, $data['count']);
}
$mode = decideMode($modeCount);
$response = array();
array_push($response, $mode);
array_push($response, $modeCount);
array_push($response, $step);
echo json_encode($response);
/**
 * Close Connection
 */
close($conn);

function decideMode($resp) {
	global $step;
	// if (!$resp[0] && !$resp[1] && !$resp[2]) {
	// $step = 1;
	// return 0;
	// }
	// if ($resp[0] && !$resp[1] && !$resp[2]) {
	// $step = 2;
	// return 1;
	// }
	// if ($resp[0] && $resp[1] && !$resp[2]) {
	// $step = 3;
	// return 2;
	// }
	if ($resp[0] == $resp[1] && $resp[0] == $resp[2]) {
		$step = 1;
		return 0;
	}
	if ($resp[0] > $resp[1] && $resp[0] > $resp[2]) {
		if ($resp[1] > $resp[2]) {
			$step = 2;
			return 2;
		} else if ($resp[2] > $resp[1]) {
			$step = 3;
			return 1;
		} else if ($resp[2] == $resp[1]) {
			$step = 4;
			return 1;
		}
	}
	if ($resp[1] > $resp[0] && $resp[1] > $resp[2]) {
		if ($resp[0] > $resp[2]) {
			$step = 5;
			return 2;
		} else if ($resp[2] > $resp[0]) {
			$step = 6;
			return 0;
		} else if ($resp[0] == $resp[2]) {
			$step = 7;
			return 0;
		}
	}
	if ($resp[2] > $resp[1] && $resp[2] > $resp[0]) {
		if ($resp[0] > $resp[1]) {
			$step = 8;
			return 1;
		} else if ($resp[1] > $resp[0]) {
			$step = 9;
			return 0;
		} else if ($resp[1] == $resp[0]) {
			$step = 10;
			return 1;
		}
	}
	if ($resp[0] == $resp[1] && $resp[0] > $resp[2]) {
		$step = 11;
		return 2;
	}
	if ($resp[1] == $resp[2] && $resp[1] > $resp[0]) {
		$step = 12;
		return 0;
	}
	if ($resp[2] == $resp[0] && $resp[2] > $resp[1]) {
		$step = 13;
		return 1;
	}
	if ($resp[0] == $resp[1] && $resp[0] < $resp[2]) {
		$step = 14;
		return 0;
	}
	if ($resp[1] == $resp[2] && $resp[1] < $resp[0]) {
		$step = 15;
		return 1;
	}
	if ($resp[2] == $resp[0] && $resp[2] < $resp[1]) {
		$step = 16;
		return 2;
	}
}
?>

