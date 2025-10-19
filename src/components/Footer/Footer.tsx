import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.cido}>cido</div>
        <div className={styles.description}>
          홍익대학교 학생들의 실험적인 시도를, 세상과 연결하는 창의적 플랫폼.
        </div>
        <div className={styles.info}>
          대표자: 홍성봉<br />
          서울특별시 동대문구 한천로6길 16 3층<br />
          hsm@cidofactory.com
        </div>
        <div className={styles.copyright}>
          Copyright © cido. All Rights Reserved.
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>
            이용약관
          </a>
          <a href="#" className={styles.link}>
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
