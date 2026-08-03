'use client';

import { useRef, useState } from 'react';
import styles from './Camera.module.css';

interface CameraProps {
  onCapture: (imageBase64: string) => void;
  onClose: () => void;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB cap to prevent OOM / API quota drain

export default function Camera({ onCapture, onClose }: CameraProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      const mb = Math.round(file.size / 1024 / 1024);
      setError(`Image is too large (${mb} MB). Max is 10 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!preview) return;

    // Extract base64 from data URL
    const base64 = preview.split(',')[1];
    onCapture(base64);
  };

  const handleUseSample = () => {
    // Use a sample food image for testing
    setError('Sample images not available yet. Please upload a photo.');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Add Food</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {preview ? (
          <div className={styles.preview}>
            <img src={preview} alt="Food preview" />
          </div>
        ) : (
          <div className={styles.upload}>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className={styles.fileInput}
            />

            <div className={styles.uploadIcon}>📷</div>
            <p>Take a photo of your food</p>

            <button
              className="btn"
              onClick={() => inputRef.current?.click()}
            >
              Choose Photo
            </button>

            <button
              className="btn btn-outline"
              onClick={handleUseSample}
              style={{ marginTop: '0.75rem' }}
            >
              Use Sample Image
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {preview && (
          <div className={styles.actions}>
            <button
              className="btn btn-outline"
              onClick={() => setPreview(null)}
            >
              Retake
            </button>
            <button
              className="btn"
              onClick={handleConfirm}
            >
              Analyze
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
