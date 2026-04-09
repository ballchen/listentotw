# 聽見，福爾摩沙（Modern Rewrite）

這個專案將原本的舊版靜態網站（jQuery + skrollr）重構為 **React + Vite** 現代前端架構，保留原始圖片與音訊素材，並針對以下重點改善：

- 改善 loading 體驗（首屏預載 + 非關鍵內容延遲載入）
- 改善 CSS UX/UI（元件化版面與一致互動樣式）
- 加入手機版 RWD（mobile-first 響應式斷點）
- 改善可維護性（資料驅動的故事內容模型）

## 技術棧

- React
- Vite
- 原生 CSS（模組化結構與響應式規劃）

## 本機開發

```bash
npm install
npm run dev
```

## 打包建置

```bash
npm run build
npm run preview
```

## 專案結構（節錄）

```text
src/
  App.jsx
  App.css
  data/
    stories.js
```

## 重構重點

1. **資料驅動內容**
   - 將故事資訊抽離至 `src/data/stories.js`
   - 避免舊版大量重複 HTML 與手動綁定事件

2. **Loading 與效能**
   - 首屏僅預載必要素材（封面與首張場景）
   - 圖片使用 `loading="lazy"` / `decoding="async"`
   - 社群留言 iframe 改為按鈕觸發後再載入
   - 音訊改為 `preload="metadata"`，避免一次載入過重

3. **UX / UI 與 RWD**
   - 新增清楚的播放器區塊與故事分段卡片
   - 行動版選單採可展開式設計
   - 調整間距、字級與互動狀態，提升可讀性與操作性
