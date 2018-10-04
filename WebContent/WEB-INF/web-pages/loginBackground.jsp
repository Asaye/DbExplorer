<div>
	<div class = "tiles tiles-column"></div> 
	<div class = "tiles tiles-row"></div>
	<div class = "fill-both-abs">
		<div class = "fill-both-abs">
			<svg class = "fill-both">
				<mask id = "login-mask">
					<rect width = "100%" height = "100%" fill = "#fff"/>
					<g transform = "scale(0.5) translate(100,80)">
						<path x = "0" y = "0"  fill = "url(#table-image-right)" stroke = "#ccc" 
							  d = "m 200,100 a 100,100 0 1,0 0,1">
						</path>
						<defs>
						  <pattern id = "table-image-right" patternUnits = "userSpaceOnUse" width = "200" height = "200">
						    <image xlink:href = "${pageContext.request.contextPath}/resources/images/tableImage.JPG" 
						     	   width = "200" height = "200" viewBox = "0 0 200 200" preserveAspectRatio = "none" >
						    	<animate id = "o1" attributeName = "x" from = "0"  to = "200"
						         	repeatCount = "indefinite" dur = "2s" />
						    </image>
						  </pattern>
						</defs>
						<path x = "0" y = "0"  fill = "url(#table-image-left)"  stroke = "#ccc" 
							  d = "m 200,100 a 100,100 0 1,0 0,1">
						</path>
						<defs>
	  						<pattern id = "table-image-left" patternUnits = "userSpaceOnUse" width = "200" height = "200">
	    						<image xlink:href = "${pageContext.request.contextPath}/resources/images/tableImage.JPG"
	    							   width = "200" height = "200" viewBox = "0 0 200 200" preserveAspectRatio = "none">
	    							<animate  attributeName = "x" from = "-200"  to = "0"
	         							  repeatCount = "indefinite" dur = "2s"/>
	         					</image>
	  						</pattern>
						</defs>
						<path x = "0" y = "0" fill = "none" stroke-width = "3" stroke = "#ccc"
							  id = "dbOrbit" stroke-dashoffset = "55" stroke-dasharray = "100 200 1000" 
							  d = " M 209.5,15.29942314911193 a 140,20 -45 1,0 0,1 ">
						</path>
						<circle cx = "0" cy = "0" r = "20" fill = "#66afe9">
						    <animate attributeType = "CSS" attributeName = "visibility" from = "visible"  to = "visible"
	         						 repeatCount = "indefinite" values = "visible;hidden;visible;visible"
	         						 keyTimes = "0;0.05;0.42;1" dur = "2s"/>
							<animateMotion  repeatCount = "indefinite" dur = "2s"><mpath xlink:href = "#dbOrbit"/>
							</animateMotion>
						</circle>
					</g>
					<text style = "font-size:4em" x = "180" y = "100"> Explore your database with ease. </text>
				</mask>
				<rect x = "0" y = "0" width = "100%" height = "100%" style = "fill:#2c3e50; opacity:0.9" 
				      mask = "url(#login-mask)"/>
			</svg>
		</div>
	</div>	
</div>