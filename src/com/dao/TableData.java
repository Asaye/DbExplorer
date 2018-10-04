package com.dao;


import java.sql.*;
import java.util.Map;
import java.util.concurrent.locks.*;

import org.hibernate.Session;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.dbexp.utils.DbexpConnectionManager;

public class TableData {
	
	private final Lock lock = new ReentrantLock();
	private final Condition canSend = lock.newCondition();
	private final Condition canGet = lock.newCondition();
	private String sessionId;
	
	
	private boolean occupied = false;
	
	private JSONObject tableData, result;
	
	public TableData (String sessionId) {
		this.sessionId = sessionId;
	}
	
	public void getTableData(String[] params) throws InterruptedException {
		
		String type = params[0], name = params[1], 
			   sql = params[2], sql_key = params[3];
		
		lock.lock();
		
		while (occupied) {
			canGet.await();
		}	
		
    	Map<String, Object> map = DbexpConnectionManager.getSession(sessionId);
    	Object object = map.get("session");
    	
    	if (object instanceof Session) {
    		Session session = (Session)object;
		} else if (object instanceof Connection) {
			Connection conn  = (Connection)object;
    		tableData = new JSONObject();
			try {
				
				if (type.toLowerCase().equals("query")) {
					getColumns(conn, name, sql);
				} else {
					updateColumns(conn, sql);
				}
				
				if (sql_key != null) {
					getKey(conn, sql_key);
				}
				
	    		occupied = true;
	    		
	    	} catch(Exception ex) {
	    		tableData.put("id", "");
	    	} finally {
	    		canSend.signal();
	    		lock.unlock();
	    	}
		}
	}
	
	public void addTableData(String tableName) throws Exception {
		
		lock.lock();
		
		while(!occupied) {
			canSend.await();
		}
		
		if (result == null) {
			result = new JSONObject();
		}
		
		if (tableData.get("ERROR:") == null) {
			result.put(tableName, tableData);
		} else {
			result.put("ERROR:", tableData);
		}
		
		occupied = false;
		canGet.signal();
		lock.unlock();
	}
	
	public JSONObject getAllTableData() {
		return result;
	}
	
	private void getColumns(Connection conn, String name, String sql) throws SQLException {
		
		Statement stat = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, 
				                              ResultSet.CONCUR_UPDATABLE);
		try {
			
			ResultSet rs = stat.executeQuery(sql);
			ResultSetMetaData data = rs.getMetaData();
	    	JSONObject dataTypes = new JSONObject();
	    	JSONObject columns = new JSONObject();
	    	JSONArray columnData = new JSONArray();
			int nColumns = data.getColumnCount();
			
			tableData.put("title", name);
			
			for (int k = 1; k <= nColumns; k++) {
				dataTypes.put(data.getColumnName(k), data.getColumnTypeName(k));
			}
			
			tableData.put("types", dataTypes);
			
			for (int j = 1; j <= nColumns ; j++) {
				
				while(rs.next()) {
					if (rs.getObject(j) != null) {
						columnData.add(rs.getObject(j).toString());
					} else {
						columnData.add(rs.getObject(j));
					}
	    		}
				
				columns.put(data.getColumnLabel(j), columnData.clone());
				tableData.put("columns", columns);
				columnData.clear();
				rs.beforeFirst();
			}
			
		} catch(Exception ex) {
			String[] s = ex.getLocalizedMessage().split("Hint");
			s = s[0].split("Position:");
	        tableData.put("ERROR:", s[0].substring(6).trim());
		}
	}
	
	private void updateColumns(Connection conn, String sql) throws Exception {
		
		Statement stat = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, 
				                              ResultSet.CONCUR_UPDATABLE);
		try {
			stat.executeUpdate(sql);
		} catch(Exception ex) {
			String[] s = ex.getLocalizedMessage().split("Hint");
	        tableData.put("ERROR:", s[0].substring(6).trim());
		}
	}
	
	private void getKey(Connection conn, String sql) throws SQLException {
		
		ResultSet rs_key = conn.createStatement().executeQuery(sql);
		
		while(rs_key.next()) {
			tableData.put("id", rs_key.getString(1).toString());
		}
	}
}
