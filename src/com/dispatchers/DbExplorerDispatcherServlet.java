package com.dispatchers;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages={"com.controllers", "com.viewresolvers", "com.dao"})
public class DbExplorerDispatcherServlet implements WebMvcConfigurer {
	
	@Override
	public void configureDefaultServletHandling(
								DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**")
		.addResourceLocations("/WEB-INF/resources/");
	}
	
	@Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
      registry.jsp("/WEB-INF/web-pages/", ".jsp");
    }
}
