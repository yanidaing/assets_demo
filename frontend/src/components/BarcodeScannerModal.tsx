import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Swal from 'sweetalert2';

const PDFJS = typeof window !== 'undefined' ? require('pdfjs-dist/build/pdf') : null;
if (PDFJS && PDFJS.GlobalWorkerOptions) {
  PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;
}

interface BarcodeScannerModalProps {
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    let active = true;
    codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
      if (result && active) {
        active = false;
        onDetected(result.getText());
        if (typeof codeReader.reset === 'function') codeReader.reset();
        if (typeof codeReader.stopContinuousDecode === 'function') codeReader.stopContinuousDecode();
      }
    });
    return () => {
      active = false;
      if (typeof codeReader.reset === 'function') codeReader.reset();
      if (typeof codeReader.stopContinuousDecode === 'function') codeReader.stopContinuousDecode();
    };
  }, [onDetected]);

  // ฟังก์ชันสแกน barcode จาก image
  const scanImageFile = async (file: File) => {
    const codeReader = new BrowserMultiFormatReader();
    const img = new window.Image();
    img.onload = async function() {
      try {
        const result = await codeReader.decodeFromImageElement(img);
        Swal.fire({ icon: 'success', title: 'สแกนสำเร็จ', text: `Barcode: ${result.getText()}` });
        onDetected(result.getText());
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'ไม่พบ barcode', text: 'ไม่พบ barcode ในไฟล์ภาพนี้' });
      }
    };
    img.onerror = () => Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถอ่านไฟล์ภาพนี้ได้' });
    img.src = URL.createObjectURL(file);
  };

  // ฟังก์ชันสแกน barcode จาก PDF ทุกหน้า
  const scanPdfFile = async (file: File) => {
    if (!PDFJS) {
      Swal.fire({ icon: 'error', title: 'ไม่รองรับ PDF', text: 'pdf.js ยังไม่ถูกโหลด' });
      return;
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    let foundBarcode = false;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
      const codeReader = new BrowserMultiFormatReader();
      try {
        const result = await codeReader.decodeFromCanvas(canvas);
        Swal.fire({ icon: 'success', title: 'สแกนสำเร็จ', text: `Barcode: ${result.getText()} (หน้า ${pageNum})` });
        onDetected(result.getText());
        foundBarcode = true;
        break; // ถ้าต้องการสแกนทุก barcode ทุกหน้า ให้ลบ break;
      } catch (err) {
        // ไม่พบ barcode ในหน้านี้
      }
    }
    if (!foundBarcode) {
      Swal.fire({ icon: 'error', title: 'ไม่พบ barcode', text: 'ไม่พบ barcode ใน PDF นี้' });
    }
  };

  // handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'application/pdf') {
      scanPdfFile(file);
    } else if (file.type.startsWith('image/')) {
      scanImageFile(file);
    } else {
      Swal.fire({ icon: 'error', title: 'ไฟล์ไม่รองรับ', text: 'รองรับเฉพาะ PDF และไฟล์รูปภาพ' });
    }
    e.target.value = '';
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 480, minHeight: 420, position: 'relative', boxShadow: '0 2px 16px #0003' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 20, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h3 style={{ marginBottom: 18, fontSize: 24 }}>Scan Barcode</h3>
        <video ref={videoRef} style={{ width: 440, height: 320, borderRadius: 10, background: '#222' }} autoPlay muted />
        <div style={{ marginTop: 18, color: '#888', fontSize: 16 }}>
          Align the barcode within the frame.
        </div>
        <div style={{ marginTop: 24 }}>
          <label style={{ display: 'inline-block', padding: '8px 18px', background: '#4f46e5', color: '#fff', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
            แนบไฟล์ PDF หรือรูปภาพ
            <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal; 