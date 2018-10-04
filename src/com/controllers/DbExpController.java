package com.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URLDecoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dbexp.utils.DbexpConnectionManager;

@Controller
public class DbExpController {
	
	private DbexpConnectionManager connManager = null;
	private String requestData = null;
	
    @RequestMapping("/*")
	public String login(HttpServletRequest request, 
			            HttpServletResponse response) throws Exception {
		
    	Cookie[] cookie = request.getCookies();
		
    	if(cookie != null) {
			String name = null, value = null;
			for(Cookie c:cookie) {
				value = c.getValue();
				name = c.getName();
				if(name.equals("DbUser") && value.length() != 0) {
					requestData = URLDecoder.decode(value, "UTF-8");
					connectToDatabase(request, response);
					return "dbExplorer";
				}
			}
		}	
    	
		return "login";
	}
    
    @RequestMapping("/loginBackground")
	public String loginBackground() throws Exception {
		return "loginBackground";
	}
    
    @RequestMapping("/settings.dbexp")
	public String customizedLogin() throws Exception {
    	return "settings";
	}
    
    @PostMapping("/connect.dbexp")
	public void connectToDatabase(HttpServletRequest request,
			                      HttpServletResponse response) throws Exception {
    	
    	if (requestData == null) {
    		requestData = request.getReader().readLine();
    	}
    	
    	String[] data = new String[] 
    			{request.getSession().getId(), requestData}; 
        
    	connManager = new DbexpConnectionManager(data);
    	String loginStatus = connManager.connectToDatabase();
		requestData = null;
		response.setContentType("text/plain");
		
		if (!loginStatus.equals("success")) {
    		response.getWriter().append(loginStatus);
    		response.setStatus(401);
    	} else {
    		response.getWriter().append("success");
    	}
	}
    
    @RequestMapping("/explorer.dbexp")
	public String databaseExplorer(HttpServletRequest request, 
			                       HttpServletResponse response) throws Exception {
    	
    	String userId = request.getSession().getId();
    	
    	if (connManager != null && connManager.isLoggedIn(userId)) {
    		return "dbExplorer";
    	}else {
    		return "login";
    	}
	}
    
    @RequestMapping("/tableExplorer.dbexp")
	public String tableExplorer() throws Exception {
    	return "tableExplorer";
	}
    
    @RequestMapping("/listOfTables.dbexp")
	public String listOfTables() throws Exception {
    	return "listOfTables";
	}
    
    @RequestMapping("/table.dbexp")
	public String table() throws Exception {
    	return "table";
	}
    
    @RequestMapping("/logout.dbexp")
	public String logout() throws Exception {
    	requestData = null;
    	return "login";
	}
    
    @GetMapping("/disconnect.dbexp")
    public void disconnectFromDatabase(HttpServletRequest request, 
    		                           HttpServletResponse response) throws Exception {
    	
    	response.setContentType("text/plain");
    	String userId = request.getSession().getId(); 
    	DbexpConnectionManager.disconnectFromDatabase(userId);
    }
}


	