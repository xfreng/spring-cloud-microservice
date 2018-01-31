package com.fui.cloud.shiro;

import io.buji.pac4j.filter.CallbackFilter;
import io.buji.pac4j.filter.LogoutFilter;
import io.buji.pac4j.filter.SecurityFilter;
import io.buji.pac4j.subject.Pac4jSubjectFactory;
import org.apache.shiro.authz.ModularRealmAuthorizer;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.session.SingleSignOutHttpSessionListener;
import org.pac4j.cas.client.CasClient;
import org.pac4j.cas.config.CasConfiguration;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.DelegatingFilterProxy;

import javax.servlet.Filter;
import java.net.URLEncoder;
import java.util.EventListener;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @Title Shiro Pac4j 配置
 * @Author sf.xiong on 2017/12/23.
 */
@RefreshScope
@Configuration
public class ShiroPac4jConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(ShiroPac4jConfiguration.class);

    @Value("${shiro.cas}")
    private String casServerUrlPrefix;
    @Value("${shiro.server}")
    private String shiroServerUrlPrefix;
    @Value("${pac4j.clientName}")
    private String clientName;

    @Bean
    public CasClient casClient() {
        CasConfiguration configuration = new CasConfiguration(casServerUrlPrefix + "/login", casServerUrlPrefix);
        configuration.setAcceptAnyProxy(true);
        CasClient casClient = new CasClient(configuration);
        casClient.setCallbackUrl(shiroServerUrlPrefix + "/" + clientName + "/callback?client_name=" + clientName);
        casClient.setName(clientName);
        return casClient;
    }

    @Bean
    public Config casConfig() {
        Config config = new Config();
        Clients clients = new Clients(shiroServerUrlPrefix + "/" + clientName + "/callback?client_name=" + clientName, casClient());
        config.setClients(clients);
        return config;
    }

    @Bean
    public EhCacheManager ehCacheManager() {
        EhCacheManager em = new EhCacheManager();
        em.setCacheManagerConfigFile("classpath:conf/ehcache-shiro.xml");
        return em;
    }

    @Bean
    public FuiRealm fuiRealm() {
        FuiRealm realm = new FuiRealm();
        // 授权信息开启缓存，以免多次重复访问数据库
        realm.setAuthorizationCachingEnabled(true);
        return realm;
    }

    /**
     * 注册单点登出listener
     */
    @Bean
    public ServletListenerRegistrationBean<EventListener> singleSignOutHttpSessionListener() {
        ServletListenerRegistrationBean<EventListener> bean = new ServletListenerRegistrationBean<EventListener>();
        bean.setListener(new SingleSignOutHttpSessionListener());
        bean.setEnabled(true);
        return bean;
    }

    /**
     * 注册单点登出filter
     */
    @Bean
    public FilterRegistrationBean singleSignOutFilter() {
        FilterRegistrationBean bean = new FilterRegistrationBean();
        bean.setName("singleSignOutFilter");
        bean.addInitParameter("casServerUrlPrefix", casServerUrlPrefix);
        bean.setFilter(new SingleSignOutFilter());
        bean.addUrlPatterns("/*");
        bean.setEnabled(true);
        return bean;
    }

    @Bean
    public FuiPermissionResolver fuiPermissionResolver() {
        return new FuiPermissionResolver();
    }

    @Bean(name = "authorizer")
    public ModularRealmAuthorizer getModularRealmAuthorizer() {
        ModularRealmAuthorizer resolver = new ModularRealmAuthorizer();
        resolver.setPermissionResolver(fuiPermissionResolver());
        return resolver;
    }

    /**
     * 注册DelegatingFilterProxy（Shiro）
     */
    @Bean
    public FilterRegistrationBean shiroFilterRegistration() {
        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        filterRegistration.setFilter(new DelegatingFilterProxy("shiroFilter"));
        filterRegistration.addInitParameter("targetFilterLifecycle", "true");
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/*");
        return filterRegistration;
    }

    @Bean
    public DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }

    @Bean(name = "subjectFactory")
    public Pac4jSubjectFactory subjectFactory() {
        return new Pac4jSubjectFactory();
    }

    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager() {
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setAuthorizer(getModularRealmAuthorizer());
        manager.setRealm(fuiRealm());
        manager.setSubjectFactory(subjectFactory());
        // 用户授权/认证信息Cache, 采用EhCache 缓存
        manager.setCacheManager(ehCacheManager());
        return manager;
    }

    @Bean
    public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
        advisor.setSecurityManager(getDefaultWebSecurityManager());
        return advisor;
    }

    /**
     * 设置shiroFilter权限控制规则
     */
    private void setShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean) {
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();

        filterChainDefinitionMap.put("/supervisor/login/timeout", "anon");
        filterChainDefinitionMap.put("/supervisor/login/unAuthorized", "anon");
        filterChainDefinitionMap.put("/supervisor/login/logout", "anon");
        filterChainDefinitionMap.put("/supervisor/login/default", "authc");
        filterChainDefinitionMap.put("/supervisor/login/pact", "authc");
        filterChainDefinitionMap.put("/supervisor/EiService", "authc");
        filterChainDefinitionMap.put("/supervisor/calendar", "authc");
        filterChainDefinitionMap.put("/supervisor/**", "authc, fuiPerms");
        filterChainDefinitionMap.put("/" + clientName + "/callback", "callbackFilter");
        filterChainDefinitionMap.put("/" + clientName + "/**", "securityFilter");

        logger.info("shiro 规则配置完毕");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    }

    /**
     * 设置shiroFilter自定义过滤器
     */
    private void setShiroFilters(ShiroFilterFactoryBean shiroFilterFactoryBean) {
        Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
        filters.put("fuiPerms", new FuiPermsFilter());
        CallbackFilter callbackFilter = new CallbackFilter();
        callbackFilter.setConfig(casConfig());
        callbackFilter.setDefaultUrl("/" + clientName + "/index");
        filters.put("callbackFilter", callbackFilter);
        SecurityFilter securityFilter = new SecurityFilter();
        securityFilter.setClients(clientName);
        securityFilter.setConfig(casConfig());
        filters.put("securityFilter", securityFilter);
        LogoutFilter logoutFilter = new LogoutFilter();
        logoutFilter.setConfig(casConfig());
        filters.put("logoutFilter", logoutFilter);
        shiroFilterFactoryBean.setFilters(filters);
    }

    /**
     * shiroFilter
     */
    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean getShiroFilterFactoryBean() throws Exception {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        // 必须设置 SecurityManager
        shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager());
        // 设置登录页面
        String clientUrl = shiroServerUrlPrefix + "/" + clientName + "/callback?client_name=" + clientName;
        String loginUrl = casServerUrlPrefix + "/login?service=" + URLEncoder.encode(clientUrl, "utf-8");
        shiroFilterFactoryBean.setLoginUrl(loginUrl);
        // 配置无权限跳转
        shiroFilterFactoryBean.setUnauthorizedUrl("/supervisor/login/unAuthorized");
        shiroFilterFactoryBean.setSuccessUrl("/" + clientName + "/index");
        setShiroFilters(shiroFilterFactoryBean);
        setShiroFilterChain(shiroFilterFactoryBean);
        return shiroFilterFactoryBean;
    }
}
