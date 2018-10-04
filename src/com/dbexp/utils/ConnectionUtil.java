package com.dbexp.utils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.tomcat.dbcp.dbcp2.BasicDataSource;
import org.hibernate.SessionFactory;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Environment;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

public class ConnectionUtil  {
	
	private static ConcurrentHashMap<String, BasicDataSource> dataSource = null;
	private static ConcurrentHashMap<String, ArrayList<String>> members = null;
	private static SessionFactory sessionFactory = null;
	
	private static String getDriverName(String dbName) {
		
		String driver = "";
		
		switch (dbName) {
		
			case "MySQL": {
				driver = "com.mysql.jdbc.Driver";
				break;
			}
			case "Oracle": {
				driver = "oracle.jdbc.OracleDriver";
				break;
			}
			default : {
				driver = "org.postgresql.Driver";
				break;
			}
		}
		return driver;
	}
	private static String getDialect(String dbName) {
		
		String version = "";
		
		if (dbName.indexOf("Oracle") != -1) {
			version = dbName.substring(6);
		}	
		
		return "org.hibernate.dialect." + dbName + version + "Dialect";
	}
	private static BasicDataSource getDataSource(JSONObject userData, JSONObject preferences, 
			                                     String userId) throws ClassNotFoundException {
		
		if (dataSource == null) {
			dataSource = new ConcurrentHashMap<String, BasicDataSource>();
		}
		
		if (members == null) {
			members = new ConcurrentHashMap<String, ArrayList<String>>();
		}
		
		String name = (String)userData.get("name");
		String password = (String)userData.get("password");
		String pool = (String)preferences.get("pool");
		String uniqueKey = "";
		
		BasicDataSource bds = null;
		
		String account = name + password + pool + uniqueKey;
		
		ArrayList<String> list = null;
		
		if (pool.equals("Join")) {
			
			bds = dataSource.get(account);
			
			if (bds == null) {
				bds = createDataSource(userData, preferences);
				list = new ArrayList<String>();
				list.add(userId);
				dataSource.put(account, bds);
				members.put(account, list);
				return bds;
			}
			
			list = members.get(account);
			list.add(userId);
			
			return dataSource.get(account);
			
		} else {
			
			pool = pool.equals("New") ? "Join" : pool;
			account = name + password + pool + uniqueKey;
			bds = createDataSource(userData, preferences);
			list = new ArrayList<String>();
			list.add(userId);
			dataSource.put(account, bds);
			members.put(account, list);
			
			return bds;
		} 
	}
	
	private static BasicDataSource createDataSource(JSONObject userData, 
			                                        JSONObject preferences) {
		
		BasicDataSource bds = new BasicDataSource();
		String dbName = (String) userData.get("dbVendor");
		
		Long maxTotal = Long.parseLong((String) preferences.get("maxTotal"));
		Long maxIdle = Long.parseLong((String) preferences.get("maxIdle"));
		Long maxWait = Long.parseLong((String) preferences.get("maxWait"));
		
		bds.setDriverClassName(getDriverName(dbName));
		bds.setUsername((String) userData.get("name"));
		bds.setPassword((String) userData.get("password"));

		bds.setUrl((String) preferences.get("databaseUrl"));
		bds.setMaxTotal(maxTotal.intValue());
		bds.setMaxIdle(maxIdle.intValue());
		bds.setMaxWaitMillis(maxWait.intValue()*1000);
				
		return bds;
	}
	
	public static Connection getConnection(JSONObject userData, JSONObject preferences,
			                 String userId) throws SQLException, ClassNotFoundException {
		return getDataSource(userData,preferences, userId).getConnection();
	}
	
	public static SessionFactory getSessionFactory(JSONObject userData, JSONObject preferences,
			                     String userId) throws SQLException, ClassNotFoundException {
		
		boolean useSpring = (boolean) preferences.get("useSpring");
		String dbName = (String) userData.get("dbVendor");
		
		if (useSpring) {
			
			if (sessionFactory == null || sessionFactory.isClosed()) {
				
				BasicDataSource bds = getDataSource(userData, preferences, userId);
				LocalSessionFactoryBean builder = new LocalSessionFactoryBean();
				DefaultListableBeanFactory bf = new DefaultListableBeanFactory();
				Properties properties = new Properties();
				
				builder.setDataSource(bds);
				properties.put("hibernate.dialect", getDialect(dbName));
				builder.setHibernateProperties(properties);
				
				bf.initializeBean(builder, "builder");
			
				if (sessionFactory == null) {
					sessionFactory = builder.getObject();
				} else {
					return builder.getObject();
				}
			}
				
		} else {
			
			if(sessionFactory == null || sessionFactory.isClosed()) {
				
				StandardServiceRegistryBuilder builder = 
												new StandardServiceRegistryBuilder();
				Hashtable<String,String> hibernateProperties = 
												new Hashtable<String, String>();
				hibernateProperties.put(Environment.DRIVER, getDriverName(dbName));	
				hibernateProperties.put(Environment.URL, 
									(String) preferences.get("databaseUrl"));	
				hibernateProperties.put(Environment.USER, (String) userData.get("name"));	
				hibernateProperties.put(Environment.PASS, (String) userData.get("password"));	
				hibernateProperties.put(Environment.POOL_SIZE, 
								String.format("%d", preferences.get("maxTotal")));	
				hibernateProperties.put(Environment.C3P0_IDLE_TEST_PERIOD, 
								String.format("%d", 1000*(long)preferences.get("maxWait")));
				//hibernateProperties.put(Environment.DIALECT, getDialect());
				builder.applySettings(hibernateProperties); 
				StandardServiceRegistry registry = builder.build();		
				MetadataSources datasources = new MetadataSources(registry);
				Metadata metadata =  datasources.getMetadataBuilder().build();
				
				if(sessionFactory == null) {
					sessionFactory = metadata.getSessionFactoryBuilder().build();
				} else {
					SessionFactory factory = metadata.getSessionFactoryBuilder().build();
					return factory;
				}
			}
		}
		return sessionFactory;
	}
	
	public static void closeDataSource(JSONObject userData, 
			           JSONObject preferences, String userId) throws SQLException {
		
		String name = (String) userData.get("name");
		String password = (String) userData.get("password");
		String pool = (String) preferences.get("pool");
		String uniqueKey = "";
		
		String account = name + password + pool + uniqueKey;
		
		ArrayList<String> list = members.get(account);
		list.remove(userId);
		
		if (list.isEmpty()) {
			BasicDataSource bds = dataSource.get(account);
			bds.close();
			
			dataSource.remove(account);
			members.remove(account);
			
			if (dataSource.size() == 0) {
				dataSource = null;
				members = null;
			}
			
		} else {
			members.put(account, list);
		}
	}
}
