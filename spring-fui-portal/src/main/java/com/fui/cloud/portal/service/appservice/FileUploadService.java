package com.fui.cloud.portal.service.appservice;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.fastdfs.FastDfsUtils;
import com.fui.cloud.portal.service.appservice.common.AbstractSuperService;
import com.fui.cloud.portal.service.appservice.common.ErrCodeAndMsg;
import com.fui.cloud.portal.service.appservice.message.APPMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;

/**
 * @Title 文件上传服务处理类
 * @Author sf.xiong on 2017-11-23.
 */
@Service("fileUploadService")
public class FileUploadService extends AbstractSuperService {

    @Autowired
    private FastDfsUtils fastDfsUtils;

    /**
     * 上传服务
     */
    public void handleRequest(MultipartHttpServletRequest request, APPMessage responseMsg) {
        //上传文件
        try {
            List<MultipartFile> files = request.getFiles("file");
            for (MultipartFile multipartFile : files) {
                String filePathStr = fileHandleFastDfs(multipartFile);
                if (StringUtils.isBlank(filePathStr)) {
                    responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
                    return;
                }
                if (logger.isDebugEnabled()) {
                    logger.debug(" filePath = {}", filePathStr);
                }
            }
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.SUCCESS);
        } catch (Exception e) {
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
        }
    }

    /**
     * 根据上传文件标识,处理上传文件
     *
     * @param file 上传文件
     * @return 返回保存文件的相对路径
     */
    private String fileHandleFastDfs(MultipartFile file) {
        //文件扩展名
        String fileExtName = getFileExtName(file.getOriginalFilename());
        //原文件名
        String originName = file.getOriginalFilename();
        //上传后的文件URL
        String fileUrl = "";

        try {
            JSONObject result = fastDfsUtils.uploadFastDfs("", file.getBytes(), file.getSize(), fileExtName, originName);
            if (result.getInteger("error") != null && 0 == result.getInteger("error")) {
                fileUrl = result.getString("url");
            }
        } catch (IOException e) {
            logger.error("{} file upload 异常 = {}", file.getOriginalFilename(), e.getMessage());
        }

        return fileUrl;
    }

    /**
     * 获取文件扩展名称
     *
     * @param fileName 文件名
     * @return 文件扩展名称
     */
    private String getFileExtName(String fileName) {
        int len = fileName.lastIndexOf(".");
        String suffix = "";
        if (len != -1) {
            suffix = fileName.substring(len + 1);
        }
        return suffix;
    }
}