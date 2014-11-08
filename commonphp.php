<?php
function connect() {
	$con = mysql_connect ( "localhost", "audiopcp", "audiopcp" );
	mysql_select_db ( "audiopcp", $con ) or die(mysql_error());
	return $con;
}
function close($con) {
	mysql_close ( $con );
}
function querythis($sql) {
	$con = connect ();
	$result = mysql_query ( $sql, $con ) or die ( mysql_error () );
	close ( $con );
	return $result;
}
/**
 * 
 * @param String $type
 * @param String $data
 */
function logThis($type,$data) {
	$date = new DateTime();
	if($type=="debug"){
	$ip = $date->getTimeStamp()+","+data;
	file_put_contents("/home/sridharmane/Desktop/logs/debug.txt", $ip, FILE_APPEND | LOCK_EX);
	}
	else if($type=="error"){
		$ip = $date->getTimeStamp()+","+data;
		file_put_contents("/home/sridharmane/Desktop/logs/error.txt", $ip, FILE_APPEND | LOCK_EX);
	}
}
?> 