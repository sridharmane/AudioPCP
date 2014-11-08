<?php
include ("commonphp.php");
header ( 'Content-Type: text/html' );

if (isset ( $_POST ['data'] )) {
	/**
	 * Open a connection
	 */
	$conn = connect ();
	
	/**
	 * create the SQL statement
	 */
	$answers = json_decode($_POST ["data"]);
	
	for($i=0; $i<count($answers); $i++) {
	
		$timestamp = $answers[$i]->timeStamp;
		$mode = $answers[$i]->mode;
		$trialNo = $answers[$i]->trialNo;
		$reactionTime = $answers[$i]->reactionTime;
		
		$sql="INSERT INTO audiopcp.master (timestamp,mode,trialNo,reactionTime) VALUES('$timestamp',$mode,'$trialNo','$reactionTime')";
		$message = mysql_query ( $sql, $conn ) or die ( mysql_error () );
	}
	echo "<h1>Thank You. Data Saved.</h1>";
	echo "<h3>You can close the browser/tab now.</h3>";
	/**
	 * Close Connection
	 */
	close ( $conn );
	}
?>