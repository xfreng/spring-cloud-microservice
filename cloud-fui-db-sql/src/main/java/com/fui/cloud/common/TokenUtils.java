package com.fui.cloud.common;

import com.alibaba.fastjson.JSONObject;
import com.fui.cloud.model.ManageToken;
import com.fui.cloud.model.fui.Users;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Token操作相关类
 */
@Component
public class TokenUtils {
    private final static String manageKey = "jcoffee*789";
    private final static Integer manageTokenTime = 1200000;
    private static Map<String, ManageToken> manageTokenMap = new HashMap<String, ManageToken>();

    /**
     * 生成登录token
     *
     * @param user
     * @return
     */
    public ManageToken toManageToken(Users user) {
        Long userId = user.getId();
        String passwordVersion = user.getPassword();
        //根据用户ID，密码跟版本号生成密匙（不修改密码的前提下密匙不会改变）
        String secretKey = generaSecretKey(userId.toString(), passwordVersion, manageKey);
        //根据相关信息、时间轴及随机数生成动态的token
        String token = generaToken(userId.toString(), secretKey, manageKey, "pc");
        ManageToken manageToken = new ManageToken();
        manageToken.setUser(user);
        manageToken.setSecretKey(secretKey);
        manageToken.setToken(token);
        manageToken.setUploadTime(DateUtils.curDateStr19());
        manageTokenMap.put(userId.toString(), manageToken);
        return manageToken;
    }

    /**
     * 验证后台token
     *
     * @param manageToken
     * @return 验证结果
     */
    public JSONObject checkManageToken(ManageToken manageToken) {
        JSONObject result = new JSONObject();
        if (manageToken == null) {
            result.put("status", -1);
            result.put("message", "用户未登陆");
            return result;
        }

        String userId = null;
        if (manageToken.getUser() != null) {
            userId = manageToken.getUser().getId().toString();
        }

        String token = manageToken.getToken();
        ManageToken manageTokenVoFMap = manageTokenMap.get(userId);
        if (manageTokenVoFMap == null) {
            result.put("status", 3);
            result.put("message", "登陆失效，请重新登陆，请重新登录(403)");
            return result;
        }

        if (!manageTokenVoFMap.getSecretKey().equals(manageToken.getSecretKey())) {
            result.put("status", 4);
            result.put("message", "密码已修改，请重新登录(304)");
            return result;
        }

        String userMapTokenTime = manageTokenVoFMap.getUploadTime();
        Date userMapTokenTimeToDate = DateUtils.toDate(userMapTokenTime, CommonConstants.PARTTERN_YYYY_MM_DD_HH_MM_SS);
        if ((System.currentTimeMillis() - userMapTokenTimeToDate.getTime()) <= manageTokenTime) {
            if (manageTokenVoFMap.getToken().equals(token)) {
                result.put("status", 1);
                result.put("message", "验证通过");
                manageTokenVoFMap.setUploadTime(DateUtils.curDateStr19());
                manageTokenMap.put(userId, manageTokenVoFMap);
            } else {
                result.put("status", 3);
                result.put("message", "验证失败，请重新登录(103)");
            }
        } else {
            if (manageTokenVoFMap.getToken().equals(token)) {
                result.put("status", 2);
                result.put("message", "token超时，请重新登录(102)");

            } else {
                result.put("status", 3);
                result.put("message", "验证失败，请重新登录(203)");
            }
        }
        return result;
    }

    /**
     * 生成密匙
     *
     * @return
     */
    public String generaSecretKey(String userId, String passwordVersion, String key) {
        return MD5Utils.encodeByMD5(userId + passwordVersion + key);
    }

    /**
     * 生成Token
     *
     * @return
     */
    public String generaToken(String userId, String secretKey, String key, String uuid) {
        String timeStr = String.valueOf(System.currentTimeMillis());
        String randomNum = String.valueOf(new Random().nextInt(99999));
        return MD5Utils.encodeByMD5(userId + secretKey + timeStr + randomNum + key + uuid);
    }

}
