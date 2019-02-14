package com.fui.cloud.controller;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.common.CommonConstants;
import com.fui.cloud.common.RateLimiter;
import com.fui.cloud.common.StringUtils;
import com.fui.cloud.fastdfs.FastDfsUtils;
import com.fui.cloud.model.fui.Menus;
import com.fui.cloud.service.fui.menu.MenuService;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public abstract class AbstractSuperController {
    protected Logger logger = LoggerFactory.getLogger(getClass());

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
    protected ModelAndView init(ModelAndView mv) {
        String servletPath = request.getServletPath();
        Map<String, Object> params = new HashMap<>();
        params.put("nodeUrl", servletPath);
        List menuList = JSONObject.parseObject(menuService.queryMenuNodeBySelective(1, 1000, params)).getJSONArray("treeNodes");
        if (menuList != null && menuList.size() > 0 && menuList.size() == 1) {
            Menus menu = JSONObject.parseObject(JSONObject.toJSONString(menuList.get(0)), Menus.class);
            mv.addObject("efFormEname", menu.getId());
            mv.addObject("efFormCname", menu.getText());
        }
        return mv;
    }

    /**
     * 处理上传文件
     *
     * @param file 上传文件
     * @return 返回保存文件的相对路径
     */
    protected String fileHandleFastDfs(MultipartFile file) {
        //上传后的文件URL
        String fileUrl = "";
        if (StringUtils.isNullOrEmpty(file.getOriginalFilename())) {
            return fileUrl;
        }
        //文件扩展名
        String fileExtName = getFileExtName(file.getOriginalFilename());
        //原文件名
        String originName = file.getOriginalFilename();
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
     * 处理上传文件
     *
     * @param bytes 上传文件
     * @return 返回保存文件的相对路径
     */
    private String fileHandleFastDfs(byte[] bytes, long fileSize, String fileExtName, String originName) {
        //上传后的文件URL
        String fileUrl = "";

        JSONObject result = fastDfsUtils.uploadFastDfs("", bytes, fileSize, fileExtName, originName);
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
        StringBuilder filePathStr = new StringBuilder();
        long fileSize = multipartFile.getSize();
        if (CommonConstants.FILE_LIMIT_SIZE <= fileSize) {
            String tempDir = System.getProperty("user.home") + File.separator;
            String targetFilePath = tempDir + multipartFile.getOriginalFilename();
            logger.info("压缩临时文件目录：{}", targetFilePath);
            File file = new File(targetFilePath);
            //文件扩展名
            String fileExtName = getFileExtName(file.getName());
            //原文件名
            String originName = file.getName();
            try {
                multipartFile.transferTo(file);
                BufferedImage image = Thumbnails.of(file)
                        .scale(CommonConstants.SCALE)
                        .outputQuality(CommonConstants.OUTPUT_QUALITY)
                        .asBufferedImage();
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                ImageIO.write(image, getFileExtName(file.getName()), os);
                filePathStr.append(fileHandleFastDfs(os.toByteArray(), os.size(), fileExtName, originName));
                os.close();
            } catch (IOException e) {
                logger.error("图片压缩失败 {}", e);
            }
        } else {
            filePathStr.append(fileHandleFastDfs(multipartFile));
        }
        return filePathStr.toString();
    }

    /**
     * 非开发环境下；设置频繁操作限制 1分钟只能操作一次
     *
     * @param key
     * @param rateLimiterCache
     * @return boolean
     */
    public boolean exceedsRateLimit(String key, LoadingCache<String, RateLimiter> rateLimiterCache) {
        return exceedsRateLimit(key, rateLimiterCache, 60000, 1);
    }

    /**
     * 频度操作控制 基于本地缓存
     *
     * @param id               key值
     * @param rateLimiterCache 缓存对象
     * @param timeSpan         时间秒为单位
     * @param times            次数
     * @return boolean
     */
    public boolean exceedsRateLimit(String id, LoadingCache<String, RateLimiter> rateLimiterCache, int timeSpan, int times) {
        RateLimiter rl = null;
        try {
            rl = rateLimiterCache.get(id);
        } catch (Exception e) {
            logger.warn("根据 ID = {} 没有获取到访问频次信息；", id, e.getMessage());
        }
        if (rl == null) {
            rl = new RateLimiter(timeSpan, times);//一分钟内最多访问10次
            rl.getEvictingQueue().add(System.currentTimeMillis());
            rateLimiterCache.put(id, rl);
            return false;
        }
        Assert.isNull(rl.getEvictingQueue(), "rl.getEvictingQueue() is null.");
        long oldestRequestTime = rl.getEvictingQueue().peek();
        long nowTimeSpan = System.currentTimeMillis();
        boolean exceeded = nowTimeSpan - oldestRequestTime < rl.getTimeSpan()
                && rl.getEvictingQueue().size() == rl.getMaxRequests();
        if (!exceeded) {
            rl.getEvictingQueue().add(System.currentTimeMillis());
            rateLimiterCache.put(id, rl);
        }
        return exceeded;
    }

    @Bean
    public LoadingCache<String, RateLimiter> timeLimiterCache() {
        return CacheBuilder.newBuilder()
                .expireAfterAccess(30, TimeUnit.MINUTES) // cache will expire after 30 minutes of access
                .build(new CacheLoader<String, RateLimiter>() { // build the cacheloader
                    @Override
                    public RateLimiter load(String key) throws Exception {
                        if (logger.isDebugEnabled()) {
                            logger.debug("params empId value is:{}", key);
                        }
                        return null;
                    }
                });
    }
}