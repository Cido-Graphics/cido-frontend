import { useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import { Content } from '@/pages/upload';
import { ContentStyle } from '@/components/Upload/ContentStyleModal';
import styles from './UploadCanvas.module.css';

interface UploadCanvasProps {
  contents: Content[];
  selectedContentId: string | null;
  onSelectContent: (id: string | null) => void;
  onRemoveContent: (id: string) => void;
  onUpdateContent: (id: string, updates: Partial<Content>) => void;
  onReorderContents: (newOrder: Content[]) => void;
  contentStyle: ContentStyle;
}

export default function UploadCanvas({
  contents,
  selectedContentId,
  onSelectContent,
  onRemoveContent,
  onUpdateContent,
  onReorderContents,
  contentStyle,
}: UploadCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragOver);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // TODO: 파일 업로드 처리
    console.log('Dropped files:', files);
  };

  const handleContentClick = (id: string) => {
    onSelectContent(selectedContentId === id ? null : id);
  };

  const handleDeleteContent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('이 콘텐츠를 삭제하시겠습니까?')) {
      onRemoveContent(id);
    }
  };

  // 드래그 앤 드롭 재정렬 핸들러
  const handleContentDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // 드래그 중 투명도 조정을 위해
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleContentDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleContentDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    setDragOverIndex(index);
  };

  const handleContentDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleContentDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    // 배열 재정렬
    const newContents = [...contents];
    const [draggedItem] = newContents.splice(draggedIndex, 1);
    newContents.splice(dropIndex, 0, draggedItem);

    onReorderContents(newContents);
    setDragOverIndex(null);
  };

  const renderContent = (content: Content, index: number) => {
    const isSelected = selectedContentId === content.id;
    const isDragOver = dragOverIndex === index;

    switch (content.type) {
      case 'image':
        return (
          <div
            key={content.id}
            draggable
            onDragStart={(e) => handleContentDragStart(e, index)}
            onDragEnd={handleContentDragEnd}
            onDragOver={(e) => handleContentDragOver(e, index)}
            onDragLeave={handleContentDragLeave}
            onDrop={(e) => handleContentDrop(e, index)}
            className={`${styles.contentItem} ${styles.imageContent} ${
              isSelected ? styles.selected : ''
            } ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => handleContentClick(content.id)}
          >
            {content.url ? (
              <img src={content.url} alt="Uploaded" className={styles.contentImage} />
            ) : (
              <div className={styles.placeholder}>이미지 로딩중...</div>
            )}
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteContent(e, content.id)}
            >
              ✕
            </button>
          </div>
        );

      case 'video':
        return (
          <div
            key={content.id}
            draggable
            onDragStart={(e) => handleContentDragStart(e, index)}
            onDragEnd={handleContentDragEnd}
            onDragOver={(e) => handleContentDragOver(e, index)}
            onDragLeave={handleContentDragLeave}
            onDrop={(e) => handleContentDrop(e, index)}
            className={`${styles.contentItem} ${styles.videoContent} ${
              isSelected ? styles.selected : ''
            } ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => handleContentClick(content.id)}
          >
            {content.url ? (
              <video src={content.url} className={styles.contentVideo} controls />
            ) : (
              <div className={styles.placeholder}>동영상 로딩중...</div>
            )}
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteContent(e, content.id)}
            >
              ✕
            </button>
          </div>
        );

      case 'text':
        return (
          <div
            key={content.id}
            draggable
            onDragStart={(e) => handleContentDragStart(e, index)}
            onDragEnd={handleContentDragEnd}
            onDragOver={(e) => handleContentDragOver(e, index)}
            onDragLeave={handleContentDragLeave}
            onDrop={(e) => handleContentDrop(e, index)}
            className={`${styles.contentItem} ${styles.textContent} ${
              isSelected ? styles.selected : ''
            } ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => handleContentClick(content.id)}
          >
            <p className={styles.contentText}>{content.text || '텍스트 없음'}</p>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteContent(e, content.id)}
            >
              ✕
            </button>
          </div>
        );

      case 'grid':
        return (
          <div
            key={content.id}
            draggable
            onDragStart={(e) => handleContentDragStart(e, index)}
            onDragEnd={handleContentDragEnd}
            onDragOver={(e) => handleContentDragOver(e, index)}
            onDragLeave={handleContentDragLeave}
            onDrop={(e) => handleContentDrop(e, index)}
            className={`${styles.contentItem} ${styles.gridContent} ${
              isSelected ? styles.selected : ''
            } ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => handleContentClick(content.id)}
          >
            <div className={styles.gridContainer}>
              {content.files?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Grid ${index}`}
                  className={styles.gridImage}
                />
              ))}
            </div>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDeleteContent(e, content.id)}
            >
              ✕
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const breakpointColumns = {
    default: 4,
    1440: 3,
    1024: 2,
    768: 1,
  };

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      style={{
        backgroundColor: contentStyle.backgroundColor,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {contents.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            우측의 버튼을 눌러
            <br />
            컨텐츠를 업로드하세요!
          </p>
          <button className={styles.helpButton}>
            올리는 방법 어렵다면 여기 클릭!
          </button>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryColumn}
          style={{
            ['--masonry-gap' as string]: `${contentStyle.spacing}px`,
          }}
        >
          {contents.map((content, index) => (
            <div
              key={content.id}
              style={{
                marginBottom: `${contentStyle.spacing}px`,
              }}
            >
              {renderContent(content, index)}
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}

