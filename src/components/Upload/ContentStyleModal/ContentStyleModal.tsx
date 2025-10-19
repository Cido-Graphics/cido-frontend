import { useState } from 'react';
import styles from './ContentStyleModal.module.css';

interface ContentStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (style: ContentStyle) => void;
  initialStyle?: ContentStyle;
}

export interface ContentStyle {
  spacing: number; // 콘텐츠 간격 (px)
  backgroundColor: string; // 배경색
}

export default function ContentStyleModal({
  isOpen,
  onClose,
  onApply,
  initialStyle = { spacing: 100, backgroundColor: '#FFFFFF' },
}: ContentStyleModalProps) {
  const [spacing, setSpacing] = useState(initialStyle.spacing);
  const [backgroundColor, setBackgroundColor] = useState(initialStyle.backgroundColor);

  const handleApply = () => {
    onApply({ spacing, backgroundColor });
    onClose();
  };

  const handleCancel = () => {
    // 원래 값으로 되돌림
    setSpacing(initialStyle.spacing);
    setBackgroundColor(initialStyle.backgroundColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {/* 콘텐츠 간격 */}
          <div className={styles.section}>
            <label className={styles.label}>콘텐츠 간격</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="200"
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.value}>{spacing} px</span>
            </div>
          </div>

          {/* 배경색 */}
          <div className={styles.section}>
            <label className={styles.label}>배경색</label>
            <div className={styles.colorPickerContainer}>
              <div
                className={styles.colorPreview}
                style={{ backgroundColor }}
                onClick={() => document.getElementById('colorInput')?.click()}
              >
                <input
                  id="colorInput"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className={styles.colorInput}
                />
              </div>
              <input
                type="text"
                value={backgroundColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                    setBackgroundColor(value);
                  }
                }}
                className={styles.colorText}
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소하기
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
}

