package com.fui.cloud.controller.image;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.QRCodeUtils;
import com.fui.cloud.controller.AbstractSuperController;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

@Controller
@RequestMapping(value = "/supervisor")
public class ImageController extends AbstractSuperController {

    @RequestMapping("/webuploader")
    public String webuploader() {
        return "supervisor/webuploader/webuploader";
    }

    /**
     * 指定内容生成二维码
     *
     * @param response
     */
    @RequestMapping("/imageQRCode")
    public void imageQRCode(HttpServletResponse response) {
        // 设置response头信息，禁止缓存
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        int width = 44;
        int height = 44;
        try {
            String content = request.getParameter("content");
            QRCodeUtils.getQRCode(response.getOutputStream(), content, width, height, ErrorCorrectionLevel.H);
            response.getOutputStream().flush();
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
    }

    /**
     * 上传图片
     *
     * @param multipartRequest
     * @return url
     */
    @RequestMapping(value = "/uploadImages", produces = CommonConstants.MediaType_APPLICATION_JSON)
    @ResponseBody
    public String uploadImages(MultipartHttpServletRequest multipartRequest) {
        JSONObject json = new JSONObject();
        MultipartFile multipartFile = multipartRequest.getFile(CommonConstants.UPLOADS);
        String filePath = request.getSession().getServletContext().getRealPath("/upload") + File.separator;
        if (multipartFile != null) {
            File file = new File(filePath);
            if (!file.exists()) {
                file.mkdirs();
            }
            filePath += multipartFile.getOriginalFilename();
            try {
                multipartFile.transferTo(new File(filePath));
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
            json.put("imageUrl", filePath);
            if (logger.isDebugEnabled()) {
                logger.debug("filePath = {}", filePath);
            }
        }
        return success(json);
    }
}
