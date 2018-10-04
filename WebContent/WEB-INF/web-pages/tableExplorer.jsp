 <div resizable draggable ng-class = "{'h-100': !board.display}" class = "modal show list">
      <div class = "modal-content" >
           <div class = "modal-header header-text z-3" style = "z-index:3;">
                <button ng-click = "list.close()" type = "button" class = "close btn-close"> &times; </button>
                <h4 class = "modal-title"> Table names </h4>
           </div>
           <div ng-class = "{'h-90': !board.display}" class = "modal-body list-body z-2">
                <div has-scrollbar  class = "panel-body z-2">
                     <form class = "form-horizontal list-form z-2">
						   <ul class = "nav"> 
							   <div ng-repeat = "table in table.names">  
									<li active-table document-events table = '{{table}}' 
									    ng-class = "{opened: table.isOpen(), hovered: table.hovered}"
									    ng-dblclick = "tableOp.open(table.name)"
									    ng-click = "table.select($event)" class = "table-name">
									    <div class = "checkbox-cont cont-100">
								     		 <span ng-click = "table.select($event)" class = "checkbox">
												   <span ng-if = "table.isOpen() || table.isSelected()"
											  	         class = "fa fa-check-square fa-lg checked">
											  	   </span>
									 		 </span>
								       		 <span class = "checkbox-label c-1"> {{table.name}}
								       		 </span>
							            </div>
									</li>
								</div> 
							</ul> 
							<div alert-window></div>
                     </form>
                </div>
				<div draggable ng-if = "tableOp.display" ng-init = "ops = tableOp" 
				     ng-include = "'result.dbexp'" class = "result-container">
 				</div>
				<div ng-if = "tableOp.newtable.display" ng-include = "'newTable.dbexp'"></div>
				
				<div draggable ng-if = "tableOp.alert.display" ng-init = "alert = tableOp.alert"
				     ng-include = "'alerts.dbexp'" class = "z-alert">
			    </div>
			    
			    <div style = "padding:5px 10px;" class = "list-status"> 
			     	 <div ng-if = "tableOp.status.pending"> 
			     	      <span class = "fa fa-spinner fa-spin"></span> {{tableOp.message}}
			     	 </div> 
			     	 <span ng-if = "tableOp.status.success"> {{tableOp.message}} </span> 
			     	 <span ng-if = "tableOp.status.error" style = "color:#f55;">
			     	       Error : {{tableOp.message}} 
			     	 </span> 
				</div>
           </div> 
      </div>
</div>