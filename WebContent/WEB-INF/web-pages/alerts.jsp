<div class = "center-horizontal"> 
	 <div ng-if = "alert.type === 'danger'" class = "alert alert-danger alert-dismissable"> 
	      <button ng-click = "alert.hide()" type = "button" class = "close"> &times; </button>
	      <div style = "text-align:center;"> {{alert.message}} </div>
	      <div style = "text-align:center;">
		      <button ng-click = "alert.response = 'Yes'" type = "button" class = "btn btn-danger btn-alert"> Yes
		      </button>
		      <button ng-click = "alert.response = 'No'" type = "button" class = "btn btn-danger btn-alert"> No 
		      </button>
	      </div>
	 </div>

	 <div ng-if = "alert.type === 'success'" class = "alert alert-success alert-fade"> {{alert.message}}
	 </div>

	 <div ng-if = "alert.type === 'info'" class = "alert alert-info alert-dismissable"> 
		  <button ng-click = "alert.hide()" type = "button" class = "close"> &times; </button> {{alert.message}}
	 </div>

	 <div ng-if = "alert.type === 'warning'" class = "alert alert-warning alert-dismissable"> 
		  <button ng-click = "alert.hide()" type = "button" class = "close"> &times; </button> {{alert.message}}
	 </div>
</div>