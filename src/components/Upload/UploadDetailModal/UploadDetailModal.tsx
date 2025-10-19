import { useState, useRef } from 'react';
import styles from './UploadDetailModal.module.css';

interface UploadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectDetail) => void;
}

export interface ProjectDetail {
  title: string;
  description: string;
  year: string;
  teamType: 'individual' | 'team';
  software: string;
  sellOption: 'yes' | 'no';
  awardStatus: 'yes' | 'no';
  categories: string[];
  price: string;
  thumbnail?: File;
}

const CATEGORIES = [
  'Adobe illustration',
  'Photoshop',
  'Indesign',
  'Figma',
  'HTML',
  'CSS',
  'JavaScript',
  'React',
];

export default function UploadDetailModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadDetailModalProps) {
  const [formData, setFormData] = useState<ProjectDetail>({
    title: '',
    description: '',
    year: '',
    teamType: 'individual',
    software: '',
    sellOption: 'no',
    awardStatus: 'no',
    categories: [],
    price: '',
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = () => {
    // 간단한 유효성 검사
    if (!formData.title.trim()) {
      alert('프로젝트 제목을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      alert('프로젝트 설명을 입력해주세요.');
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {/* 왼쪽: 썸네일 업로드 */}
          <div className={styles.thumbnailSection}>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              style={{ display: 'none' }}
            />
            <div
              className={styles.thumbnailArea}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className={styles.thumbnailImage} />
              ) : (
                <div className={styles.thumbnailPlaceholder}>
                  <button className={styles.uploadButton}>이미지 업로드</button>
                </div>
              )}
            </div>
            <div className={styles.thumbnailGuide}>
              <h4 className={styles.guideTitle}>썸네일 권장 사이즈</h4>
              <p className={styles.guideText}>
                가로 : 382 x 300<br />
                세로 : 382 x 420<br />
                정사각형 : 382 x 382
              </p>
            </div>
          </div>

          {/* 오른쪽: 폼 */}
          <div className={styles.formSection}>
            <div className={styles.scrollableForm}>
              {/* 프로젝트 제목 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>프로젝트 제목</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="프로젝트 제목을 입력해주세요"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* 프로젝트 설명 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>프로젝트 설명</label>
                <textarea
                  className={styles.textarea}
                  placeholder="프로젝트 설명을 입력해주세요(500자 제한)"
                  value={formData.description}
                  maxLength={500}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                />
              </div>

              {/* 제작연도 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>제작연도</label>
                <select
                  className={styles.input}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="">연도를 선택해주세요</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* 팀플/개인 여부 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>팀플 / 개인 여부</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="teamType"
                      checked={formData.teamType === 'individual'}
                      onChange={() => setFormData({ ...formData, teamType: 'individual' })}
                    />
                    <span>개인</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="teamType"
                      checked={formData.teamType === 'team'}
                      onChange={() => setFormData({ ...formData, teamType: 'team' })}
                    />
                    <span>팀플</span>
                  </label>
                </div>
              </div>

              {/* 소프트웨어/재료 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>소프트웨어 / 재료</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="단답형으로 입력해주세요"
                  value={formData.software}
                  onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                />
              </div>

              {/* 아트 프린팅/굿즈 판매 희망 여부 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>아트 프린팅 / 굿즈로 판매 희망 여부</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="sellOption"
                      checked={formData.sellOption === 'yes'}
                      onChange={() => setFormData({ ...formData, sellOption: 'yes' })}
                    />
                    <span>판매 희망</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="sellOption"
                      checked={formData.sellOption === 'no'}
                      onChange={() => setFormData({ ...formData, sellOption: 'no' })}
                    />
                    <span>판매 희망하지 않음(포트폴리오로만 가능)</span>
                  </label>
                </div>
              </div>

              {/* 공모전 수상여부 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>공모전 수상여부</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="awardStatus"
                      checked={formData.awardStatus === 'yes'}
                      onChange={() => setFormData({ ...formData, awardStatus: 'yes' })}
                    />
                    <span>수상함(수상함 체크시 공모전 인증하는 구글폼을 작성하셔야 합니다)</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="awardStatus"
                      checked={formData.awardStatus === 'no'}
                      onChange={() => setFormData({ ...formData, awardStatus: 'no' })}
                    />
                    <span>수상하지 않음</span>
                  </label>
                </div>
              </div>

              {/* 프로젝트 카테고리 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>프로젝트 카테고리</label>
                <div className={styles.categoryTags}>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      className={`${styles.categoryTag} ${
                        formData.categories.includes(category) ? styles.categoryTagActive : ''
                      }`}
                      onClick={() => handleCategoryToggle(category)}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 판매 가격 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>판매 가격</label>
                <div className={styles.priceInput}>
                  <input
                    type="text"
                    className={styles.priceField}
                    placeholder="000,000"
                    value={formData.price}
                    onChange={(e) => {
                      // 숫자만 추출
                      const numbers = e.target.value.replace(/[^0-9]/g, '');
                      // 1000단위로 쉼표 추가
                      const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                      setFormData({ ...formData, price: formatted });
                    }}
                  />
                  <span className={styles.priceUnit}>원</span>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onClose}>
                취소하기
              </button>
              <button className={styles.submitButton} onClick={handleSubmit}>
                게시하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

