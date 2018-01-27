package com.fui.cloud.common;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @Title 随机码生成器
 */
public class RandomCodeUtils {

    private static final char[] HEX_CHARS = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f'};

    private static final String NUM_STR = "0123456789";
    private static final String NUM_CHAR_STR = "0123456789abcdefghijkmnpqrstuvwxyz";

    /**
     * 创建指定长度的随机字符串
     *
     * @param numberFlag 是否是数字
     * @param length     字符串长度
     * @return 随机码
     */
    public static String createRandom(boolean numberFlag, int length) {
        StringBuilder retStr = new StringBuilder();
        String strTable = numberFlag ? NUM_STR : NUM_CHAR_STR;
        int len = strTable.length();
        boolean bDone = true;
        do {
            int count = 0;
            for (int i = 0; i < length; i++) {
                double dblR = Math.random() * len;
                int intR = (int) Math.floor(dblR);
                char c = strTable.charAt(intR);
                if (('0' <= c) && (c <= '9')) {
                    count++;
                }
                retStr.append(c);
            }
            if (count >= 2) {
                bDone = false;
            }
        } while (bDone);
        return retStr.toString();
    }

    public static String generateId(String healthUrl) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] bytes = digest.digest(healthUrl.getBytes(StandardCharsets.UTF_8));
            return new String(encodeHex(bytes, 0, 8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private static char[] encodeHex(byte[] bytes, int offset, int length) {
        char chars[] = new char[length];
        for (int i = 0; i < length; i = i + 2) {
            byte b = bytes[offset + (i / 2)];
            chars[i] = HEX_CHARS[(b >>> 0x4) & 0xf];
            chars[i + 1] = HEX_CHARS[b & 0xf];
        }
        return chars;
    }
}