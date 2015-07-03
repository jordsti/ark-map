<?php
require_once("classes/Pin.php");
class PinFile {
	
	public $path;
	public $pins;
	public $currentId;
	
	public function __construct($path='pins.data')
	{
		$this->currentId = 0;
		$this->pins = array();
		$this->path = $path;
		if(file_exists($path))
		{
			$fp = fopen($path, 'r');
			$data = stream_get_contents($fp);
			fclose($fp);
			
			$pins = unserialize($data);
			if(is_array($pins))
			{
				$this->pins = $pins;
			}
			
			foreach($this->pins as $pin)
			{
				if($pin->id > $this->currentId)
				{
					$this->currentId = $pin->id;
				}
			}
			
			$this->currentId++;
		}
	}
	
	public function addPin($pin)
	{
		$pin->id = $this->currentId;
		$this->currentId++;
		
		$this->pins[] = $pin;
		
		$this->save();
	}
	
	public function save()
	{
		$data = serialize($this->pins);
		
		$fp = fopen($this->path, 'w');
		fwrite($fp, $data);
		fclose($fp);
	}
}
