<div width-adjust class = "modal show result-modal" style = "visibility:hidden;">
	 <div class = "modal-content">
		  <div class = "modal-header result-header z-2"> Query Result 
			   <button ng-click = "ops.hide()" type = "button"  class = "close"> &times; </button> 
		  </div>
		  <div class = "modal-body result-body z-1">
			   <div ng-if = "ops.isArray" style = "max-height:55vh;">
			        <div has-scrollbar>
						 <table class = "revert z-0">
								<tr ng-repeat = "row in ops.result track by $index" class = "row-vertical">
									<td ng-repeat = "col in row track by $index" ng-class = "{'result-title': $index === 0}" 
										style = "border:1px solid #777"> {{col}} 
									</td>
								</tr>
					    </table>
					</div>
			   </div>
			   <div ng-if = "!ops.isArray" class = "z-0"> {{ops.result}} </div>
		  </div>
		  <div class = "modal-footer result-footer z-2"></div>
	 </div>
</div>