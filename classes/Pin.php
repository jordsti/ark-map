<?php

class Pin {
	public $id;
	public $x;
	public $y;
	public $note;
	public $pinnedBy;
	
	public function __construct()
	{
		$this->id = 0;
		$this->x = 0;
		$this->y = 0;
		$this->note = "";
		$this->pinnedBy = "";
	}
	
}
