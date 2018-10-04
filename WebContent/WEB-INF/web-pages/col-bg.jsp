<div ng-if = "col.callback === 'add'" style = "width:350px;"  class = "modal-content" >	   				
	 <div class = "modal-body board-body">
		  <div style = "width:97%;" class = "modal-content board-form"> 
		   	   <div class = "grid g-25-55-20 z-1">
		   	        <div class = "board-info">
		       			 <div style = "font-weight:bold;"> Column </div> {{col.callback}}
		       		</div>
				   	<div class = "grid g-100">
				         <div class = "grid g-25-75">
							  <label class = "board-label"> Name </label>
						      <input ng-model = "col.colName" class = "form-control board-input z-1"/>
						 </div>
						 <div class = "grid g-25-75">
							  <label class = "board-label"> Type </label>
						      <input ng-model = "col.type" class = "form-control board-input z-1"/>
						 </div>
					</div>
					<div params-buttons name = "col" style = "width:90%;"></div>
			   </div>
		  </div> 
	 </div>
</div>
<div ng-if = "col.callback !== 'add'" style = "width:475px;"  class = "modal-content">	   				
	 <div class = "modal-body board-body">
		  <div style = "width:97%;" class = "modal-content board-form"> 
		   	   <div class = "grid g-15-30-40-15 z-1">
		   	   		<div class = "board-info">
		       			 <div style = "font-weight:bold;"> Column </div> {{col.callback}}
		       		</div>
		   			<div class = "grid g-100">
			             <div class = "grid g-100">
							  <label class = "board-label"> Criteria </label>
						 </div>
						 <div class = "grid g-100">
						      <input ng-model = "col.criteria" class = "form-control board-input z-1"/>
						 </div>
					</div>
					<div class = "grid g-100">
			             <div class = "grid g-40-60">
							  <label class = "board-label"> Order by </label>
						      <input ng-model = "col.orderBy" class = "form-control board-input z-1"/>
						 </div>
						 <div class = "grid g-40-60">
							  <label class = "board-label"> Group by </label>
						      <input ng-model = "col.groupBy" class = "form-control board-input z-1"/>
						 </div>
					</div>
					<div params-buttons name = "col" style = "width:90%;"></div> 
		   	   </div>
		  </div> 
	 </div>
</div>