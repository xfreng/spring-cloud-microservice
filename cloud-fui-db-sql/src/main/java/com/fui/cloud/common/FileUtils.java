package com.fui.cloud.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileUtils {
    private static final Logger logger = LoggerFactory.getLogger(FileUtils.class);

    /**
     * 创建文件目录
     *
     * @param path
     */
    public static void createDir(String path) {
        File file = new File(path);
        if (!file.isDirectory()) {
            file.mkdirs();
        }
    }

    /**
     * 将多个文件压缩成文件包
     *
     * @param srcFile 文件名数组
     * @param zipFile 压缩后文件
     */
    public static void ZipFiles(File[] srcFile, File zipFile) {
        byte[] buf = new byte[1024];
        try {
            ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
            for (int i = 0, count = srcFile.length; i < count; i++) {
                File sourceFile = srcFile[i];
                InputStream in = new FileInputStream(sourceFile);
                out.putNextEntry(new ZipEntry(sourceFile.getName()));
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
                out.closeEntry();
                in.close();
            }
            out.close();
            // 删除打包源文件
            for (int i = 0, count = srcFile.length; i < count; i++) {
                File sourceFile = srcFile[i];
                sourceFile.delete();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 下载文件
     *
     * @param response
     * @param filePath 文件路径
     * @param fileName 导出文件名称
     * @throws IOException
     */
    public static void exportFile(HttpServletResponse response, String fileType, String filePath, String fileName)
            throws IOException {
        response.setHeader("Content-Disposition",
                "attachment; filename=" + URLEncoder.encode(fileName, "utf-8"));
        InputStream in = null;
        try {
            if (StringUtils.isNotEmpty(fileType)) {
                response.setContentType(fileType);
                in = new BufferedInputStream(new FileInputStream(filePath));
                int len;
                byte[] buffer = new byte[1024];
                OutputStream out = response.getOutputStream();
                while ((len = in.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
            } else {
                response.setContentType("multipart/form-data;charset=GBK");
                response.setCharacterEncoding("GBK");
                in = new FileInputStream(filePath);
                int len;
                byte[] buffer = new byte[1024];
                OutputStream out = response.getOutputStream();
                while ((len = in.read(buffer)) > 0) {
                    out.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
                    out.write(buffer, 0, len);
                }
            }
        } catch (FileNotFoundException e) {
            logger.error(e.getMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    /**
     * 删除单个文件
     *
     * @param filePath 文件目录路径
     * @param fileName 文件名称
     */
    public static void deleteFile(String filePath, String fileName) {
        File file = new File(filePath);
        if (file.exists()) {
            File[] files = file.listFiles();
            for (int i = 0; i < files.length; i++) {
                if (files[i].isFile()) {
                    if (files[i].getName().equals(fileName)) {
                        files[i].delete();
                        return;
                    }
                }
            }
        }
    }
}