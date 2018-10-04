<div class = "tables-cont" ng-class = "{'h-80': !board.display}">
     <div has-scrollbar class = "table-data" table = "{{$index}}">
          <table class = "column-data">
                 <thead>
					<tr class = "header-row">
						<td class = "header-cell"> # 
							<span table-order class = "caret-down"></span>
						</td> 
						<td ng-repeat = "col in table.get.columns" ng-dblclick = "table.select(col)"
							ng-class = "{'primary-key': table.isId($index) || table.isSelected($index)}" 
							class = "header-cell">
							<span ng-bind = "table.colType($index)" class = "column-info"></span> {{col}} 
						 	<span table-order class = "caret-down"></span>
						</td>
					    <td class = "header-cell"> Edit </td>
					</tr>
				 </thead>
				 <tbody table = "{{$index}}">   
					    <tr ng-repeat = "row in table.get.content | limitTo: table.get.n_rows : table.get.pages.begin">
							<td class = "table-cell" ng-class = "{'row-even':$even, 'row-odd':$odd,    
								                                  'row-selected':row.selected}"> 
								<div class = "checkbox-cont cont-70">
								     <span ng-click = "row.selected = ''" class = "checkbox">
										   <span ng-if = "row.selected" class = "fa fa-check-square fa-lg checked">
									  	   </span>
									 </span>
								     <span class = "checkbox-label c-1"> {{table.rowNo(row)}} </span>
							    </div>
							</td> 
							<td ng-repeat ="col in row.cols" 
								ng-class = "{'table-cell':!table.isId($index) && !table.isSelected($index), 
								             'column-selected':table.isSelected($index), 'row-odd':$parent.$odd, 
											 'row-even':$parent.$even,'row-selected':row.selected }">
				             	<span content-editable ng-bind = 'col.text'></span>
				            </td>
							<td ng-class = "{'row-even':$even, 'row-odd':$odd, 'row-selected':row.selected}" 
							    class="table-cell">
								<button title = "Insert" type = "button" class = "btn btn-primary">
									    <span row-insert class = "glyphicon"></span> 
								</button>
								<button ng-click  = "table.delete(row)" ng-disabled = "!row.selected" title = "Delete" 
										 type = "button" class = "btn btn-danger">
									    <span class = "glyphicon glyphicon-trash"></span>
								</button>
							</td>
					    </tr>
				 </tbody>
	 	  </table>
  		  <div class = "tab-footer z-1">  		  
			    <div ng-if = "table.isMaxPage() || table.isEmpty()" class = "btn-add-row">
					 <button ng-click = "table.addRow()" type="button" class="btn btn-primary"> Add Row </button>	
    			</div>    			
    			<div class = "form-group rows-per-page">
    				 <label> Rows per page </label>
	    			 <div class = "input-right">
	                  	  <div menu list = "table,nRows,n_rows,rowsPerPageChange" class = "menu-up"></div>
	                 </div>
                </div>    			
				<div class = "table-pagination">
				   	 <nav ng-if = "table.get.pages.max > 0" aria-label = "">
				   		  <ul class = "pagination">
							  <li class = "page-item">
								  <a ng-if = "table.get.pages.active > 2" ng-click = "table.page = 0" class = "page-link"> First 
								  </a>
							  </li>
						      <li ng-class = "{'disabled':table.isFirstPage()}" class = "page-item">
						    	  <a ng-click = "table.prevPage()" class = "page-link"> Previous </a>
						      </li>
						      <li class = "page-item">
						    	  <a ng-if = "table.active > 2" class = "page-link"> ... </a>
						      </li> 
						      <li ng-repeat = "page in [] | range: table.get.pages.max" 
						    	  ng-class = "{'active': table.active === page}" class = "page-item">
						    	  <a ng-if = "table.isPageShown($index)" ng-bind = "page + 1" 
						    	     ng-click = "table.page = $index" class = "page-link"> 
						    	  </a>
						      </li>
						      <li class = "page-item">
						    	  <a ng-if = "table.isPageContd()" class = "page-link"> ... </a>
						      </li>
						      <li ng-class = "{'disabled': table.isMaxPage()}" class = "page-item">
						      	  <a ng-click = "table.nextPage()" class = "page-link"> Next </a>
						      </li>
						      <li class = "page-item">
						    	  <a ng-if = "table.get.pages.max > 2" ng-click = "table.lastPage()"  class = "page-link"> 
						    	     Last
						    	  </a>
						      </li>
					  	  </ul>
					 </nav>
				</div>
		  </div>         
	 </div>             
</div>
