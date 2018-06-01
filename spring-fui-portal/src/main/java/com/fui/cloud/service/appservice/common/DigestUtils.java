package com.fui.cloud.service.appservice.common;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

import javax.crypto.*;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.*;
import java.security.spec.InvalidKeySpecException;

/**
 * @Title 秘钥工具类
 * @Author sf.xiong on 2017/08/04.
 */
public class DigestUtils {
    public static final String ALGORITHM_MD5 = "md5";
    public static final String ALGORITHM_SHA = "sha";
    public static final String ALGORITHM_DES = "DES";
    public static final String ALGORITHM_AES = "aes";

    /**
     * MD5加密
     *
     * @param source 明文
     * @return 密文
     * @throws IOException
     */
    public static String md5(String source) throws IOException {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance(ALGORITHM_MD5);
        } catch (NoSuchAlgorithmException e) {
            throw new IOException(e);
        }
        digest.reset();
        digest.update(source.getBytes(Charset.forName("UTF-8")));
        byte[] bytes = digest.digest();
        return new String(Hex.encodeHex(bytes));
    }

    /**
     * SHA加密
     *
     * @param source 明文
     * @return 密文
     * @throws NoSuchAlgorithmException
     */
    public static String sha(String source) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance(ALGORITHM_SHA);
        digest.reset();
        digest.update(source.getBytes());
        byte[] bytes = digest.digest();
        return new String(Hex.encodeHex(bytes));
    }

    /**
     * base64编码
     *
     * @param source 明文
     * @return 密文
     */
    public static String base64Encode(String source) {
        if (source == null) {
            return null;
        }
        return Base64.encodeBase64String(source.getBytes(Charset.forName("UTF-8")));
    }

    public static String base64Encode(String source, String charset) {
        if (source == null) {
            return null;
        }
        return Base64.encodeBase64String(source.getBytes(Charset.forName(charset)));
    }

    /**
     * base64解码
     *
     * @param target 密文
     * @return 明文
     */
    public static String base64Decode(String target) {
        if (target == null) {
            return null;
        }
        byte[] bytes = Base64.decodeBase64(target.getBytes(Charset.forName("UTF-8")));
        return new String(bytes, Charset.forName("UTF-8"));
    }

    public static String base64Decode(String target, String charset) {
        if (target == null) {
            return null;
        }
        byte[] bytes = Base64.decodeBase64(target.getBytes(Charset.forName(charset)));
        return new String(bytes, Charset.forName(charset));
    }

    /**
     * des加密
     *
     * @param key    密钥
     * @param source 明文
     * @return 密文
     * @throws InvalidKeyException          异常
     * @throws InvalidKeySpecException 异常
     * @throws NoSuchAlgorithmException     异常
     * @throws NoSuchPaddingException        异常
     * @throws IllegalBlockSizeException     异常
     * @throws BadPaddingException           异常
     */
    public static String desEncrypt(String key, String source) throws InvalidKeyException, InvalidKeySpecException
            , NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
        Key secretKey = generateKey(key, ALGORITHM_DES);
        Cipher cipher = Cipher.getInstance(ALGORITHM_DES);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return Base64.encodeBase64String(cipher.doFinal(source.getBytes()));
    }

    /**
     * des解密
     *
     * @param key    密钥
     * @param target 密文
     * @return 明文
     * @throws InvalidKeyException          异常
     * @throws InvalidKeySpecException 异常
     * @throws NoSuchAlgorithmException     异常
     * @throws NoSuchPaddingException        异常
     * @throws IllegalBlockSizeException     异常
     * @throws BadPaddingException           异常
     */
    public static byte[] desDecrypt(String key, String target) throws InvalidKeyException, InvalidKeySpecException,
            NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
        Key secretKey = generateKey(key, ALGORITHM_DES);
        Cipher cipher = Cipher.getInstance(ALGORITHM_DES);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        return cipher.doFinal(Base64.decodeBase64(target));
    }

    /**
     * 生成key
     *
     * @param key       密钥字符串
     * @param algorithm 加解密算法
     * @return 密钥
     * @throws InvalidKeyException          异常
     * @throws NoSuchAlgorithmException     异常
     * @throws InvalidKeySpecException 异常
     */
    private static Key generateKey(String key, String algorithm) throws InvalidKeyException,
            NoSuchAlgorithmException, InvalidKeySpecException {
        if (ALGORITHM_DES.equals(algorithm)) {
            DESKeySpec keySpec = new DESKeySpec(Base64.decodeBase64(key));
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(ALGORITHM_DES);

            return keyFactory.generateSecret(keySpec);
        } else {
            return new SecretKeySpec(Base64.decodeBase64(key), algorithm);
        }
    }

    /**
     * 生成密钥
     *
     * @param seed 种子
     * @return 密钥
     * @throws Exception 异常
     */
    public static String initKey(String seed) throws Exception {
        SecureRandom secureRandom;

        if (seed != null) {
            secureRandom = new SecureRandom(base64Decode(seed).getBytes());
        } else {
            secureRandom = new SecureRandom();
        }

        KeyGenerator kg = KeyGenerator.getInstance(ALGORITHM_DES);
        kg.init(secureRandom);

        SecretKey secretKey = kg.generateKey();

        return Base64.encodeBase64String(secretKey.getEncoded());
    }
}
