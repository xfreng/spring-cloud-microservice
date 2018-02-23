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
import org.pac4j.core.config.Config;
import org.pac4j.core.context.session.J2ESessionStore;
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

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
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

    @Value("${sso.cas.server.prefixUrl}")
    private String casServerPrefixUrl;
    @Value("${sso.cas.server.loginUrl}")
    private String casServerLoginUrl;
    @Value("${sso.cas.client.name}")
    private String casClientName;
    @Value("${sso.cas.client.callbackUrl}")
    private String callbackUrl;
    @Value("${sso.cas.client.successUrl}")
    private String successUrl;

    /**
     * 请求cas服务端配置
     *
     * @return casConfiguration
     */
    @Bean
    public CasConfiguration casConfiguration() {
        CasConfiguration configuration = new CasConfiguration(casServerLoginUrl, casServerPrefixUrl);
        configuration.setAcceptAnyProxy(true);
        configuration.setLogoutHandler(casLogoutHandler());
        return configuration;
    }

    /**
     * shiro登出处理器，销毁session及登录状态等
     *
     * @return casLogoutHandler
     */
    @Bean
    public ShiroCasLogoutHandler casLogoutHandler() {
        ShiroCasLogoutHandler casLogoutHandler = new ShiroCasLogoutHandler();
        casLogoutHandler.setDestroySession(true);
        return casLogoutHandler;
    }

    /**
     * cas客户端配置
     *
     * @return casClient
     */
    @Bean
    public CasClient casClient() {
        CasClient casClient = new CasClient(casConfiguration());
        casClient.setName(casClientName);
        casClient.setCallbackUrl(callbackUrl);
        return casClient;
    }

    @Bean
    public Config casConfig() {
        Config config = new Config(casClient());
        config.setSessionStore(new J2ESessionStore());
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

    @Bean
    public FuiPermissionResolver fuiPermissionResolver() {
        return new FuiPermissionResolver();
    }

    @Bean
    public ModularRealmAuthorizer authorizer() {
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
        filterRegistration.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.INCLUDE, DispatcherType.ERROR);
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
    public DefaultWebSecurityManager securityManager() {
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setAuthorizer(authorizer());
        manager.setRealm(fuiRealm());
        manager.setSubjectFactory(subjectFactory());
        manager.setCacheManager(ehCacheManager());
        return manager;
    }

    @Bean
    public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
        advisor.setSecurityManager(securityManager());
        return advisor;
    }

    /**
     * 设置shiroFilter权限控制规则
     */
    private void setShiroFilterChain(ShiroFilterFactoryBean shiroFilterFactoryBean) {
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();

        filterChainDefinitionMap.put("/index", "signOutFilter, securityFilter");
        filterChainDefinitionMap.put("/logout", "logoutFilter");
        filterChainDefinitionMap.put("/callback", "callbackFilter");
        filterChainDefinitionMap.put("/supervisor/login/unAuthorized", "anon");
        filterChainDefinitionMap.put("/supervisor/login/default", "authc");
        filterChainDefinitionMap.put("/supervisor/login/pact", "authc");
        filterChainDefinitionMap.put("/supervisor/EiService", "authc");
        filterChainDefinitionMap.put("/supervisor/calendar", "authc");
        filterChainDefinitionMap.put("/supervisor/**", "authc, fuiPerms");

        logger.info("shiro pac4j规则配置完毕");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    }

    /**
     * 设置shiroFilter自定义过滤器
     */
    private void setShiroFilters(ShiroFilterFactoryBean shiroFilterFactoryBean) {
        Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
        SingleSignOutFilter signOutFilter = new SingleSignOutFilter();
        signOutFilter.setCasServerUrlPrefix(casServerPrefixUrl);
        filters.put("signOutFilter", signOutFilter);
        SecurityFilter securityFilter = new SecurityFilter();
        securityFilter.setConfig(casConfig());
        securityFilter.setClients(casClientName);
        filters.put("securityFilter", securityFilter);
        CallbackFilter callbackFilter = new CallbackFilter();
        callbackFilter.setConfig(casConfig());
        callbackFilter.setDefaultUrl(successUrl);
        filters.put("callbackFilter", callbackFilter);
        LogoutFilter logoutFilter = new LogoutFilter();
        logoutFilter.setCentralLogout(true);
        logoutFilter.setLocalLogout(false);
        logoutFilter.setConfig(casConfig());
        logoutFilter.setDefaultUrl(successUrl);
        filters.put("logoutFilter", logoutFilter);
        filters.put("fuiPerms", new FuiPermsFilter());
        shiroFilterFactoryBean.setFilters(filters);
        setShiroFilterChain(shiroFilterFactoryBean);
    }

    /**
     * shiroFilter
     */
    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shiroFilter() {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager());
        setShiroFilters(shiroFilterFactoryBean);
        return shiroFilterFactoryBean;
    }
}
