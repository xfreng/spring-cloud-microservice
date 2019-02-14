package com.fui.cloud.core.ei;

import com.fui.cloud.core.BaseObject;
import com.fui.cloud.core.LangUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EiInfo extends BaseObject {
    private static final long serialVersionUID = -2486717908846610128L;
    private static final Logger logger = LoggerFactory.getLogger(EiInfo.class);
    private String name;
    private String descName;
    private String msg = "";
    private String msgKey = "";
    private String detailMsg = "";
    private Map blocks = new HashMap();
    private int status = 0;

    public EiInfo() {
    }

    public EiInfo(String name) {
        this.name = name;
    }

    public Map getBlocks() {
        return this.blocks;
    }

    public void setBlocks(Map blocks) {
        if (blocks != null) {
            this.blocks = blocks;
        }
    }

    public EiBlock getBlock(String blockId) {
        Object obj = this.blocks.get(blockId);
        return obj != null ? (EiBlock) obj : null;
    }

    public EiBlock getDefBlock() {
        return (EiBlock) this.blocks.get(this.name);
    }

    public EiBlock addBlock(String blockId) {
        if (blockId == null) {
            return null;
        } else if (this.blocks.get(blockId) == null) {
            EiBlock eiBlock = new EiBlock(blockId);
            this.blocks.put(blockId, eiBlock);
            return eiBlock;
        } else {
            return (EiBlock) this.blocks.get(blockId);
        }
    }

    public EiBlock setBlock(EiBlock eiBlock) {
        if (eiBlock != null) {
            this.blocks.put(eiBlock.getBlockMeta().getBlockId(), eiBlock);
        }

        return eiBlock;
    }

    public EiBlock addBlock(EiBlock eiBlock) {
        if (eiBlock == null) {
            return null;
        } else {
            if (this.getBlock(eiBlock.getBlockMeta().getBlockId()) == null) {
                this.blocks.put(eiBlock.getBlockMeta().getBlockId(), eiBlock);
            }

            return eiBlock;
        }
    }

    public void setCell(String blockId, int rowNo, String columnName, Object columnValue) {
        if (blockId != null && columnName != null) {
            if (this.getBlock(blockId) == null) {
                this.addBlock(blockId);
            }

            this.getBlock(blockId).setCell(rowNo, columnName, columnValue);
        }
    }

    public void addRow(String blockId, Map row) {
        if (blockId != null && row != null) {
            if (this.getBlock(blockId) == null) {
                this.addBlock(blockId);
            }

            this.getBlock(blockId).addRow(row);
        }
    }

    public void addRows(String blockId, List rows) {
        if (blockId != null && rows != null) {
            if (this.getBlock(blockId) == null) {
                this.addBlock(blockId);
            }

            this.getBlock(blockId).addRows(rows);
        }
    }

    public void setRows(String blockId, List rows) {
        if (blockId != null) {
            if (this.getBlock(blockId) == null) {
                this.addBlock(blockId);
            }

            this.getBlock(blockId).setRows(rows);
        }
    }

    public Object getCell(String blockId, int rowNo, String columnName) {
        if (blockId != null && columnName != null) {
            return this.getBlock(blockId) == null ? null : this.getBlock(blockId).getCell(rowNo, columnName);
        } else {
            return null;
        }
    }

    public String getCellStr(String blockId, int rowNo, String columnName) {
        if (blockId != null && columnName != null) {
            return this.getBlock(blockId) == null ? null : this.getBlock(blockId).getCellStr(rowNo, columnName);
        } else {
            return null;
        }
    }

    public List getCol(String blockId, String columnName) {
        if (blockId != null && columnName != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock == null) {
                return null;
            } else {
                List returnList = new ArrayList();

                for (int i = 0; i < eiBlock.getRowCount(); ++i) {
                    returnList.add(eiBlock.getCell(i, columnName));
                }

                return returnList;
            }
        } else {
            return null;
        }
    }

    public Map getRow(String blockId, int rowNo) {
        if (blockId == null) {
            return null;
        } else {
            return this.getBlock(blockId) == null ? null : this.getBlock(blockId).getRow(rowNo);
        }
    }

    public String getBlockInfoValue(String blockId, String propName) {
        if (blockId != null && propName != null) {
            return this.getBlock(blockId) == null ? null : this.getBlock(blockId).getString(propName);
        } else {
            return null;
        }
    }

    public void setBlockInfoValue(String blockId, String propName, String value) {
        if (blockId != null && propName != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock != null) {
                eiBlock.set(propName, value);
            }
        }
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescName() {
        return this.descName;
    }

    public void setDescName(String descName) {
        this.descName = descName;
    }

    public void set(String key, Object value) {
        if (key != null) {
            String[] s_key = key.split(EiConstant.separator);
            String blockId;
            if (s_key.length == 3) {
                blockId = s_key[0];

                int rowNo;
                try {
                    rowNo = Integer.parseInt(s_key[1]);
                } catch (Exception var7) {
                    logger.error("错误的数字格式\n" + var7);
                    return;
                }

                String columnName = s_key[2].trim();
                this.addBlock(blockId);
                this.setCell(blockId, rowNo, columnName, value);
            } else if (s_key.length == 2) {
                blockId = s_key[0];
                this.addBlock(blockId).set(s_key[1].trim(), value);
            } else {
                super.set(key, value);
            }
        }

    }

    public Object get(String key) {
        if (StringUtils.isEmpty(key)) {
            return null;
        } else {
            String[] s_key = key.split(EiConstant.separator);
            if (s_key.length == 3) {
                String blockId = s_key[0];

                int rowNo;
                try {
                    rowNo = Integer.parseInt(s_key[1]);
                } catch (Exception var6) {
                    logger.error("错误的数字格式\n" + var6);
                    return null;
                }

                String columnName = s_key[2].trim();
                return this.getCell(blockId, rowNo, columnName);
            } else if (s_key.length == 2) {
                EiBlock eiBlock = this.getBlock(s_key[0]);
                return eiBlock != null ? eiBlock.get(s_key[1].trim()) : null;
            } else {
                return super.get(key);
            }
        }
    }

    public String getString(String key) {
        Object _value = this.get(key);
        if (_value != null) {
            return _value.getClass().isArray() ? String.valueOf(Array.get(_value, 0)) : String.valueOf(_value);
        } else {
            return null;
        }
    }

    public int getInt(String key) {
        try {
            return Integer.parseInt(String.valueOf(this.get(key)));
        } catch (Exception var3) {
            return 0;
        }
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public void setMsgByKey(String msgKey) {
        String msgStr = "";
        String[] msgSplit = msgKey.split("\\.");
        int msgCode = Integer.parseInt(msgSplit[1]);
        if ("ep".equals(msgSplit[0])) {
            if (msgCode < 1000) {
                this.status = -1;
            } else if (msgCode < 2000) {
                this.status = 1;
            }
        }

        this.msg = msgStr;
        this.msgKey = msgKey;
    }

    public String getDisplayMsgKey() {
        return StringUtils.isEmpty(this.msgKey) ? this.msgKey : this.msgKey.replace('.', '-').toUpperCase();
    }

    public void addMsg(String msg) {
        if (msg != null && !msg.equals("")) {
            if (this.msg != null && !this.msg.equals("")) {
                this.msg = this.msg + "\n" + msg;
            } else {
                this.msg = msg;
            }

        }
    }

    public String getBlockIds() {
        return LangUtils.getMapKeys(this.blocks);
    }

    public int getStatus() {
        return this.status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDetailMsg() {
        return this.detailMsg;
    }

    public void setDetailMsg(String detailMsg) {
        this.detailMsg = detailMsg;
    }

    public void addDetailMsg(String detailMsg) {
        if (detailMsg != null && !detailMsg.equals("")) {
            if (this.detailMsg == null) {
                this.detailMsg = detailMsg;
            } else {
                this.detailMsg = this.detailMsg + "\n" + detailMsg;
            }

        }
    }

    public void addMeta(String blockId, EiColumn meta) {
        if (blockId != null && meta != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock != null) {
                eiBlock.addMeta(meta);
            }

        }
    }

    public void removeMeta(String blockId, EiColumn meta) {
        if (blockId != null && meta != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock != null) {
                eiBlock.removeMeta(meta);
            }

        }
    }

    public void removeMeta(String blockId, String metaName) {
        if (blockId != null && metaName != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock != null) {
                eiBlock.removeMeta(metaName);
            }

        }
    }

    public void removeCol(String blockId, String metaName) {
        if (blockId != null && metaName != null) {
            EiBlock eiBlock = this.getBlock(blockId);
            if (eiBlock != null) {
                eiBlock.removeCol(metaName);
            }

        }
    }

    public String getMsgKey() {
        return this.msgKey;
    }

    public void setMsgKey(String msgKey) {
        this.msgKey = msgKey;
    }

    public void setMethodParam(String key, Object value) {
        if (key != null) {
            HashMap paramMap = (HashMap) super.get(EiConstant.methodParamObj);
            if (paramMap == null) {
                paramMap = new HashMap();
                super.set(EiConstant.methodParamObj, paramMap);
            }

            paramMap.put(key, value);
        }
    }

    public Object getMethodParam(String key) {
        if (key == null) {
            return null;
        } else {
            HashMap paramMap = (HashMap) super.get(EiConstant.methodParamObj);
            return paramMap == null ? null : paramMap.get(key);
        }
    }

    public Object removeMethodParam(String key) {
        if (key == null) {
            return null;
        } else {
            HashMap paramMap = (HashMap) super.get(EiConstant.methodParamObj);
            return paramMap == null ? null : paramMap.remove(key);
        }
    }

    public void removeMethodParamObj() {
        Map attr = this.getAttr();
        if (attr != null) {
            attr.remove(EiConstant.methodParamObj);
        }

    }

    public void setMethodParamObj(HashMap paramMap) {
        super.set(EiConstant.methodParamObj, paramMap);
    }

    public HashMap getMethodParamObj() {
        return (HashMap) super.get(EiConstant.methodParamObj);
    }

    public Object deepClone() {
        EiInfo newInfo = (EiInfo) super.deepClone();
        if (this.blocks != null) {
            newInfo.blocks = (HashMap) ((HashMap) this.blocks).clone();
        }

        return newInfo;
    }
}