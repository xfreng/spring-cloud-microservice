package com.fui.cloud.core.ei;

import com.fui.cloud.core.BaseObject;
import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EiBlock extends BaseObject {
    private static final Logger logger = LoggerFactory.getLogger(EiBlock.class);
    private static final long serialVersionUID = 9011789204436838197L;
    private EiBlockMeta blockMeta;
    private List rows = new ArrayList();

    public EiBlock(String blockId) {
        this.blockMeta = new EiBlockMeta(blockId);
    }

    public EiBlock(EiBlockMeta meta) {
        this.blockMeta = meta;
    }

    public EiBlockMeta getBlockMeta() {
        return this.blockMeta;
    }

    public void setBlockMeta(EiBlockMeta blockMeta) {
        EiBlockMeta newblockMeta = (EiBlockMeta) blockMeta.deepClone();
        if (this.blockMeta != null) {
            String blockId = this.blockMeta.getBlockId();
            if (blockId != null && !blockId.equals("")) {
                newblockMeta.setBlockId(blockId);
            }
        }

        this.blockMeta = newblockMeta;
    }

    public void addBlockMeta(EiBlockMeta blockMeta) {
        if (this.blockMeta == null) {
            this.setBlockMeta(blockMeta);
        }

        this.blockMeta.addMetas(blockMeta);
    }

    public List getRows() {
        return this.rows;
    }

    public void setRows(List rows) {
        if (this.rows.size() > 0) {
            this.rows.clear();
        }

        if (rows != null) {
            for (int i = 0; i < rows.size(); ++i) {
                Object obj = rows.get(i);
                if (obj instanceof Map) {
                    this.addRow((Map) obj);
                } else {
                    try {
                        this.addRow(BeanUtils.describe(obj));
                    } catch (Exception var5) {
                        if (logger.isDebugEnabled()) {
                            logger.debug("addRow(List) - e=" + var5);
                        }
                    }
                }
            }

        }
    }

    public void addRows(List rows) {
        if (rows != null) {
            for (int i = 0; i < rows.size(); ++i) {
                Object obj = rows.get(i);
                if (obj instanceof Map) {
                    this.addRow((Map) obj);
                } else {
                    try {
                        this.addRow(BeanUtils.describe(obj));
                    } catch (Exception var5) {
                        if (logger.isDebugEnabled()) {
                            logger.debug("addRow(List) - e=" + var5);
                        }
                    }
                }
            }

        }
    }

    public void addRow(Map row) {
        this.rows.add(row);
    }

    public void addRow(Object obj) {
        if (obj != null) {
            if (obj instanceof Map) {
                this.addRow((Map) obj);
            } else {
                try {
                    this.addRow(BeanUtils.describe(obj));
                } catch (Exception var3) {
                    if (logger.isDebugEnabled()) {
                        logger.debug("addRow(obj) - e=" + var3);
                    }
                }
            }

        }
    }

    public void addRow() {
        this.rows.add(new HashMap());
    }

    public void addRow(int count) {
        for (int i = 0; i < count; ++i) {
            this.addRow();
        }

    }

    public int getRowCount() {
        return this.rows.size();
    }

    public Map getRow(int rowNo) {
        return rowNo < this.rows.size() && rowNo >= 0 ? (Map) this.rows.get(rowNo) : null;
    }

    public Object getCell(int rowNo, String columnName) {
        return rowNo < this.rows.size() && rowNo >= 0 ? this.getRow(rowNo).get(columnName) : null;
    }

    public String getCellStr(int rowNo, String columnName) {
        if (rowNo < this.rows.size() && rowNo >= 0) {
            Object cellObj = this.getRow(rowNo).get(columnName);
            return cellObj != null ? cellObj.toString() : null;
        } else {
            return null;
        }
    }

    public List getCol(String columnName) {
        if (columnName != null && this.rows.size() > 0) {
            List returnList = new ArrayList();

            for (int i = 0; i < this.rows.size(); ++i) {
                returnList.add(((HashMap) this.rows.get(i)).get(columnName));
            }

            return returnList;
        } else {
            return null;
        }
    }

    public void setCell(int rowNo, String columnName, Object columnValue) {
        if (rowNo >= this.rows.size()) {
            this.addRow(rowNo - this.rows.size() + 1);
        }

        if (columnValue != null && columnValue instanceof String) {
            columnValue = ((String) columnValue).replaceAll("¶¶", "\r\n");
        }

        ((Map) this.rows.get(rowNo)).put(columnName, columnValue);
    }

    public void addMeta(EiColumn meta) {
        if (meta != null) {
            if (this.blockMeta == null) {
                this.blockMeta = new EiBlockMeta();
            }

            this.blockMeta.addMeta(meta);
        }
    }

    public void removeMeta(EiColumn meta) {
        if (meta != null && this.blockMeta != null) {
            this.blockMeta.removeMeta(meta);
        }
    }

    public void removeMeta(String metaName) {
        if (this.blockMeta != null) {
            this.blockMeta.removeMeta(metaName);
        }
    }

    public void removeCol(String colName) {
        if (colName != null && this.rows.size() > 0) {
            for (int i = 0; i < this.rows.size(); ++i) {
                ((HashMap) this.rows.get(i)).remove(colName);
            }

        }
    }

    public Object clone() {
        EiBlock newBlock = new EiBlock("clone");
        newBlock.blockMeta = this.blockMeta;
        newBlock.rows = this.rows;
        return newBlock;
    }

    public Object deepClone() {
        EiBlock newBlock = (EiBlock) super.deepClone();
        newBlock.blockMeta = (EiBlockMeta) this.blockMeta.clone();
        newBlock.rows = (ArrayList) ((ArrayList) this.rows).clone();
        return newBlock;
    }
}

