import React, { useState } from "react";
import Head from "next/head";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import styles from "./Designer.module.css";

const DesignersPage = () => {
  const [activeCategory, setActiveCategory] = useState("전체");

  const categories = [
    "전체",
    "UI/UX",
    "편집",
    "Product",
    "Graphic",
    "Motion",
    "Illustration",
    "AI",
    "Craft",
  ];

  // Mock data for hot designers
  const hotDesigners = [
    {
      id: 1,
      image:
        "https://www.figma.com/api/mcp/asset/f9510fd3-fa2b-481d-b100-2d03e6d21036",
    },
    {
      id: 2,
      image:
        "https://www.figma.com/api/mcp/asset/f9510fd3-fa2b-481d-b100-2d03e6d21036",
    },
    {
      id: 3,
      image:
        "https://www.figma.com/api/mcp/asset/f9510fd3-fa2b-481d-b100-2d03e6d21036",
    },
    {
      id: 4,
      image:
        "https://www.figma.com/api/mcp/asset/f9510fd3-fa2b-481d-b100-2d03e6d21036",
    },
  ];

  // Mock data for designer cards
  const designers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: "여명대학교",
    category: "Branding, UXUI",
    image:
      "https://www.figma.com/api/mcp/asset/415542be-debd-470b-8525-7b90b22207a4",
  }));

  return (
    <div className={styles.container}>
      <Head>
        <title>Designers - Cido</title>
        <meta
          name="description"
          content="만나보세요, 시도와 함께하는 디자이너들"
        />
      </Head>

      <NavigationBar />

      <main className={styles.main}>
        {/* Hot Designers Section */}
        <section className={styles.hotDesignersSection}>
          <div className={styles.titleContainer}>
            <p className={styles.subtitle}>Hot Designers</p>
            <h1 className={styles.title}>최근 핫한 디자이너들을 만나보세요!</h1>
          </div>
          <div className={styles.hotDesignersScroll}>
            {hotDesigners.map((designer) => (
              <div key={designer.id} className={styles.hotDesignerCard}>
                <img src={designer.image} alt={`Hot Designer ${designer.id}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Designer List Section */}
        <section className={styles.designerListSection}>
          <div className={styles.listHeader}>
            <div className={styles.titleContainer}>
              <p className={styles.subtitle}>시도는 멈추지 않는다</p>
              <h2 className={styles.title}>시도와 함께하는 디자이너들</h2>
            </div>
            <div className={styles.categoryTabs}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryTab} ${
                    activeCategory === category ? styles.active : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.designerGrid}>
            {designers.map((designer) => (
              <div key={designer.id} className={styles.designerCard}>
                <div className={styles.profileImage}>
                  <img src={designer.image} alt={designer.name} />
                </div>
                <div className={styles.designerInfo}>
                  <h3 className={styles.designerName}>{designer.name}</h3>
                  <p className={styles.designerCategory}>{designer.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DesignersPage;
