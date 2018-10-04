package com.dao;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.dbexp.utils.DbexpConnectionManager;


@Controller
public class TablesManager {
	
	private Object object;
	private Session session;
	private Connection conn;
	
	@RequestMapping("/exploreTables")
	public void getAllTables(HttpServletRequest request, 
			                 HttpServletResponse response) throws Exception {
		
		ResultSet tableRS = null;
		String userId = request.getSession().getId(), tableName;
		Map<String, Object> map = DbexpConnectionManager.getSession(userId);
		
		object = map.get("session");
		response.setContentType("text/plain");
		
		if (object instanceof Session) {
			
			session = (Session) object;
			List<Object> list = session.createQuery("from java.lang.Object").list();
			
			for(Object li:list) {
				tableName = li.getClass().getName();
				tableName = tableName.substring(tableName.lastIndexOf(".")+1);
				response.getWriter().append("<span>"+tableName+"</span>");
			}
		} else if (object instanceof Connection) {
			conn  = (Connection)object;
			tableRS = conn.getMetaData().getTables(null, "", null, new String[] {"TABLE"});
			
			while(tableRS.next()) {
				tableName = tableRS.getString("TABLE_NAME");
				response.getWriter().append(tableName+"</>");
			}
		}
	}
	
    @RequestMapping(value = "/getTableData")
	public void getTableData(HttpServletRequest request, 
			                 HttpServletResponse response) throws IOException {
    	
    	String data = request.getReader().readLine();
    	JSONObject json = (JSONObject) JSONValue.parse(data);
    	JSONArray tables = (JSONArray) json.get("sql");
    	JSONObject params = null;
    	String[] names = null, sql = null, sql_id = null;
    	int size = tables.size(), i = 0;
    	
    	names = new String[size];
    	sql = new String[size];
    	sql_id = new String[size];
    	
    	for (Object t: tables) {
    		params = (JSONObject) t;
    		names[i] = (String) params.get("name");
    		sql[i] = (String) params.get("sql");
    		sql_id[i++] =  (String) params.get("sql_id");
    	}
    	
    	ArrayList<String[]> list = new ArrayList<String[]>();
    	
    	list.add(new String[] {"query"});
    	list.add(names);
    	list.add(sql);
    	list.add(sql_id);
    	
    	sendResponse(request, response, list);
	}
    
    
    @RequestMapping("/modify")
	public void modify(HttpServletRequest request, 
			           HttpServletResponse response) throws Exception {
    	
		String userId = request.getSession().getId();
		String data = request.getReader().readLine();
		
		Map<String, Object> map = DbexpConnectionManager.getSession(userId);
		
		object = map.get("session");
		response.setContentType("text/plain");
		
		if (object instanceof Session) {
			session = (Session) object;
		} else if (object instanceof Connection) {	
			
			conn  = (Connection)object;
			JSONObject json = (JSONObject) JSONValue.parse(data);
			
			String type = (String)json.get("type");
			String sql = (String)json.get("sql");
			String table = (String)json.get("table");
			
			ArrayList<String[]> list = new ArrayList<String[]>();
			
			list.add(new String[] {type});
			list.add(new String[] {table});
			list.add(new String[] {sql});
			
			sendResponse(request, response, list);
		}
	}
    
    private void sendResponse(HttpServletRequest request, HttpServletResponse response, 
            ArrayList<String[]> list ) throws IOException {

		String userId = request.getSession().getId(), key, result;
		String type = list.get(0)[0];
		String[] params = null, name = list.get(1), sql = list.get(2), 
		                        sql_key = list.size() > 3 ? list.get(3) : null;
		
		ExecutorService service = Executors.newCachedThreadPool();
		
		response.setContentType("text/plain");
		
		TableData data = new TableData(userId);
		
		for(int i = 0; i < sql.length; i++) {
			key = sql_key == null ? null : sql_key[i];
			params = new String[]{type, name[i], sql[i], key};
			service.execute(new TableDataRequest(data, params));
		}
		
		System.gc();
		
		JSONObject json = data.getAllTableData();
		Long begin = (new Date()).getTime();
		Long end = 0L;
		
		while (json == null || json.size() < sql.length ) {
			json = data.getAllTableData();
			end = (new Date()).getTime();
			if (end - begin > 5000) {
				break;
			}
		}
		
		if (json != null) {
			if (json.get("ERROR:") == null) {
				result = json.toJSONString();
				response.getWriter().append(result);
			} else {
				result = json.toJSONString();
				response.setStatus(400);
				response.getWriter().append(json.get("ERROR:").toString());
			}
		}
		
		service.shutdown();
    }
    
    @RequestMapping("/board")
	public String board() {
    	return "board";
	}
    
    @RequestMapping("/tableContent")
	public String tableContent() {
    	return "table";
	}
    
    @RequestMapping("/result")
	public String result() {
    	return "result";
	} 
    
    @RequestMapping("/dbButtonGroup")
	public String dbButtonGroup() {
    	return "db-bg";
	}
    
    @RequestMapping("/tabButtonGroup")
	public String tabButtonGroup() {
    	return "table-bg";
	}
    
    @RequestMapping("/colButtonGroup")
	public String colButtonGroup() {
    	return "col-bg";
	}
    
    @RequestMapping("/newTable")
	public String newTable() {
    	return "newTable";
	}
    
    @RequestMapping("/tabsPopup")
	public String tabsPopup() {
    	return "tabsPopup";
	}
    
    @RequestMapping("/alerts")
	public String alerts() {
    	return "alerts";
	}
}
