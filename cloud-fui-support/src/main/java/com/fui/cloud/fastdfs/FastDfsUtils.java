package com.fui.cloud.fastdfs;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.fastdfs.pools.AppException;
import com.fui.cloud.fastdfs.pools.ERRORS;
import com.fui.cloud.fastdfs.pools.FastDfsConnectionPool;
import org.apache.commons.lang.StringUtils;
import org.csource.common.NameValuePair;
import org.csource.fastdfs.StorageClient1;
import org.csource.fastdfs.StorageServer;
import org.csource.fastdfs.TrackerServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.*;
import java.net.SocketTimeoutException;
import java.util.UUID;

/**
 * @Title fastdfs文件操作工具类 1).初始化连接池； 2).实现文件的上传与下载;
 */
public class FastDfsUtils {
    private static final Logger logger = LoggerFactory.getLogger(FastDfsUtils.class);
    /**
     * 连接池
     */
    private FastDfsConnectionPool connectionPool = null;

    /**
     * 当前创建的连接数
     */
    private volatile long nowPoolSize = 0;

    /**
     * 文件上传服务器地址
     */
    private String uploadFileHost;

    /**
     * 初始化线程池
     */
    @PostConstruct
    public void init() {
        String logId = UUID.randomUUID().toString();
        logger.info("[初始化线程池(Init)][logId = {} ][默认参数：minPoolSize={},maxPoolSize={},waitTimes={}]"
                , logId, new Object[]{connectionPool.getMinPoolSize(), connectionPool.getMaxPoolSize(), connectionPool.getWaitTimes()});
        /** 初始化连接池 */
        connectionPool.poolInit(logId);
    }

    /**
     * FastDfs系统自动分配组名 文件上传
     *
     * @param fileBytes  文件字节数组
     * @param extName    文件扩展名：如png
     * @param linkUrl    访问地址：http://image.xxx.com
     * @param fileName   原文件名
     * @param fileLength 文件大小
     * @return 图片上传成功后地址
     */
    public JSONObject upload(byte[] fileBytes, String extName, String linkUrl,
                             String fileName, Long fileLength) {
        return upload(null, extName, linkUrl, fileName, fileLength);
    }

    /**
     * 指定组名 文件上传
     *
     * @param groupName  组名如group0
     * @param fileBytes  文件字节数组
     * @param extName    文件扩展名：如png
     * @param linkUrl    访问地址：http://image.xxx.com
     * @param fileName   原文件名
     * @param fileLength 文件大小
     * @return 图片上传成功后地址
     */
    public JSONObject upload(String groupName, byte[] fileBytes, String extName,
                             String linkUrl, String fileName, Long fileLength) {
        String logId = UUID.randomUUID().toString();
        /** 封装文件信息参数 */
        NameValuePair[] metaList = new NameValuePair[]{
                new NameValuePair("fileName", fileName),
                new NameValuePair("fileLength", String.valueOf(fileLength)),
                new NameValuePair("fileExtName", extName),
        };
        TrackerServer trackerServer = null;
        try {

            /** 获取fastdfs服务器连接 */
            trackerServer = connectionPool.checkout(logId);
            StorageServer storageServer = null;
            StorageClient1 client1 = new StorageClient1(trackerServer, storageServer);

            /** 以文件字节的方式上传 */
            String result = null;
            JSONObject jsonObject = resultJSONObject("0", "");
            if (StringUtils.isNotBlank(groupName)) { //指定组名
                String[] results = client1.upload_file(groupName, fileBytes, extName, metaList);
                /** results[0]:组名，results[1]:远程文件名 */
                if (results != null && results.length == 2) {
                    jsonObject.put("fileId", results[1]);
                    jsonObject.put("groupId", results[0]);
                    jsonObject.put("url", linkUrl + "/" + results[0] + "/" + results[1]);
                } else {
                    /** 文件系统上传返回结果错误 */
                    return resultJSONObject("-1", ERRORS.UPLOAD_RESULT_ERROR.ERROR().getMessage());
                }
                result = JSONArray.toJSONString(result);
            } else { //上传时不指定组名; 系统自动分配组名
                result = client1.upload_file1(fileBytes, extName, metaList);
                jsonObject.put("fileId", result);
                jsonObject.put("groupId", "");
                jsonObject.put("url", linkUrl + "/" + result);
            }

            /** 上传完毕及时释放连接 */
            connectionPool.checkin(trackerServer, logId);

            logger.info("[上传文件（upload）-fastdfs服务器相应结果][logId={}][result：results={}", logId, result);
            jsonObject.put("extName", extName);
            jsonObject.put("fileName", fileName);
            jsonObject.put("fileSize", fileLength);

            return jsonObject;

        } catch (AppException e) {
            logger.error("[上传文件（upload)][logId={}][异常：{}]", logId, e);
            return resultJSONObject("-1", "文件上传失败，" + e.getMessage());
        } catch (SocketTimeoutException e) {
            logger.error("[上传文件（upload)][logId={}][异常：{}]", logId, e);
            return resultJSONObject("-1", ERRORS.WAIT_IDLECONNECTION_TIMEOUT.ERROR().getMessage());
        } catch (Exception e) {
            logger.error("[上传文件（upload)][logId={}][异常：{}]", logId, e);
            connectionPool.drop(trackerServer, logId);
            return resultJSONObject("-1", ERRORS.SYS_ERROR.ERROR().getMessage());
        }
    }

    private JSONObject resultJSONObject(String errorCode, String errorMsg) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("error", Integer.valueOf(errorCode));
        jsonObject.put("message", errorMsg);
        return jsonObject;
    }

    /**
     * 文件下载
     *
     * @param fileId 分布式文件Id
     * @param os     输出目的地
     */
    public void download(OutputStream os, String fileId) {
        download(os, null, fileId);
    }

    /**
     * 文件下载
     *
     * @param groupId 分布式文件对应组
     * @param fileId  分布式文件Id
     * @param os      输出目的地
     */
    public void download(OutputStream os, String groupId, String fileId) {
        TrackerServer trackerServer = null;
        String logId = UUID.randomUUID().toString();
        try {
            /** 获取fastdfs服务器连接 */
            trackerServer = connectionPool.checkout(logId);
            StorageServer storageServer = null;
            StorageClient1 client1 = new StorageClient1(trackerServer, storageServer);

            /** 以文件字节的方式上传 */
            byte[] buff = null;
            if (StringUtils.isBlank(groupId)) {
                buff = client1.download_file1(fileId);
            } else {
                buff = client1.download_file(groupId, fileId);
            }
            os.write(buff); //输出到目的地
            /** 上传完毕及时释放连接 */
            connectionPool.checkin(trackerServer, logId);
            logger.info("[下载文件成功-fastdfs服务器相应结果][logId={}]", logId);
        } catch (Exception e) {
            logger.error("[下载文件（download)][logId={}][异常：{}]", logId, e);
            connectionPool.drop(trackerServer, logId);
        }
    }

    /**
     * @param group_name      组名
     * @param remote_filename 远程文件名称
     * @throws AppException
     * @Description: 删除fastdfs服务器中文件
     */
    public void deleteFile(String group_name, String remote_filename)
            throws AppException {
        String logId = UUID.randomUUID().toString();
        logger.info("[ 删除文件（deleteFile）][logId = {}][parms：group_name={},remote_filename={}]"
                , logId, new Object[]{group_name, remote_filename});
        TrackerServer trackerServer = null;
        try {
            /** 获取可用的tracker,并创建存储server */
            trackerServer = connectionPool.checkout(logId);
            StorageServer storageServer = null;
            StorageClient1 client1 = new StorageClient1(trackerServer,
                    storageServer);
            /** 删除文件,并释放 trackerServer */
            int result = client1.delete_file(group_name, remote_filename);

            /** 上传完毕及时释放连接 */
            connectionPool.checkin(trackerServer, logId);
            logger.info("[ 删除文件（deleteFile）--调用fastdfs客户端返回结果][logId={}][results：result={}", logId, result);
            /** 0:文件删除成功，2：文件不存在 ，其它：文件删除出错 */
            if (result == 2) {
                throw ERRORS.NOT_EXIST_FILE.ERROR();
            } else if (result != 0) {
                throw ERRORS.DELETE_RESULT_ERROR.ERROR();
            }
        } catch (AppException e) {
            logger.error("[ 删除文件（deleteFile）][" + logId + "][异常：" + e + "]");
            throw e;
        } catch (SocketTimeoutException e) {
            logger.error("[ 删除文件（deleteFile）][" + logId + "][异常：" + e + "]");
            throw ERRORS.WAIT_IDLECONNECTION_TIMEOUT.ERROR();
        } catch (Exception e) {
            logger.error("[ 删除文件（deleteFile）][" + logId + "][异常：" + e + "]");
            connectionPool.drop(trackerServer, logId);
            throw ERRORS.SYS_ERROR.ERROR();
        }
    }

    /**
     * @param gId         组名如group0
     * @param data        文件字节数组
     * @param fileSize    文件扩展名：如png
     * @param fileExtName 文件扩展名
     * @param originName  原文件名
     * @return
     */
    public JSONObject uploadFastDfs(String gId, byte[] data, long fileSize, String fileExtName, String originName) {
        JSONObject result = upload(gId, data, fileExtName, uploadFileHost, originName, fileSize);
        if (logger.isDebugEnabled()) {
            logger.debug(" file upload result = {} ", result);
        }
        return result;
    }

    /**
     * @param gId         组名如group0
     * @param fileExtName 文件扩展名
     * @param originName  原文件名
     * @return
     */
    public JSONObject uploadFastDfs(String gId, File file, String fileExtName, String originName) {
        byte[] data = getBytes(file);
        Long fileSize = Long.valueOf(String.valueOf(data.length), 10);
        JSONObject result = upload(gId, data, fileExtName, uploadFileHost, originName, fileSize);
        if (logger.isDebugEnabled()) {
            logger.debug(" file upload result = {} ", result);
        }
        return result;
    }

    /**
     * 获得指定文件的byte数组
     */
    private byte[] getBytes(File file) {
        byte[] buffer = null;
        try {
            FileInputStream fis = new FileInputStream(file);
            ByteArrayOutputStream bos = new ByteArrayOutputStream(1000);
            byte[] b = new byte[1000];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            fis.close();
            bos.close();
            buffer = bos.toByteArray();
        } catch (IOException e) {
            logger.error("获取文件出错:{}", e);
        }
        return buffer;
    }

    /**
     * 连接池销毁
     */
    @PreDestroy
    public void destroy() {
        getConnectionPool().destroyPool();
    }

    public FastDfsConnectionPool getConnectionPool() {
        return connectionPool;
    }

    public String getUploadFileHost() {
        return uploadFileHost;
    }

    public void setUploadFileHost(String uploadFileHost) {
        this.uploadFileHost = uploadFileHost;
    }

    public void setConnectionPool(FastDfsConnectionPool connectionPool) {
        this.connectionPool = connectionPool;
    }

    public long getNowPoolSize() {
        return nowPoolSize;
    }

    public void setNowPoolSize(long nowPoolSize) {
        this.nowPoolSize = nowPoolSize;
    }
}
