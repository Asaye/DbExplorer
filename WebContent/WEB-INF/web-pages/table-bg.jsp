<div style = "width:475px;"  class = "modal-content" >	   				
	 <div class = "modal-body board-body">
		  <div style = "width:97%;" class = "modal-content board-form"> 
		       <div class = "grid g-15-35-35-15 z-1" >
		       		<div class = "board-info">
		       			 <div style = "font-weight:bold;"> Table  </div> {{tab.callback}} {{tab.isJoin()}}
		       		</div>
				   	<div class = "grid g-95">
				         <div class = "grid g-25-75">
							  <label class = "board-label"> From </label>
						      <input ng-model = "tab.src" class = "form-control board-input z-1"/>
						 </div>
						 <div class = "grid g-25-75">
							  <label class = "board-label"> To </label>
						      <input ng-model = "tab.dest" class = "form-control board-input z-1"/>
						 </div>
					</div>
					<div class = "grid g-95">
			             <div class = "grid g-25-75">
							  <label class = "board-label"> On </label>
						      <input ng-model = "tab.criteria_on" class = "form-control board-input z-1"/>
						 </div>
						 <div class = "grid g-25-75">
							  <label class = "board-label"> Where </label>
						      <input ng-model = "tab.where" class = "form-control board-input z-1"/>
						 </div>
					</div>
					<div params-buttons name = "tab" style = "width:90%;"></div>
		       </div>
		  </div> 
	 </div>
 </div>