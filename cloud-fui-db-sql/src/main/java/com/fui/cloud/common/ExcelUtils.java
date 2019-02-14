package com.fui.cloud.common;

import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

public class ExcelUtils {
    private final Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    private final static long MAX_ROW = 65533L;
    private final static int SHEET_LIMIT_ROW = 65533;
    /**
     * 是否设置信息标题栏边框,默认情况不设置边框
     */
    private boolean titleCellBold = false;
    /**
     * 是否设置空白栏边框，默认情况不设置边框
     */
    private static final boolean blankCellBold = false;
    /**
     * 输出的起始行,默认为-1,不输出
     */
    private int startRow = -1;
    /**
     * 默认字体大小
     */
    private int fontSize = 10;
    /**
     * 默认字体
     */
    private String fontName = "宋体";
    /**
     * 关键字 &-表示模版信息内容字段 #-表示模版明细内容字段
     */
    private static final String TITLE_FLAG = "&";
    private static final String CONTENT_FLAG = "#";
    private static final String FIELD_AUTO_ID = "_id";
    private static final String FORMULA_FLAG = "formula";

    private int sheetIndex;
    private String templateDir;
    private int totalNum;

    private static ThreadLocal<ExcelUtils> curThreadLocal = new ThreadLocal<ExcelUtils>();

    public static ExcelUtils getInstance(int totalNum, String templateDir) {
        if (curThreadLocal.get() == null) {
            ExcelUtils zipExcelUtils = new ExcelUtils(totalNum, templateDir);
            curThreadLocal.set(zipExcelUtils);
            return zipExcelUtils;
        } else {
            return curThreadLocal.get();
        }
    }

    private ExcelUtils(int totalNum, String templateDir) {
        this.sheetIndex = 0;
        this.templateDir = templateDir;
        this.totalNum = totalNum;
    }

    public boolean isTitleCellBold() {
        return titleCellBold;
    }

    public void setTitleCellBold(boolean titleCellBold) {
        this.titleCellBold = titleCellBold;
    }

    /**
     * 初始化工作模版，获取模版配置起始行(start)以及对应字段填充位置(fieldNames)
     *
     * @param sheet
     */
    @SuppressWarnings("deprecation")
    private String[] initialize(HSSFSheet sheet) {
        String[] fieldNames = null;
        boolean setStart = false;
        int rows = sheet.getPhysicalNumberOfRows();
        for (int r = 0; r <= rows; r++) {
            HSSFRow row = sheet.getRow(r);
            if (row != null) {
                int cells = row.getPhysicalNumberOfCells();
                for (int c = 0; c < cells; c++) {
                    HSSFCell cell = row.getCell(c);
                    if (cell != null) {
                        String value = null;
                        if (cell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
                            value = "" + cell.getNumericCellValue();
                        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_BOOLEAN) {
                            value = "" + cell.getBooleanCellValue();
                        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA) {
                            value = cell.getCellFormula();
                        } else {
                            value = cell.getRichStringCellValue().getString();
                        }
                        if (value != null && !"".equals(value)) {
                            value = value.trim();
                            // 内容数据
                            if (value.startsWith(CONTENT_FLAG)) {
                                if (!setStart) {
                                    this.startRow = r;// 设置内容填充起始行
                                    fieldNames = new String[cells];
                                    setStart = true;
                                }
                                fieldNames[c] = value.substring(1);// 初始化内容字段
                            }
                        }
                    }
                }
            }
        }
        return fieldNames;
    }

    /**
     * 生成填充模版标题数据
     *
     * @param exportInfo
     * @param wb
     * @param sheet
     * @throws Exception
     */
    @SuppressWarnings("deprecation")
    private void generateTitleDatas(Map<String, Object> exportInfo, HSSFWorkbook wb, HSSFSheet sheet) throws Exception {
        int rows = sheet.getPhysicalNumberOfRows();
        HSSFCellStyle borderStyle = this.getBorderStyle(wb);
        HSSFCellStyle noneStyle = this.getNoneStyle(wb);
        for (int r = 0; r <= rows; r++) {
            HSSFRow row = sheet.getRow(r);
            if (row != null) {
                int cells = row.getLastCellNum();
                for (int c = 0; c < cells; c++) {
                    HSSFCell cell = row.getCell(c);
                    if (cell != null) {
                        HSSFCellStyle oldStyle = cell.getCellStyle();
                        if (cell.getCellType() == HSSFCell.CELL_TYPE_STRING) {
                            String value = cell.getRichStringCellValue().getString();
                            if (value != null) {
                                value = value.trim();
                                if (value.startsWith(TITLE_FLAG)) {
                                    value = value.substring(1);
                                    Object content = exportInfo.get(value);
                                    if (content == null)
                                        content = "";
                                    // 重建Cell，填充标题值
                                    cell = row.createCell(c);
                                    if (content instanceof Integer || content instanceof Double
                                            || content instanceof Float || content instanceof BigDecimal) {
                                        cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                                        cell.setCellValue(Double.parseDouble(content.toString()));
                                    } else {
                                        cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                                        cell.setCellValue(new HSSFRichTextString(content.toString()));
                                    }
                                    if (oldStyle != null) {
                                        cell.setCellStyle(oldStyle);
                                    } else {
                                        if (!titleCellBold) {
                                            cell.setCellStyle(noneStyle);
                                        } else {
                                            cell.setCellStyle(borderStyle);
                                        }
                                    }
                                }
                            }
                        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA) {
                            cell.setCellFormula(cell.getCellFormula());
                        }
                    }

                }
            }
        }
    }

    /**
     * 生成输出文件，默认带时间戳，不带后缀
     *
     * @param templateFilename 文件名
     * @return
     */
    private String generateOutputFile(String templateFilename) {
        String filename = templateFilename;
        if (templateFilename.lastIndexOf(".") != -1) {
            filename = templateFilename.substring(0, templateFilename.lastIndexOf("."));
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
        String datetimeString = format.format(new Date());

        filename = filename + "_" + datetimeString;
        return filename;
    }

    @SuppressWarnings("deprecation")
    public String exportZipExcel(String templateFilename, List resultData,
                                 Map<String, Object> exportInfo) throws Exception {
        if (!templateDir.endsWith(File.separator)) {
            templateDir += File.separator;
        }
        String tempDir = templateDir + "temp" + File.separator;
        File file = new File(tempDir);
        if (!file.exists()) {
            // 创建临时目录
            FileUtils.createDir(tempDir);
        }
        String suffix = "";
        String filename = templateFilename;
        if (filename.lastIndexOf(".") != -1) {
            int index = filename.lastIndexOf(".");
            filename = filename.substring(0, index);
            suffix = filename.substring(index);
        }
        String tempFilePath = templateDir + File.separator + filename
                + (StringUtils.isNotEmpty(suffix) ? suffix : ".xls");
        POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(tempFilePath));

        List<String> fileNameList = new ArrayList<>();// 用于存放生成的文件名称List
        int count = totalNum / (int) MAX_ROW;
        int num = totalNum % (int) MAX_ROW;
        if (num != 0) {
            count += 1;
        }
        // 生成excel
        for (int i = 0; i < count; i++) {
            HSSFWorkbook wb = new HSSFWorkbook(fs);
            HSSFSheet sheet = wb.getSheetAt(sheetIndex);
            String[] fieldNames = initialize(sheet);
            HSSFCellStyle borderStyle = this.getBorderStyle(wb);
            HSSFCellStyle noneStyle = this.getNoneStyle(wb);

            // 默认行号
            int autoRowId = 1;
            try {
                // 先填充标题
                if (exportInfo != null && !exportInfo.isEmpty()) {
                    this.generateTitleDatas(exportInfo, wb, sheet);
                }
                if (fieldNames != null) {
                    for (Iterator it = resultData.iterator(); it.hasNext(); autoRowId++) {
                        Object object = it.next();
                        JSONObject content = JSONObject.parseObject(JSONObject.toJSONString(object));
                        int colNamesLen = fieldNames.length;
                        for (int j = 0; j < colNamesLen; j++) {
                            String columnName = fieldNames[j];
                            Object columnValue = content.get(columnName);
                            content.put(columnName, columnValue != null ? columnValue : "");
                        }
                        HSSFRow sourceRow = sheet.getRow(startRow);
                        int rowCellCount = sourceRow.getPhysicalNumberOfCells();
                        HSSFRow row = sheet.createRow(startRow++);
                        for (int k = 0; k < rowCellCount; k++) {
                            String fieldName = fieldNames[k];
                            // 输出自动生成的行号
                            if (fieldName != null && fieldName.equals(FIELD_AUTO_ID)) {
                                HSSFCell cell = row.createCell(k);
                                cell.setCellStyle(borderStyle);
                                cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                                cell.setCellValue(autoRowId);
                                continue;
                            }

                            if (fieldName != null) {
                                HSSFCell cell = row.createCell(k);
                                if (content != null) {
                                    Object value = content.get(fieldName);
                                    if (value != null) {
                                        if (value instanceof Double || value instanceof Float
                                                || value instanceof BigDecimal) {
                                            cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                                            cell.setCellValue(Double.parseDouble(value.toString()));
                                        } else {
                                            cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                                            cell.setCellValue(new HSSFRichTextString(value.toString()));
                                        }
                                    } else {
                                        cell.setCellType(HSSFCell.CELL_TYPE_BLANK);
                                    }
                                } else {
                                    cell.setCellType(HSSFCell.CELL_TYPE_BLANK);
                                    if (!blankCellBold) {
                                        cell.setCellStyle(noneStyle);
                                    } else {
                                        cell.setCellStyle(borderStyle);
                                    }
                                }
                            } else {
                                HSSFCell sourceCell = sourceRow.getCell(k);
                                if (sourceCell != null && sourceCell.getCellType() == HSSFCell.CELL_TYPE_STRING
                                        && sourceCell.getRichStringCellValue().getString() != null
                                        && sourceCell.getRichStringCellValue().getString().toLowerCase()
                                        .startsWith(FORMULA_FLAG)) {

                                    HSSFCell cell = row.createCell(k);
                                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                                    cell.setCellValue(sourceCell.getRichStringCellValue());
                                }
                            }
                        }
                        if (autoRowId >= SHEET_LIMIT_ROW) {
                            logger.error("导出超过.xls文件单sheet页限制的最大行数( {} )，超出行数据已保存到下一个sheet页。", SHEET_LIMIT_ROW + 2);
                            break;
                        }
                        // 向下平推一行
                        if (it.hasNext()) {
                            shiftDown(sheet, startRow - 1, sheet.getLastRowNum(), 1);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("解析excel文件出错 {} ", e);
            }
            String exportExcelFileName = tempDir + generateOutputFile(templateFilename) + "_" + (i + 1) + ".xls";
            fileNameList.add(exportExcelFileName);
            FileOutputStream out = new FileOutputStream(exportExcelFileName);
            wb.write(out);
            out.flush();
            out.close();
        }
        String outZipFilePath = tempDir + generateOutputFile(templateFilename) + ".zip";
        if (count == 1) {
            outZipFilePath = fileNameList.get(0);
        } else {
            File zip = new File(outZipFilePath);// 压缩文件
            File srcFile[] = new File[fileNameList.size()];
            for (int i = 0, n = fileNameList.size(); i < n; i++) {
                srcFile[i] = new File(fileNameList.get(i));
            }
            FileUtils.ZipFiles(srcFile, zip);
        }
        // 操作完后释放当前对象
        curThreadLocal.remove();
        return outZipFilePath;
    }

    private HSSFCellStyle getBorderStyle(HSSFWorkbook wb) {
        HSSFCellStyle style = wb.createCellStyle();
        HSSFFont font = wb.createFont();
        font.setFontHeightInPoints((short) fontSize);
        font.setFontName(fontName);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private HSSFCellStyle getNoneStyle(HSSFWorkbook wb) {
        HSSFCellStyle style = wb.createCellStyle();
        HSSFFont font = wb.createFont();
        font.setFontHeightInPoints((short) fontSize);
        font.setFontName(fontName);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.NONE);
        style.setBorderLeft(BorderStyle.NONE);
        style.setBorderRight(BorderStyle.NONE);
        style.setBorderTop(BorderStyle.NONE);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /**
     * 向下平推表格，并复制格式与内容
     *
     * @param thisRow：当前行号
     * @param lastRow：最后行号
     * @param shiftCount：平推量
     */
    @SuppressWarnings("deprecation")
    private void shiftDown(HSSFSheet sheet, int thisRow, int lastRow, int shiftCount) {
        sheet.shiftRows(thisRow, lastRow, shiftCount);

        for (int z = 0; z < shiftCount; z++) {
            HSSFRow row = sheet.getRow(thisRow);
            HSSFRow oldRow = sheet.getRow(thisRow + shiftCount);
            // 将各行的行高复制
            oldRow.setHeight(row.getHeight());
            // 将各个单元格的格式复制
            for (int i = 0; i <= oldRow.getPhysicalNumberOfCells(); i++) {

                HSSFCell cell = row.createCell(i);
                HSSFCell oldCell = oldRow.getCell(i);

                if (oldCell != null) {
                    switch (oldCell.getCellType()) {
                        case HSSFCell.CELL_TYPE_STRING:
                            cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                            cell.setCellValue(oldCell.getRichStringCellValue());
                            break;
                        case HSSFCell.CELL_TYPE_NUMERIC:
                            cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                            cell.setCellValue(oldCell.getNumericCellValue());
                            break;
                        default:
                            cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                            cell.setCellValue(oldCell.getRichStringCellValue());

                    }
                    cell.setCellStyle(oldCell.getCellStyle());
                }
            }

            // 将有列跨越的复制
            Vector<CellRangeAddress> regs = findRegion(sheet, oldRow);
            if (regs.size() != 0) {
                for (int i = 0; i < regs.size(); i++) {
                    CellRangeAddress reg = regs.get(i);
                    reg.setFirstRow(row.getRowNum());
                    reg.setLastRow(row.getRowNum());
                    sheet.addMergedRegion(reg);
                }
            }
            thisRow++;
        }
    }

    /**
     * 查找所有的合并单元格
     *
     * @param oldRow
     * @return
     */
    private Vector<CellRangeAddress> findRegion(HSSFSheet sheet, HSSFRow oldRow) {
        Vector<CellRangeAddress> regs = new Vector<CellRangeAddress>();
        int num = sheet.getNumMergedRegions();
        int curRowId = oldRow.getRowNum();
        for (int i = 0; i < num; i++) {
            CellRangeAddress reg = sheet.getMergedRegion(i);
            if (reg.getFirstRow() == reg.getLastRow() && reg.getFirstRow() == curRowId) {
                regs.add(reg);
            }
        }
        return regs;
    }
}