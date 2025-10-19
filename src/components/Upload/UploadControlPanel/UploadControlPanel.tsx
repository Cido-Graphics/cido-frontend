import { useRef, useState } from 'react';
import { Content } from '@/pages/upload';
import UploadActionButton from '../UploadActionButton';
import styles from './UploadControlPanel.module.css';

interface UploadControlPanelProps {
  onAddContent: (content: Content) => void;
  onOpenStyleModal: () => void;
}

export default function UploadControlPanel({ onAddContent, onOpenStyleModal }: UploadControlPanelProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const gridInputRef = useRef<HTMLInputElement>(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    onAddContent({
      id: `image-${Date.now()}`,
      type: 'image',
      url,
    });

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    onAddContent({
      id: `video-${Date.now()}`,
      type: 'video',
      url,
    });

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleGridUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));

    onAddContent({
      id: `grid-${Date.now()}`,
      type: 'grid',
      files: urls,
    });

    // Reset input
    if (gridInputRef.current) {
      gridInputRef.current.value = '';
    }
  };

  const handleTextAdd = () => {
    setShowTextModal(true);
  };

  const handleTextSubmit = () => {
    if (textInput.trim() === '') {
      alert('텍스트를 입력해주세요.');
      return;
    }

    onAddContent({
      id: `text-${Date.now()}`,
      type: 'text',
      text: textInput,
    });

    setTextInput('');
    setShowTextModal(false);
  };

  const handleReorder = () => {
    // TODO: 재정렬 기능 구현
    alert('콘텐츠 재정렬 기능은 곧 추가됩니다.');
  };

  const handleStyle = () => {
    onOpenStyleModal();
  };

  return (
    <>
      <div className={styles.controlPanel}>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
        />
        <input
          ref={gridInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGridUpload}
          style={{ display: 'none' }}
        />

        <UploadActionButton
          icon="🖼️"
          label="이미지 추가"
          onClick={() => imageInputRef.current?.click()}
        />

        <UploadActionButton
          icon="🎥"
          label="동영상 추가"
          onClick={() => videoInputRef.current?.click()}
        />

        <UploadActionButton
          icon="✏️"
          label="텍스트 추가"
          onClick={handleTextAdd}
        />

        <UploadActionButton
          icon="🖼️"
          label="이미지 그리드 추가"
          onClick={() => gridInputRef.current?.click()}
        />

        <UploadActionButton
          icon="🔄"
          label="콘텐츠 재정렬"
          onClick={handleReorder}
        />

        <UploadActionButton
          icon="🎨"
          label="콘텐츠 스타일"
          onClick={handleStyle}
        />
      </div>

      {/* 텍스트 입력 모달 */}
      {showTextModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTextModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>텍스트 추가</h3>
            <textarea
              className={styles.textInput}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="텍스트를 입력하세요..."
              rows={6}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowTextModal(false);
                  setTextInput('');
                }}
              >
                취소
              </button>
              <button className={styles.submitButton} onClick={handleTextSubmit}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

