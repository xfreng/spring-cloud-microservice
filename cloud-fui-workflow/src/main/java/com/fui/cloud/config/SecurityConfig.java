package com.fui.cloud.config;

import org.activiti.rest.security.BasicAuthenticationProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new BasicAuthenticationProvider();
    }

    @Override
    protected void configure(HttpSecurity http)
            throws Exception {
        http.headers().frameOptions().disable();
        ((HttpSecurity) ((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl) ((http.authenticationProvider(authenticationProvider())
                .logout().disable()
                .formLogin().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and())
                .csrf().disable())
                .authorizeRequests().anyRequest())
                .permitAll().and())
                .httpBasic();
    }
}
