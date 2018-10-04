<div draggable-window resizable-window class = "modal show newtable" ng-init = "newtable = tableOp.newtable">
     <div class = "modal-content">
          <div class = "modal-header newtable-header">
               <button ng-click = "newtable.display = false" type = "button" class = "close btn-close"> &times;
               </button>
               <span class = "modal-title"> New Table Properties </span>
          </div>
          <div class = "modal-body newtable-body">
          	   <div class = "newtable-name">
                    <div style = "color:#ccc;">
                        <div class = "form-group z-1">
	                         <label style = "margin-top:7px;" class = "control-label left"> Table Name: </label>
	                         <div style = "flex-basis: 50%;">
	                              <input ng-model = "newtable.name" type = "text" required class = "form-control"
	                                     placeholder = "Enter table name"/>
	                          </div>
	                          <span ng-if = "newtable.invalid.name" style = "color:#f55;padding-top:10px;"
	                                class = "glyphicon glyphicon-alert"> required
							  </span>
		                </div>
		            </div>
               </div>
               
               <div class = "newtable-data">
               		<div has-scrollbar class = "table-cont" table = "-1">
               			 <table class = "newtable-data">
		                        <tr class = "newtable-row">
								    <td> # </td> 
								    <td> Column name </td>
								    <td> Data type </td>
								    <td> Primary key </td>
								    <td> Edit </td>
							    </tr>						    
					  			<tr ng-repeat = "col in newtable.columns track by $index">
							    	<td ng-class = "{'row-even':$even,'row-odd':$odd}">
							        	{{$index + 1}}
							    	</td> 
								    <td ng-class = "{'row-even':$even,'row-odd':$odd}">
									    <form name = "columnTitle">
											  <input ng-model = "newtable.columns[$index]" style = "margin:5px;width:95%;"
											  		 required class = "form-control" type = "text" 
											         placeholder = "Enter column title"/>
									    </form>
									    <span ng-if = "col.$invalid && col.$dirty" style = "color:red;" 
										 	  class = "glyphicon glyphicon-alert">
									    </span>
								  	</td>
								    <td ng-class = "{'row-even':$even,'row-odd':$odd}" class = "newtable-types">
								  	    <div menu list = "tableOp,options,types,,$index"></div>
								    </td>
								    <td class = "id" ng-class = "{'row-even':$even,'row-odd':$odd}">
								        <div class = "container input-custom">
									         <span ng-click = "newtable.id = col" ng-class = "{'radio-checked': 
									                                                          col && col === newtable.id}"
									               class = "radio-outer">
									       </span>
									    </div>
								    </td>
								    <td ng-class = "{'row-even':$even,'row-odd':$odd}">
									    <button ng-click = "newtable.insert($index)" title = "Insert" type = "button" 
									            class = "btn btn-primary">
											    <span class = "glyphicon glyphicon-log-in"></span>
									    </button>
									    <button ng-click = "newtable.delete($index)" title = "Delete" type = "button" 
									            class = "btn btn-danger">
											    <span class = "glyphicon glyphicon-trash"></span>
									    </button>
								    </td>
				                </tr>
			             </table>
			   			 <div ng-if = "newtable.invalid.cols" style = "color:#f55;"> *column title required </div>  
               		</div>
			   </div>
			   <div class = "add-column">                   
	                <button ng-click = "newtable.add()" type = "button" class = "btn btn-primary btn-newtable"> 
	                        Add Column 
	                </button>
               </div>
          </div> 
	      <div class = "modal-footer newtable-footer z-2">
	       	   <button ng-click = "newtable.submit()" type = "button" class = "btn btn-primary"> Submit </button>
		   	   <button ng-click = "newtable.display = false"  type = "button" class = "btn btn-primary"> Cancel </button>
		  </div>
     </div>
</div>