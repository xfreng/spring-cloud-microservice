package com.fui.cloud.shiro.config;

import com.fui.cloud.shiro.filter.FuiPermsFilter;
import com.fui.cloud.shiro.filter.ShiroPac4jLogoutFilter;
import com.fui.cloud.shiro.perms.FuiPermissionResolver;
import com.fui.cloud.shiro.realm.FuiRealm;
import io.buji.pac4j.filter.CallbackFilter;
import io.buji.pac4j.filter.SecurityFilter;
import io.buji.pac4j.subject.Pac4jSubjectFactory;
import org.apache.shiro.authz.ModularRealmAuthorizer;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.spring.web.config.AbstractShiroWebFilterConfiguration;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.session.SingleSignOutHttpSessionListener;
import org.pac4j.cas.client.CasClient;
import org.pac4j.cas.client.rest.CasRestFormClient;
import org.pac4j.cas.config.CasConfiguration;
import org.pac4j.cas.logout.DefaultCasLogoutHandler;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.session.J2ESessionStore;
import org.pac4j.http.client.direct.ParameterClient;
import org.pac4j.jwt.config.encryption.SecretEncryptionConfiguration;
import org.pac4j.jwt.config.signature.SecretSignatureConfiguration;
import org.pac4j.jwt.credentials.authenticator.JwtAuthenticator;
import org.pac4j.jwt.profile.JwtGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
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
@Configuration
public class ShiroPac4jConfiguration extends AbstractShiroWebFilterConfiguration {
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
    @Value("${sso.cas.client.unauthorizedUrl}")
    private String unauthorizedUrl;
    @Value("${sso.cas.jwt.salt}")
    private String salt;

    /**
     * JWT Token 生成器，对CommonProfile生成然后每次携带token访问
     *
     * @return JwtGenerator
     */
    @Bean
    protected JwtGenerator jwtGenerator() {
        return new JwtGenerator(new SecretSignatureConfiguration(salt), new SecretEncryptionConfiguration(salt));
    }

    @Bean
    protected JwtAuthenticator jwtAuthenticator() {
        JwtAuthenticator jwtAuthenticator = new JwtAuthenticator();
        jwtAuthenticator.addSignatureConfiguration(new SecretSignatureConfiguration(salt));
        jwtAuthenticator.addEncryptionConfiguration(new SecretEncryptionConfiguration(salt));
        return jwtAuthenticator;
    }

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
     * 通过rest接口可以获取tgt，获取service ticket，甚至可以获取CasProfile
     *
     * @return CasRestFormClient
     */
    @Bean
    protected CasRestFormClient casRestFormClient() {
        CasRestFormClient casRestFormClient = new CasRestFormClient();
        casRestFormClient.setConfiguration(casConfiguration());
        casRestFormClient.setName("rest");
        return casRestFormClient;
    }

    /**
     * shiro登出处理器，销毁session及登录状态等
     *
     * @return casLogoutHandler
     */
    @Bean
    public DefaultCasLogoutHandler casLogoutHandler() {
        DefaultCasLogoutHandler casLogoutHandler = new DefaultCasLogoutHandler();
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

    /**
     * token校验相关
     *
     * @return Clients
     */
    @Bean
    protected Clients clients() {
        Clients clients = new Clients();
        ParameterClient parameterClient = new ParameterClient("token", jwtAuthenticator());
        parameterClient.setSupportGetRequest(true);
        parameterClient.setName("jwt");
        clients.setClients(casClient(), casRestFormClient(), parameterClient);
        return clients;
    }

    @Bean
    public Config casConfig() {
        Config config = new Config(casClient());
        config.setClients(clients());
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

    /**
     * 单点登出filter
     *
     * @return FilterRegistrationBean
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public FilterRegistrationBean singleSignOutFilter() {
        FilterRegistrationBean bean = new FilterRegistrationBean();
        bean.setName("singleSignOutFilter");
        SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
        singleSignOutFilter.setCasServerUrlPrefix(casServerPrefixUrl);
        singleSignOutFilter.setIgnoreInitConfiguration(true);
        bean.setFilter(singleSignOutFilter);
        bean.addUrlPatterns("/*");
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
        filterRegistration.addUrlPatterns("/supervisor/*");
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

    /**
     * 开启 shiro aop注解支持
     *
     * @return AuthorizationAttributeSourceAdvisor
     */
    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();
        // 强制使用cglib，防止重复代理和可能引起代理出错的问题
        defaultAdvisorAutoProxyCreator.setProxyTargetClass(true);
        return defaultAdvisorAutoProxyCreator;
    }

    @Bean
    public static LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
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

        filterChainDefinitionMap.put("/index", "securityFilter");
        filterChainDefinitionMap.put("/logout", "logoutFilter");
        filterChainDefinitionMap.put("/callback", "callbackFilter");
        filterChainDefinitionMap.put("/supervisor/login/unAuthorized", "anon");
        filterChainDefinitionMap.put("/supervisor/login/default", "authc");
        filterChainDefinitionMap.put("/supervisor/login/pact", "authc");
        filterChainDefinitionMap.put("/supervisor/EiService", "authc");
        filterChainDefinitionMap.put("/supervisor/calendar", "authc");
        filterChainDefinitionMap.put("/supervisor/**", "authc, fuiPerms");

        logger.info("shiro 规则配置完毕");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    }

    /**
     * 设置shiroFilter自定义过滤器
     */
    private void setShiroFilters(ShiroFilterFactoryBean shiroFilterFactoryBean) {
        Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
        SecurityFilter securityFilter = new SecurityFilter();
        securityFilter.setClients(casClientName + ",rest,jwt");
        securityFilter.setConfig(casConfig());
        filters.put("securityFilter", securityFilter);
        CallbackFilter callbackFilter = new CallbackFilter();
        callbackFilter.setConfig(casConfig());
        callbackFilter.setDefaultUrl(successUrl);
        filters.put("callbackFilter", callbackFilter);
        ShiroPac4jLogoutFilter logoutFilter = new ShiroPac4jLogoutFilter();
        logoutFilter.setCentralLogout(true);
        logoutFilter.setLocalLogout(true);
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
        ShiroFilterFactoryBean shiroFilterFactoryBean = super.shiroFilterFactoryBean();
        shiroFilterFactoryBean.setLoginUrl(casServerLoginUrl);
        shiroFilterFactoryBean.setSuccessUrl(successUrl);
        shiroFilterFactoryBean.setUnauthorizedUrl(unauthorizedUrl);
        shiroFilterFactoryBean.setSecurityManager(securityManager());
        setShiroFilters(shiroFilterFactoryBean);
        return shiroFilterFactoryBean;
    }
}
