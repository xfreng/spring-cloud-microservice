package com.fui.cloud.service.appservice.common;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

/**
 * @Title 3DES加解密(base64)
 * @Author sf.xiong on 2017/08/04.
 */
public class DES3EncryptAndEdcrypt {

    private static final String ALGORITHM = "DESede";
    private static final String DES3_KEY = "A1B2C3D4E5F6G7H8I9J0K1L2";

    /**
     * 数据加密
     *
     * @param src 明文
     * @return 密文
     * @throws Exception
     */
    public static String DES3EncryptMode(String src) throws Exception {
        Cipher cipher = getCipher(Cipher.ENCRYPT_MODE);
        return new String(Base64.encodeBase64(cipher.doFinal(src.getBytes("UTF-8"))));
    }

    /**
     * 数据解密
     *
     * @param src 密文
     * @return 明文
     * @throws Exception
     */
    public static String DES3DecryptMode(String src) throws Exception {
        Cipher cipher = getCipher(Cipher.DECRYPT_MODE);
        byte[] dd = cipher.doFinal(Base64.decodeBase64(src.getBytes("UTF-8")));
        return new String(dd, "UTF-8");
    }

    private static Cipher getCipher(int encryptMode) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        DESedeKeySpec desKeySpec = new DESedeKeySpec(DES3_KEY.getBytes());
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(ALGORITHM);
        SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
        cipher.init(encryptMode, secretKey);
        return cipher;
    }
}
