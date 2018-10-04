<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta viewport="width=viewport-width" scale="1"/>
<title>Database Explorer</title>
	<script src = "https://code.jquery.com/jquery-3.3.1.min.js" 
            integrity = "sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin = "anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"
			integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.8/angular.min.js"></script>    
    <script type="text/javascript" src="https:////ajax.googleapis.com/ajax/libs/angularjs/1.6.8/angular-cookies.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.20/angular-ui-router.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.8/angular-sanitize.js"></script>
    <script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.js"></script>
    <script type="text/javascript" src="javascript/custom/main.js"></script> 
    <script type="text/javascript" src="javascript/custom/login.js"></script> 
    <script type="text/javascript" src="javascript/custom/explorer.js"></script>
    <script type="text/javascript" src="javascript/custom/operations.js"></script>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="css/custom/explorer.css" />
</head>
<body ng-app = "dbExpApp">
	  <div class = "container" style = "width:100vw;height:100vh;">
		   <div ng-controller = "ExpController" class = "fill-both-abs">
		   		<div all-windows ng-click = "display = false;" class = "fill-both-abs">
		   			 <div ng-if = "display" ng-style = "{left:left, top:top}" class = "tabsPopup windows z-2n">
                          <ul class = "nav">
                              <div class = "popup">
                                   <li ng-click = "board.title = 'Windows';" class = "popuptext"> Open Windows
                                   </li>
                              </div>
                          </ul>
                     </div>
		   		</div>
				<div ng-if = "board.display" ng-include = "'board.dbexp'" class = "z-2"></div>				
				<div ng-if = "list.display" ng-include = "'tableExplorer.dbexp'" 
				     ng-class = "{'h-100': !board.display}" class = "list-view">
				</div>
				<div draggable resizable ng-if = "tables.display" 
				     ng-class = "{'w-100': !list.display, 'h-100': !board.display}" class = "modal show tabs z-1">
				     <div class = "tabs-content fill-both z-2">
			              <div class = "modal-header header-text">
			                   <button type = "button" ng-click = "tables.close()" class = "close btn-close"> 
			                           &times;
			                   </button>
			                   <button ng-click = "board.maximize()" type = "button" class = "btn-resize"> 
			                   		   <span ng-class = "{'fa-window-maximize': !board.restore,
			                   		                      'fa-window-restore': board.restore}" 
			                   		         class = "fa">
			                   		   </span>
			                   </button>
			                   <h4 class = "modal-title"> Table Data </h4>
			              </div>
			              <div ng-class = "{'h-90': !board.display}" class = "modal-body tables">
			            	   <div class = "tiles tiles-column"></div>
							   <div class = "tiles tiles-row"></div>							   
							   <ul class = "nav nav-tabs z-2">
								   <div class = "fill-both-abs">
								    	<svg width = "100%" height = "100%">
										     <mask id = "title-mask">
										  		   <rect width = "2000px" height = "200px" fill = "#fff"/>
										  	 </mask>
										  	 <rect width = "100%" height = "100%" fill = "#2c3e50"
										           mask = "url(#title-mask)" style = "opacity:0.93;"/>
										</svg>
							   		</div>
								    <li ng-repeat = "tab in table.data" class = "nav-item active-tab"
							  		    ng-class = "{'inactive-tab': tab.get.active != $index}">
								        <a ng-click = "tab.changeState($index)" ng-init = "tab.changeState()"
								           ng-bind = "tab.get.title" class = "nav-link" 
								           data-toggle = "tab.get.title" >
								        </a>
								        <span ng-click = "tab.close()" class = "close-tab"> &times; </span>
									    <div draggable ng-if = "tab.get.ops.display" ng-init = "ops = tab.get.ops" 
									         ng-include = "'result.dbexp'" class = "result-container">
					 					</div>
								    </li>
							   </ul>
							   <div class = "tab-content fill-both z-1">
							   		<div class = "fill-both-abs">
								    	 <svg class = "fill-both">
										      <mask id = "table-mask">
										  		    <rect width = "2000px" height = "100%" fill = "#fff"/>
										      </mask>
										  	  <rect width = "100%" height = "100%" fill = "#2c3e50"
										            mask = "url(#table-mask)" style = "opacity:0.5;"/>
									     </svg>
							        </div>
							        <div ng-class = "{'w-100':!list.display }"
							             class = "table-status">
							        </div>
									<div ng-repeat = "table in table.data" 
									 	 ng-class = "{active: table.isActive($index)}" class = "tab-pane container">
									     <div ng-include = "'tableContent.dbexp'"></div>
									     <div ng-class = "{'w-100':!list.display }" class = "table-status"> 
									     	  <div ng-if = "table.get.ops.status.pending"> 
									     	       <span class = "fa fa-spinner fa-spin"></span>
									     	       {{table.get.ops.message}}
									     	  </div> 
									     	  <span ng-if = "table.get.ops.status.success">
									     	  	    {{table.get.ops.message}}
									     	  </span> 
									     	  <span ng-if = "table.get.ops.status.error" style = "color:#f55;">
									     	  	    Error : {{table.get.ops.message}} 
									     	  </span> 
									     </div>
									     <div draggable ng-if = "table.get.ops.alert.display" 
									          ng-init = "alert = table.get.ops.alert" ng-include = "'alerts.dbexp'"
									          class = "z-2 center-vertical fill-both-abs" style = "top:0;left:0;" >
									     </div>
								    </div>
							   </div>
						  </div>
				     </div>
				</div>
		   </div>
	  </div>
</body>
</html>