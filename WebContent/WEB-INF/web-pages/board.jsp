<div ng-controller = "OperationsController" class = "modal show board z-2">
     <div class = "modal-body fill-both board-container">
          <div class = "fill-both z-1">
			   <div style = "margin:0;" class = "fill-both-abs">
			    	<svg width = "100%" height = "100%">
					     <mask id = "title-mask">
					  		   <rect width = "2000px" height = "200px" fill = "#fff"/>
					  	 </mask>
					  	 <rect width = "100%" height = "100%" fill = "#2c3e50" mask = "url(#title-mask)" 
					           style = "opacity:0.5;"/>
					</svg>
		   		</div>
	   		
		   		<div class = "board-inner">
		   		  	 <div ng-if = "board.buttons.db" class = "db-bg">
				   		  <div class = "modal-content z-1">	   				
							   <div class = "modal-body board-body">
								    <span class = "board-header"> Database 
									      <button ng-click = "board.buttons.db = false;" type = "button" 
									              class = "close btn-close-brd"> &times; 
	                                      </button>
								    </span>
								    <div button-group name = "db" class = "modal-body board-body"></div>
							   </div>
						  </div>
						  <div draggable ng-if = "databaseOp.alert.display" ng-init = "alert = databaseOp.alert"
							    ng-include = "'alerts.dbexp'" style = "left:50vw;" class = "z-2 board-alert">
						  </div>
			   		 </div> 
		   		  	   		  
			   		 <div ng-if = "board.buttons.tab" class = "table-bg">
			   		  	  <div ng-class = "{'z-1': list.selected.length === 0}" class = "modal-content">	   				
							   <div class = "modal-body board-body">
									<span class = "board-header"> Table 
										  <button ng-click = "board.buttons.tab = false;" type = "button"
	                                              class = "close btn-close-brd"> &times; 
	                                      </button>
									</span>
								 	<div button-group name = "tab" class = "modal-body board-body"></div>
								</div>
					      </div> 		  
			   		 </div>
		   		     <div ng-if = "board.buttons.col" class = "col-bg">
		   		  	      <div class = "modal-content"> 
	                           <div class = "modal-body board-body">
	                                <span class = "board-header"> Column 
	                                      <button ng-click = "board.buttons.col = false;" type = "button"
	                                              class = "close btn-close-brd"> &times; 
	                                      </button>
	                                </span>
	                                <div button-group name = "col" class = "modal-body board-body"></div>
	                           </div>
	                      </div>
		   		     </div> 
		   		     <div ng-if = "db.inputs" ng-include = "'dbButtonGroup.dbexp'" class = "params"></div>
		   		     <div ng-if = "tab.inputs" ng-include = "'tabButtonGroup.dbexp'" class = "params"></div>
		   		     <div ng-if = "col.inputs" ng-include = "'colButtonGroup.dbexp'" class = "params"></div>
		   		  
			   		 <div ng-if = "db.menu" class = "board-menu account z-1">
						  <button ng-click = "board.close();board.resize()" type = "button" class = "btn-resize"> 
						          <span style = "line-height:10px;" class = "fa fa-close"></span>
						  </button>
					 	  <div menu list = "board,options,title" class = "menu-slim"></div>
					 </div>	
		   	    </div> 
          </div>
     </div>
</div>