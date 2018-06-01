package com.fui.cloud.service.appservice;

import com.fui.cloud.service.appservice.common.AbstractAppSuperService;
import com.fui.cloud.service.appservice.common.ErrCodeAndMsg;
import com.fui.cloud.service.appservice.message.APPMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.util.List;

/**
 * @Title 文件上传服务处理类
 * @Author sf.xiong on 2017-11-23.
 */
@Service("appFileUploadService")
public class AppFileUploadService extends AbstractAppSuperService {

    /**
     * 上传服务
     */
    public void handleRequest(MultipartHttpServletRequest request, APPMessage responseMsg) {
        //上传文件
        try {
            List<MultipartFile> files = request.getFiles("file");
            for (MultipartFile multipartFile : files) {
                String filePathStr = reduceImage(multipartFile);
                String tempDir = System.getProperty("user.home") + File.separator;
                String targetFilePath = tempDir + multipartFile.getOriginalFilename();
                File file = new File(targetFilePath);
                if (file.exists()) {
                    logger.info("删除压缩临时文件：{}", targetFilePath);
                    file.delete();
                }
                if (StringUtils.isBlank(filePathStr)) {
                    responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
                    return;
                }
                if (logger.isDebugEnabled()) {
                    logger.debug(" filePath = {}", filePathStr);
                }
                responseMsg.addBodyParam("imageURL", filePathStr);
            }
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.SUCCESS);
        } catch (Exception e) {
            responseMsg.setErrCodeAndMsg(ErrCodeAndMsg.FAIL);
        }
    }
}