import styles from './UploadActionButton.module.css';

interface UploadActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function UploadActionButton({
  icon,
  label,
  onClick,
}: UploadActionButtonProps) {
  return (
    <button className={styles.actionButton} onClick={onClick}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <span className={styles.label}>{label}</span>
    </button>
  );
}

