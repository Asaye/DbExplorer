package com.dao;

public class TableDataRequest implements Runnable {
	
	private String[] params;
	private TableData data;
	
	public TableDataRequest(TableData data, String[] params ) {
		this.data = data;
		this.params = params;
	}
	
	@Override
	public void run() {
    	try {
    		data.getTableData(params); 
			data.addTableData(params[1]);
		} catch (Exception e) {}
	}
}
