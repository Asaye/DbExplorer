package com.dbexp.utils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import com.dao.TablesManager;

public class DbexpConnectionManager{
	
	private String userId;
	private JSONObject userData;
	private JSONObject userPreferences;
	private SessionFactory sessionFactory = null;
	private static ConcurrentHashMap<String, Map<String, Object>> users = null;
	private static ConcurrentHashMap<Session,SessionFactory> sessionManager = null;

	public DbexpConnectionManager(String[] requestData) {
		
		JSONObject json = (JSONObject) JSONValue.parse(requestData[1]);
		this.userData = (JSONObject) json.get("user");
		this.userPreferences = (JSONObject) json.get("preferences");
		this.userId = requestData[0];
		
	}
	
	public String connectToDatabase() {
		
		Map<String, Object> map = null;
		
		try {
			
			String framework = (String) userPreferences.get("framework");
			boolean useSpring = (boolean) userPreferences.get("useSpring");
			
			if (users == null) {
				users = new ConcurrentHashMap<String, Map<String, Object>>();
			}
			 
			if (sessionManager == null) {
				sessionManager = new ConcurrentHashMap<Session,SessionFactory>();
			}
			
			if (framework.equals("Hibernate")) {
				
				sessionFactory = ConnectionUtil
							.getSessionFactory(userData,userPreferences, userId);
				Session userSession = sessionFactory.openSession();
				Transaction transaction = userSession.beginTransaction();
				
				if (transaction != null) {
					map.put("session", userSession);
					users.put(userId, map);
					sessionManager.put(userSession,sessionFactory);
					new TablesManager();
					return "success";
				}
				
			} else {
				
				Connection conn = null;
				Session ses = null;
				map = new HashMap<String, Object>();
				
				map.put("userData", userData);
				map.put("preferences", userPreferences);
				
				if (useSpring) {
					
					ses = ConnectionUtil
							      .getSessionFactory(userData, userPreferences, userId)
							      .openSession();
					map.put("session", ses);
					
				} else {
						
					conn = ConnectionUtil
							          .getConnection(userData, userPreferences, userId);
					map.put("session", conn);
				}
				
				users.put(userId, map);	
				
				if (conn != null || ses != null) {
					return "success";
				}
			}
			
		} catch(Exception ex) {
			
			ex.printStackTrace();
			String s = "";
			if (ex.getCause() != null) {
				s = ex.getCause().toString();
			}
			return getResponseMessage(s.substring(s.lastIndexOf(":") + 1));
		}
		return "error";
	}
	
	public boolean isLoggedIn(String userId) throws Exception {
		
		Object object = users.get(userId);
		
		if (object != null) {
			return true;
		}
		return false;
	}
	public static void disconnectFromDatabase(String userId) throws Exception {
		
		if (users != null) {
			
			Map<String, Object> map = users.get(userId);
			Object session = (Object) map.get("session");
			JSONObject userData = (JSONObject) map.get("userData");
			JSONObject userPreferences = (JSONObject) map.get("preferences");
			
			ConnectionUtil.closeDataSource(userData, userPreferences, userId);
			closeSession(session);
			
			if (session != null) {
				users.remove(userId);
			}
		}
	}
	private static void closeSession(Object object) throws SQLException {
		
		if( object instanceof Connection) {
			Connection conn = (Connection) object;
			conn.close();
		} else {
			Session ses = (Session) object;
			SessionFactory factory = sessionManager.get(ses);
			Collection<SessionFactory> factories =  sessionManager.values();
			Iterator<SessionFactory> iterator = factories.iterator();
			int counter = 0;
			while (iterator.hasNext()) {
				SessionFactory sf = iterator.next();
				if (factory.equals(sf)) {
					counter++;
				}
			}
			if (counter == 1) {
				factory.close();
			}
			sessionManager.remove(ses);
			ses.close();
		}
	}
	
	public static Map<String, Object> getSession(String userId) {
		return users.get(userId);
	}
	
	private String getResponseMessage(String status) {
		
		String message = "*Incorrect login credentials";
		
		if (status.contains("password authentication failed")) {
			message = "Password authentication failed.";
		} else if(status.contains("user name specified")) {
			message = "The user name is not specified.";
		} else if(status.contains("connection attempt failed")) {
			message = "Invalid host address.";
		} else if(status.contains("does not exist")) {
			message = "The specified database does not exist.";
		} else if(status.contains("No suitable driver")) {
			message = "Invalid database URL.";
		} else if(status.contains("Timeout")) {
			message = "Timeout waiting for idle connection.";
		}
		
		return message;
	}
}

