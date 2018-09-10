package com.fui.cloud.shiro.filter;

import io.buji.pac4j.context.ShiroSessionStore;
import io.buji.pac4j.filter.LogoutFilter;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.J2EContext;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.core.engine.DefaultLogoutLogic;
import org.pac4j.core.engine.LogoutLogic;
import org.pac4j.core.http.adapter.J2ENopHttpActionAdapter;
import org.pac4j.core.util.CommonHelper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ShiroPac4jLogoutFilter extends LogoutFilter {

    private LogoutLogic<Object, J2EContext> logoutLogic = new DefaultLogoutLogic<Object, J2EContext>();
    private Config config;
    private String defaultUrl;
    private String logoutUrlPattern;
    private Boolean localLogout;
    private Boolean centralLogout;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        CommonHelper.assertNotNull("logoutLogic", this.logoutLogic);
        CommonHelper.assertNotNull("config", this.config);
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        SessionStore<J2EContext> sessionStore = this.config.getSessionStore();
        J2EContext context = new J2EContext(request, response, (SessionStore) (sessionStore != null ? sessionStore : ShiroSessionStore.INSTANCE));
        this.logoutLogic.perform(context, this.config, J2ENopHttpActionAdapter.INSTANCE, this.defaultUrl, this.logoutUrlPattern, this.localLogout, true, this.centralLogout);
    }

    @Override
    public Config getConfig() {
        return config;
    }

    @Override
    public void setConfig(Config config) {
        this.config = config;
    }

    @Override
    public String getDefaultUrl() {
        return defaultUrl;
    }

    @Override
    public void setDefaultUrl(String defaultUrl) {
        this.defaultUrl = defaultUrl;
    }

    @Override
    public String getLogoutUrlPattern() {
        return logoutUrlPattern;
    }

    @Override
    public void setLogoutUrlPattern(String logoutUrlPattern) {
        this.logoutUrlPattern = logoutUrlPattern;
    }

    @Override
    public Boolean getLocalLogout() {
        return localLogout;
    }

    @Override
    public void setLocalLogout(Boolean localLogout) {
        this.localLogout = localLogout;
    }

    @Override
    public Boolean getCentralLogout() {
        return centralLogout;
    }

    @Override
    public void setCentralLogout(Boolean centralLogout) {
        this.centralLogout = centralLogout;
    }
}
