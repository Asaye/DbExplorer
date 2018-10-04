<div class = "modal show">
	 <div class = "right-align">
	      <div draggable-window class = "settings-modal">
	           <div class = "modal-content right-to-left">
	                <div class = "modal-header settings-header">
	                     <button type = "button" class = "close btn-close" ng-click = "user.cancel()"> &times; 
	                     </button>
	                     <div style = "font-size:20px;float:left;margin-left:10px;">
			                 <span class = "fa fa-gear fa-lg"></span>
			                 <span> Login Settings </span>
		                 </div>
		            </div>
		            <div class = "modal-body settings-panel">
		                 <div class = "accordion">
		                      <uib-accordion>
		                           <div class = "panel-group">
		                                <div uib-accordion-group class = "accordion-heading">
		                                     <uib-accordion-heading>
		                                 	      <span arrow-up-down class = "pull-right glyphicon glyphicon-menu-down">
		                                 		  </span> Persistence Framework
		                                 	 </uib-accordion-heading>
			                                 <div class = "well well-sm well-settings">
			                                	  <div login g = "pref" name = "framework" value = "Hibernate"
			                                		   class = "container input-custom input-label-left">
												  	   <span class = "radio-adjust">
												  		     <span ng-class = "{'radio-checked': user.get.hibernate}"
												  			       class = "radio-outer">
												  		     </span>
												  	   </span> Hibernate  
												  </div>
												  <div login g = "pref" name = "framework" 
												       value = "JDBC" class = "container input-custom input-label-right">
												  	   <span class = "radio-adjust">
												  		     <span ng-class = "{'radio-checked': user.get.jdbc}"
												  			       class = "radio-outer">
												  		     </span>
												 	   </span> JDBC
												  </div>
												  <div class = "checkbox-cont cont-50">
													   <span login g = "pref" name = "useSpring" class = "checkbox">
															 <span ng-if = "user.get.spring" 
														  	       class = "fa fa-check-square fa-lg checked">
														  	 </span>
														</span>
													    <span class = "checkbox-label c-2"> Use Spring  </span>
												  </div>							
			                            	 </div>
		                                </div>
		                           </div>
		                           <div class = "panel-group">
		                                <div uib-accordion-group class = "accordion-heading">
		                                     <uib-accordion-heading>
			                                      <span arrow-up-down 
		                                 	            class = "pull-right glyphicon glyphicon-menu-down">
		                                 	      </span> Database Name
		                                     </uib-accordion-heading>
		                                     <div class = "well well-sm well-settings">
		                                          <div style = "margin:0 10px;">
			                                           <form class = "form-horizontal">
			                                                 <div class = "form-group compact">
			                                                      <input login g = "pref" name = "dbName"
			                                                             class = "form-control input-pref"/>
			                                                 </div>
			                                           </form>
		                                          </div>
		                                     </div>
		                                </div>
		                           </div>
			                       <div class = "panel-group">
			                            <div uib-accordion-group class = "accordion-heading">
			                                 <uib-accordion-heading>
				                                  <span arrow-up-down 
			                                 	        class = "pull-right glyphicon glyphicon-menu-down">
			                                 	  </span> Host Address
			                                 </uib-accordion-heading>
			                                 <div class = "well well-sm well-settings">
			                                      <div style = "margin:0 10px;">
			                                           <form class = "form-horizontal">
			                                                 <div class = "form-group  compact">
			                                                      <input login g = "pref" name = "hostAddress" 
			                                                             class = "form-control input-pref"/>
			                                                 </div>
			                                           </form>
			                                      </div>
			                                 </div>
			                            </div>
			                        </div>
			                        <div class="panel-group">
			                             <div uib-accordion-group class = "accordion-heading">
			                                  <uib-accordion-heading>
				                                   <span arrow-up-down class = "pull-right glyphicon glyphicon-menu-down">
			                                 	   </span> Port Number
			                                  </uib-accordion-heading>
			                                  <div class = "well well-sm well-settings">
				                                   <div style = "margin:0 10px;">
				                                        <form class = "form-horizontal">
				                                              <div class = "form-group compact">
				                                                   <input login g = "pref" name = "portNumber"
				                                                 		  ng-class = "{'warning': !user.isPortValid()}"  
				                                                  	      type = "number" class = "form-control input-pref"/>
					                                                 <span ng-if = "!user.isPortValid()"
					                                                 	   class = "color-warning">
					                                                       Enter numbers between 0 and 65,535
					                                                 </span>
				                                              </div>
				                                        </form>
				                                   </div>
			                                </div>
			                             </div>
			                        </div>
			                        <div class = "panel-group">
			                             <div uib-accordion-group class = "accordion-heading">
			                                  <uib-accordion-heading>
				                                   <span arrow-up-down class = "pull-right glyphicon 
			                                 	                                glyphicon-menu-down">
			                                 	   </span> Database URL
			                                </uib-accordion-heading>
			                                <div class = "well well-sm well-settings">
			                                     <div style = "margin:0 10px;">
			                                          <form class = "form-horizontal">
			                                                <div class = "form-group compact">
			                                                     <input ng-model = "user.url" ng-class = "{'warning': 
			                                                 	                                           !user.isUrlValid()}"
			                                                 	        class = "form-control input-pref"/>
				                                                 <div ng-if = "!user.isUrlValid()" class = "color-warning">
				                                                      The url format may be incorrect.
				                                                 </div>
			                                                </div>
			                                          </form>
			                                     </div>
			                                </div>
			                             </div>
			                        </div>
			                        <div class = "panel-group">
			                             <div uib-accordion-group class = "accordion-heading">
			                                  <uib-accordion-heading>
					                               <span arrow-up-down 
			                                 	         class = "pull-right glyphicon glyphicon-menu-down">
			                                 	   </span> Connection Pool
			                                  </uib-accordion-heading>
			                                  <div class = "well well-sm well-settings">
			                                	   <div class = "inline-container">
				                                	    <div login g = "pref" name = "pool" value = "New" style = "width:20%;" 
				                                	         class = "input-custom inline-3">
														  	 <span style = "left:-5px;" class = "radio-adjust">
															  	   <span ng-class = "{'radio-checked': user.get.new}"
															  			 class = "radio-outer">
															  		</span>
														  	 </span> New  
													    </div>
														<div login g = "pref" name = "pool" value = "Private" style = "width:25%;" 
														     class = "input-custom inline-3">
														  	 <span style = "left:-5px;" class = "radio-adjust">
															  	   <span ng-class = "{'radio-checked':user.get.private}"
															  			 class = "radio-outer">
															  		</span>
														  	 </span> Private  
														</div>
														<div login g = "pref" name = "pool" value = "Join" style = "width:20%;" 
														     class = "input-custom inline-3">
														  	 <span style = "left:-5px;" class = "radio-adjust">
															  	   <span ng-class = "{'radio-checked': user.get.join}"
															  			 class = "radio-outer">
															  		</span>
														  	 </span> Join  
														</div>	
												   </div>								
				                                   <div ng-if = "!user.get.join" style = "margin:0 13px;">
				                                        <form number valid = "valid" class = "form-horizontal">
				                                              <div style = "margin:5px -15px;" class = "form-group">
					                                               <label class = "control-label label-blue">
					                                           	          Max no. of connections 
					                                               </label>
									                               <input login g = "pref" name = "maxTotal"
									                                      class = "form-control input-sm"/>
									                          </div>
									                          <div style = "margin:5px -15px;" class = "form-group">
								                                   <label class = "control-label label-blue">
								                                	      Max no. of idle connections
								                                   </label>
									                             <input login g = "pref" name = "maxIdle" 
									                                    class = "form-control input-sm"/>
									                          </div>
									                          <div style = "margin:5px -15px;" class = "form-group">
								                                   <label class = "control-label label-blue">
								                                	      Max. waiting time (sec.)
								                                    </label>
								                                    <input login g = "pref" name = "maxWait" 
								                                           class = "form-control input-sm"/>
				                                              </div>
				                                              <div ng-if = "!valid" class = "color-danger">
				                                            	   *Invalid connection pool value
				                                              </div>
				                                        </form>
				                                   </div>
				                              </div>
			                             </div>
		                            </div>
		                    </uib-accordion>
		                </div>
		                <div class = "checkbox-cont cont-70">
							 <span login g = "pref" name = "save" class = "checkbox">
								  <span ng-if = "user.get.save" class = "fa fa-check-square fa-lg checked"></span>
							 </span>
						     <span class = "checkbox-label c-2"> Save my preferences  </span>
						</div>
		            </div> 
			        <div class = "modal-footer">
			             <button ng-click = "user.cancel()" type = "button" class = "btn btn-primary btn-main"> Cancel
			             </button>
			             <button ng-click = "user.save()" type = "button" class = "btn btn-primary btn-main"> Save changes
			             </button>
			        </div>
	           </div>
	      </div>
	 </div>
</div>
