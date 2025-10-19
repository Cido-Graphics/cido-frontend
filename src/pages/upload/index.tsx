import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import UploadCanvas from '@/components/Upload/UploadCanvas';
import UploadControlPanel from '@/components/Upload/UploadControlPanel';
import UploadDetailModal, { ProjectDetail } from '@/components/Upload/UploadDetailModal';
import ContentStyleModal, { ContentStyle } from '@/components/Upload/ContentStyleModal';
import styles from './Upload.module.css';

export interface Content {
  id: string;
  type: 'image' | 'video' | 'text' | 'grid';
  url?: string;
  text?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  files?: string[]; // for grid type
}

export default function Upload() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [contentStyle, setContentStyle] = useState<ContentStyle>({
    spacing: 100,
    backgroundColor: '#FFFFFF',
  });

  const handleAddContent = (content: Content) => {
    setContents((prev) => [...prev, content]);
  };

  const handleRemoveContent = (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
    if (selectedContentId === id) {
      setSelectedContentId(null);
    }
  };

  const handleUpdateContent = (id: string, updates: Partial<Content>) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleReorderContents = (newOrder: Content[]) => {
    setContents(newOrder);
  };

  const handleSaveDraft = async () => {
    // TODO: API 호출로 임시저장
    console.log('임시저장:', contents);
    alert('임시저장되었습니다.');
  };

  const handleNext = () => {
    if (contents.length === 0) {
      alert('최소 하나 이상의 콘텐츠를 추가해주세요.');
      return;
    }
    setIsDetailModalOpen(true);
  };

  const handleModalSubmit = (projectDetail: ProjectDetail) => {
    // TODO: API 호출로 프로젝트 생성
    console.log('프로젝트 정보:', projectDetail);
    console.log('콘텐츠:', contents);
    console.log('스타일:', contentStyle);
    
    alert('프로젝트가 게시되었습니다!');
    setIsDetailModalOpen(false);
    
    // 성공 후 초기화 또는 다른 페이지로 이동
    // router.push('/project');
  };

  const handleStyleApply = (style: ContentStyle) => {
    setContentStyle(style);
  };

  return (
    <div className={styles.uploadPage}>
      <NavigationBar />
      <main className={styles.main}>
        <div className={styles.container}>
              <UploadCanvas
                contents={contents}
                selectedContentId={selectedContentId}
                onSelectContent={setSelectedContentId}
                onRemoveContent={handleRemoveContent}
                onUpdateContent={handleUpdateContent}
                onReorderContents={handleReorderContents}
                contentStyle={contentStyle}
              />
          <div className={styles.rightPanel}>
            <UploadControlPanel
              onAddContent={handleAddContent}
              onOpenStyleModal={() => setIsStyleModalOpen(true)}
            />
            <div className={styles.actions}>
              <button className={styles.saveDraftButton} onClick={handleSaveDraft}>
                임시저장
              </button>
              <button className={styles.nextButton} onClick={handleNext}>
                다음
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* 콘텐츠 스타일 조정 모달 */}
      <ContentStyleModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        onApply={handleStyleApply}
        initialStyle={contentStyle}
      />

      {/* 프로젝트 상세 정보 입력 모달 */}
      <UploadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

