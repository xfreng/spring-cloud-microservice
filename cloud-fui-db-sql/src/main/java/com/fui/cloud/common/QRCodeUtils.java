package com.fui.cloud.common;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 根据传入的内容输出二维码
 * 
 * @author sf.xiong
 *
 */
public class QRCodeUtils {
	private static final int QRCOLOR = 0xFF000000; // 默认是黑色
	private static final int BGWHITE = 0x00FFFFFF; // 背景颜色透明
	private static final int MARGIN = 0; // 白边大小，取值范围0~4
	private static final String FORMATNAME = "png"; // 图片格式
	private static final String CHARACTER_SET = "utf-8"; // 字符编码

	/**
	 * 输出到文件
	 * 
	 * @param dirPath
	 * @param content
	 * @param width
	 * @param height
	 * @param level
	 * @return
	 */
	public static String getQRCode(String dirPath, String content, int width, int height, ErrorCorrectionLevel level) {
		try {
			File f = new File(dirPath);
			if (!f.exists()) {
				f.mkdir();

			}
			File outputFile = new File(dirPath + "/qrcode-" + new Date().getTime() + "." + FORMATNAME);
			QRCodeUtils zp = new QRCodeUtils();
			BufferedImage image = zp.getQRCodeBufferedImage(content, BarcodeFormat.QR_CODE, width, height,level);
			image = zp.zoomInImage(image, width, height);
			ImageIO.write(image, FORMATNAME, outputFile);
			return outputFile.getAbsolutePath();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 输出到流
	 * 
	 * @param stream
	 * @param content
	 * @param width
	 * @param height
	 * @param level
	 */
	public static void getQRCode(OutputStream stream, String content, int width, int height,
			ErrorCorrectionLevel level) {
		try {
			QRCodeUtils zp = new QRCodeUtils();
			BufferedImage image = zp.getQRCodeBufferedImage(content, BarcodeFormat.QR_CODE, width, height,level);
			image = zp.zoomInImage(image, width, height);
			ImageIO.write(image, FORMATNAME, stream);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 生成二维码bufferedImage图片
	 * 
	 * @param content
	 *            编码内容
	 * @param barcodeFormat
	 *            编码类型
	 * @param width
	 *            图片宽度
	 * @param height
	 *            图片高度
	 * @param level
	 *            二维码识别度
	 * @return
	 */
	protected BufferedImage getQRCodeBufferedImage(String content, BarcodeFormat barcodeFormat, int width, int height,
			ErrorCorrectionLevel level) {
		MultiFormatWriter multiFormatWriter = null;
		BitMatrix matrix = null;
		BufferedImage image = null;
		try {
			multiFormatWriter = new MultiFormatWriter();
			// 参数顺序分别为：编码内容，编码类型，生成图片宽度，生成图片高度，设置参数
			Map<EncodeHintType, ?> hints = getDecodeHintType(level);
			matrix = multiFormatWriter.encode(content, barcodeFormat, width, height, hints);
			matrix = deleteWhite(matrix);// 删除白边
			int w = matrix.getWidth();
			int h = matrix.getHeight();
			image = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);

			for (int x = 0; x < w; x++) {
				for (int y = 0; y < h; y++) {
					image.setRGB(x, y, matrix.get(x, y) ? QRCOLOR : BGWHITE);
				}
			}
		} catch (WriterException e) {
			e.printStackTrace();
		}
		return image;
	}

	/**
	 * 图片放大缩小
	 *
	 * @param originalImage
	 * @param width
	 * @param height
	 * @return
	 */
	private BufferedImage zoomInImage(BufferedImage originalImage, int width, int height) {

		BufferedImage newImage = new BufferedImage(width, height, originalImage.getType());

		Graphics g = newImage.getGraphics();

		g.drawImage(originalImage, 0, 0, width, height, null);

		g.dispose();

		return newImage;

	}

	/**
	 * 删除白边
	 *
	 * @param matrix
	 * @return
	 */
	private BitMatrix deleteWhite(BitMatrix matrix) {
		int[] rec = matrix.getEnclosingRectangle();
		int resWidth = rec[2] + 1;
		int resHeight = rec[3] + 1;

		BitMatrix resMatrix = new BitMatrix(resWidth, resHeight);
		resMatrix.clear();
		for (int i = 0; i < resWidth; i++) {
			for (int j = 0; j < resHeight; j++) {
				if (matrix.get(i + rec[0], j + rec[1]))
					resMatrix.set(i, j);
			}
		}
		return resMatrix;
	}

	/**
	 * 设置二维码的格式参数
	 *
	 * @param level
	 * @return
	 */
	protected Map<EncodeHintType, Object> getDecodeHintType(ErrorCorrectionLevel level) {
		// 用于设置QR二维码参数
		Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>();
		// 设置QR二维码的纠错级别（H为最高级别）具体级别信息
		hints.put(EncodeHintType.ERROR_CORRECTION, level);
		// 设置编码方式
		hints.put(EncodeHintType.CHARACTER_SET, CHARACTER_SET);
		hints.put(EncodeHintType.MARGIN, MARGIN);
		return hints;
	}
}
