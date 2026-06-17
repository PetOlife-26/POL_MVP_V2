/**
 * QRService.js
 *
 * Centralised abstraction layer for QR code generation.
 * All modules must use the exported functions below and must NOT call
 * QRCode.toCanvas / QRCode.toDataURL directly.
 *
 * This ensures future library replacement has zero impact on the rest of the app.
 *
 * Follows the architecture defined in: qr_generator/instructions.md
 */

import QRCode from "qrcode";

/**
 * Renders a QR code directly onto an HTML <canvas> element.
 *
 * @param {HTMLCanvasElement} canvas - The target canvas element.
 * @param {string} url              - The URL to encode in the QR code.
 * @returns {Promise<void>}
 */
export async function generateQR(canvas, url) {
  await QRCode.toCanvas(canvas, url, {
    width: 260,
    margin: 2,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });
}

/**
 * Generates a QR code and returns it as a Base64 Data URL (image/png).
 * Useful for download links or embedding in an <img> tag.
 *
 * @param {string} url - The URL to encode in the QR code.
 * @returns {Promise<string>} Base64 Data URL string.
 */
export async function generateQRDataURL(url) {
  return await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });
}

/**
 * Generates a QR code and returns it as a Blob (image/png).
 * Useful for uploading directly to Supabase Storage.
 *
 * @param {string} url - The URL to encode in the QR code.
 * @returns {Promise<Blob>} PNG Blob.
 */
export async function generateQRBlob(url) {
  const dataUrl = await generateQRDataURL(url);
  const response = await fetch(dataUrl);
  return await response.blob();
}
