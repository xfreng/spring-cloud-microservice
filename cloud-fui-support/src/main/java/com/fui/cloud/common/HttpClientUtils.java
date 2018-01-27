package com.fui.cloud.common;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.collections4.MapUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @Title 通过HttpClient组件，进行Http请求
 * @Author sf.xiong on 2017/11/22.
 */
public class HttpClientUtils {

    private static final Logger logger = LoggerFactory.getLogger(HttpClientUtils.class);

    private static final Integer CONNECT_TIMEOUT = 30000;  //连接超时时间

    private static final Integer READ_TIMEOUT = 120000;  //读取超时时间

    /**
     * 获取HttpClient对象
     *
     * @param isSupportSSL 是否支持SSL  true 支持  false 不支持
     * @return
     */
    private static CloseableHttpClient getCloseableHttpClient(boolean isSupportSSL) {
        HttpClientBuilder clientBuilder = HttpClients.custom();
        //请求超时设置
        clientBuilder.setDefaultRequestConfig(getRequestConfig());
        if (isSupportSSL) { //是否支持SSL
            //创建SSL安全连接
            SSLConnectionSocketFactory sslsf = createSSLConnSocketFactory();
            if (sslsf != null) {
                clientBuilder.setSSLSocketFactory(sslsf);
            }
        }
        return clientBuilder.build();
    }

    /**
     * 连接超时设置
     *
     * @return
     */
    private static RequestConfig getRequestConfig() {
        return RequestConfig.custom()
                .setConnectTimeout(CONNECT_TIMEOUT) //设置连接超时时间，单位毫秒。
                //设置从connect Manager获取Connection 超时时间，单位毫秒。这个属性是新加的属性，因为目前版本是可以共享连接池的。
                .setConnectionRequestTimeout(1000)
                //在提交请求之前 测试连接是否可用
                .setStaleConnectionCheckEnabled(true)
                //请求获取数据的超时时间，单位毫秒。
                .setSocketTimeout(READ_TIMEOUT).build();
    }

    /**
     * 创建SSL安全连接
     *
     * @return SSLConnectionSocketFactory
     */
    private static SSLConnectionSocketFactory createSSLConnSocketFactory() {
        SSLConnectionSocketFactory sslsf = null;
        try {
            SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {
                public boolean isTrusted(X509Certificate[] chain, String authType) throws CertificateException {
                    return true;
                }
            }).build();
            sslsf = new SSLConnectionSocketFactory(sslContext, new X509HostnameVerifier() {
                public boolean verify(String arg0, SSLSession arg1) { //授信
                    return true;
                }

                public void verify(String host, SSLSocket ssl) throws IOException {
                }

                public void verify(String host, X509Certificate cert) throws SSLException {
                }

                public void verify(String host, String[] cns, String[] subjectAlts) throws SSLException {
                }
            });
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        }
        return sslsf;
    }

    /**
     * 判断是否为 https请求
     *
     * @return boolean   true  是  false 否
     */
    public static boolean isSupportSSL(String url) {
        if (StringUtils.isNullOrEmpty(url)) {
            return false;
        }
        String temp = url.toLowerCase();
        if (temp.contains("https://")) {
            return true;
        }
        return false;
    }

    /**
     * post 请求无参数
     *
     * @param url 请求url
     * @return
     */
    public static String post(String url) {
        return post(url, null);
    }

    /**
     * post 请求数据格式application/x-www-form-urlencoded
     *
     * @param url       请求url
     * @param paramsMap 请求参数
     * @return
     */
    public static String post(String url, Map<String, String> paramsMap) {
        boolean supportSSL = isSupportSSL(url);
        CloseableHttpClient client = getCloseableHttpClient(supportSSL);
        String result = "";
        try {
            HttpPost httpPost = new HttpPost(url);
            if (MapUtils.isNotEmpty(paramsMap)) {
                List<BasicNameValuePair> params = new ArrayList<>();
                for (Iterator it = paramsMap.keySet().iterator(); it.hasNext(); ) {
                    String name = (String) it.next();
                    params.add(new BasicNameValuePair(name, paramsMap.get(name)));
                }
                httpPost.setEntity(new UrlEncodedFormEntity(params, CommonConstants.DEFAULT_CHARACTER));
            }
            CloseableHttpResponse response = client.execute(httpPost);

            if (HttpStatus.OK.value() == response.getStatusLine().getStatusCode()) {
                HttpEntity entity = response.getEntity();
                if (logger.isDebugEnabled()) {
                    Header header = entity.getContentType();
                    logger.debug("响应类型 name = {}  value = {}", header.getName(), header.getValue());
                }
                result = EntityUtils.toString(entity);
            }
        } catch (ClientProtocolException e) {
            logger.error("请求url = {} 协议错误", url, e);
            result = errorResponseToJSON("-1", "请求协议错误" + e.getMessage());
        } catch (IOException e) {
            logger.error("url = {}接口访问异常！", url, e);
            result = errorResponseToJSON("-1", "接口访问异常" + e.getMessage());
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                logger.error("url = {} 接口访问关闭连接异常！", url, e);
            }
        }
        return result;
    }

    /**
     * get请求
     *
     * @param url
     * @return
     */
    public static String get(String url) {
        return get(url, null);
    }

    /**
     * get请求
     *
     * @param url
     * @param params 请求参数
     * @return
     */
    public static String get(String url, Map<String, String> params) {
        boolean supportSSL = isSupportSSL(url);
        CloseableHttpClient client = getCloseableHttpClient(supportSSL);
        if (MapUtils.isNotEmpty(params)) {
            StringBuffer param = new StringBuffer();
            param.append(url.contains("?") ? "" : "?");
            int i = 0;
            for (String key : params.keySet()) { //请求参数拼接
                if (i > 0) {
                    param.append("&");
                }
                param.append(key).append("=").append(params.get(key));
                i++;
            }
            url = url + param.toString();
        }
        String result = "";
        try {
            HttpGet httpget = new HttpGet(url);
            CloseableHttpResponse response = client.execute(httpget);
            if (HttpStatus.OK.value() == response.getStatusLine().getStatusCode()) {
                HttpEntity entity = response.getEntity();
                if (logger.isDebugEnabled()) {
                    Header header = entity.getContentType();
                    logger.debug("响应类型 name = {}  value = {}", header.getName(), header.getValue());
                }
                result = EntityUtils.toString(entity);
            }
        } catch (ClientProtocolException e) {
            logger.error("请求url = {} 协议错误", url, e);
            result = errorResponseToJSON("-1", "请求协议错误" + e.getMessage());
        } catch (IOException e) {
            logger.error("url = {}接口访问异常！", url, e);
            result = errorResponseToJSON("-1", "接口访问异常" + e.getMessage());
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                logger.error("url = {} 接口访问关闭连接异常！", url, e);
            }
        }
        return result;
    }

    /**
     * 发送json数据
     *
     * @param url
     * @param json
     * @return 返回json
     */
    public static JSONObject postToJSON(String url, JSONObject json) {
        return postToJSON(url, null, json);
    }

    /**
     * 发送json数据
     *
     * @param url
     * @param json
     * @return 返回json
     */
    public static JSONObject postToJSON(String url, String contentType, JSONObject json) {
        boolean supportSSL = isSupportSSL(url);
        CloseableHttpClient client = getCloseableHttpClient(supportSSL);
        HttpPost post = new HttpPost(url);
        if (StringUtils.isNotEmpty(contentType)) { //设置请求头内容格式
            post.setHeader("Content-Type", contentType);
        }
        JSONObject response = null;
        try {
            StringEntity s = new StringEntity(json.toString(), "UTF-8");
            s.setContentEncoding(CommonConstants.DEFAULT_CHARACTER);
            s.setContentType(MediaType.APPLICATION_JSON_VALUE);
            post.setEntity(s);

            HttpResponse res = client.execute(post);
            if (res.getStatusLine().getStatusCode() == HttpStatus.OK.value()) {
                HttpEntity entity = res.getEntity();
                response = JSONObject.parseObject(EntityUtils.toString(entity));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    /**
     * 发送加密后的json数据
     *
     * @param url
     * @param json
     * @return 返回json
     */
    public static String postToJSONWithEncrypt(String url, String json) {
        boolean supportSSL = isSupportSSL(url);
        CloseableHttpClient client = getCloseableHttpClient(supportSSL);
        HttpPost post = new HttpPost(url);
        String response = null;
        try {
            StringEntity s = new StringEntity(json, "UTF-8");
            s.setContentEncoding(CommonConstants.DEFAULT_CHARACTER);
            s.setContentType(MediaType.APPLICATION_JSON_VALUE);
            post.setEntity(s);

            HttpResponse res = client.execute(post);
            if (res.getStatusLine().getStatusCode() == HttpStatus.OK.value()) {
                HttpEntity entity = res.getEntity();
                response = EntityUtils.toString(entity);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    /**
     * 返回错误信息
     *
     * @param errorCode
     * @param errorMsg
     * @return
     */
    public static String errorResponseToJSON(String errorCode, String errorMsg) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("errorCode", errorCode);
        jsonObject.put("errorMsg", errorMsg);
        return jsonObject.toJSONString();
    }
}