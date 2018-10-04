package com.servlet;

import javax.servlet.annotation.HandlesTypes;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import com.dispatchers.DbExplorerDispatcherServlet;

@HandlesTypes(WebApplicationInitializer.class)
public class DbServletContainerInitilizer extends 
             AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return null;
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class<?>[] {DbExplorerDispatcherServlet.class};
	}
	
	@Override
	protected String[] getServletMappings() {
		return new String[] {"/"};
	}
}
