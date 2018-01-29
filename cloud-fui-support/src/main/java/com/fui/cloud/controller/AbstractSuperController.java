package com.fui.cloud.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.GsonUtils;
import com.fui.cloud.common.StringUtils;
import com.fui.cloud.fastdfs.FastDfsUtils;
import com.fui.cloud.service.menu.MenuService;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class AbstractSuperController {
    protected static Logger logger = LoggerFactory.getLogger(AbstractSuperController.class);

    @Autowired
    protected HttpServletRequest request;

    @Autowired
    private FastDfsUtils fastDfsUtils;

    @Autowired
    private MenuService menuService;

    /**
     * 页面公用变量设置
     *
     * @param mv
     * @return 跳转到指定页面
     */
    protected ModelAndView init(ModelAndView mv) throws Exception {
        String servletPath = request.getServletPath();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("nodeUrl", servletPath);
        List<Map<String, Object>> menuList = menuService.queryMenuNodeBySelective(params);
        if (menuList != null && menuList.size() > 0 && menuList.size() == 1) {
            Map<String, Object> menu = menuList.get(0);
            mv.addObject("efFormEname", menu.get("id"));
            mv.addObject("efFormCname", menu.get("text"));
        }
        return mv;
    }

    /**
     * json对象处理
     *
     * @param target 数据对象
     * @return 数据集对象的json
     */
    protected String success(Object target) {
        return target instanceof List ? JSONArray.toJSONString(target) : GsonUtils.toJson(target);
    }

    /**
     * json对象处理
     *
     * @param list 数据集
     * @param key  json对应的key
     * @return 数据集对象的json
     */
    protected String success(Collection list, String key) {
        return success(list, 0L, key);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @return 页面分页展示的json
     */
    protected String success(Collection list, Long totalResult) {
        return success(list, totalResult, CommonConstants.PAGE_KEY_NAME);
    }

    /**
     * 分页处理
     *
     * @param list        分页查询结果
     * @param totalResult 总条数
     * @param key         json对应的key
     * @return 分页展示的json
     */
    protected String success(Collection list, Long totalResult, String key) {
        JSONObject target = new JSONObject();
        if (totalResult.intValue() != 0) {
            target.put(CommonConstants.PAGE_TOTAL, totalResult);
        }
        if (StringUtils.isNotEmpty(key)) {
            target.put(key, list);
        }
        return target.toJSONString();
    }

    /**
     * 根据上传文件标识,处理上传文件
     *
     * @param file 上传文件
     * @return 返回保存文件的相对路径
     */
    protected String fileHandleFastDfs(MultipartFile file) {
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
            logger.error("{} file upload 异常 = {}", e.getMessage());
        }

        return fileUrl;
    }

    /**
     * 根据上传文件标识,处理上传文件
     *
     * @param file 上传文件
     * @return 返回保存文件的相对路径
     */
    private String fileHandleFastDfs(File file) {
        //文件扩展名
        String fileExtName = getFileExtName(file.getName());
        //原文件名
        String originName = file.getName();
        //上传后的文件URL
        String fileUrl = "";

        JSONObject result = fastDfsUtils.uploadFastDfs("", file, fileExtName, originName);
        if (result.getInteger("error") != null && 0 == result.getInteger("error")) {
            fileUrl = result.getString("url");
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

    /**
     * 上传文件服务器前先压缩图片
     *
     * @param multipartFile
     * @return filePath
     */
    protected String reduceImage(MultipartFile multipartFile) {
        String tempDir = System.getProperty("user.dir") + File.separator;
        logger.info("压缩临时文件目录：{}", tempDir);
        File file = new File(tempDir + multipartFile.getOriginalFilename());
        try {
            multipartFile.transferTo(file);
            Thumbnails.of(tempDir + multipartFile.getOriginalFilename())
                    .scale(1f)
                    .outputQuality(0.5f)
                    .toFile(tempDir + multipartFile.getOriginalFilename());
        } catch (IOException e) {
            logger.error("图片压缩失败 {}", e);
        }
        File uploadFile = new File(tempDir + multipartFile.getOriginalFilename());
        String filePathStr = fileHandleFastDfs(uploadFile);
        if (org.apache.commons.lang.StringUtils.isNotBlank(filePathStr)) {
            uploadFile.delete();//删除临时压缩后的文件
        }
        return filePathStr;
    }
}