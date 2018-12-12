# Spring Cloud微服务架构体系
## 一、cloud-fui-discovery-eureka
Eureka服务发现
## 二、cloud-fui-workflow服务
工作流引擎（Activiti 5.22.0）
## 三、cloud-fui-config服务
分布式配置中心（整合Spring Cloud Bus动态刷新配置）
## 四、cloud-fui-config-repo
资源配置库
## 五、cloud-fui-db-sql服务
数据库持久
## 六、cloud-fui-web-ui服务
jcoffee框架项目视图（fui-maven移植）
### war包部署到tomcat说明：
#### 1、改变启动方式，添加如下代码：
```java 
     @Override
     protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
         return builder.sources(ServiceWebUiApplication.class);
     }
     //ServiceWebUiApplication继承SpringBootServletInitializer
```
#### 2、删除所有跟tomcat相关的jar包
## 七、cloud-fui-boot-admin-server
SpringBoot监控中心
## 八、cloud-fui-support
Shiro、cas、pac4j权限认证、单点登录通用模块
## 九、cloud-fui-config-client
配置中心获取示例
## 十、cloud-fui-consul-client
consul作为服务发现示例（需要安装consul服务端）
```bat
启动consul
consul agent -server -bootstrap-expect=1 -data-dir /tmp/consul -node=consul-150 -bind=192.168.131.150 -enable-script-checks=true -config-dir=/etc/consul.d -client=0.0.0.0 -ui -join 192.168.131.150
```
