import { useEffect, useMemo, useRef, useState } from 'react'
import { stories } from './data/stories'
import './App.css'

function App() {
  const audioRef = useRef(null)
  const immersiveTouchStartXRef = useRef(null)
  const [activeStoryId, setActiveStoryId] = useState(stories[0].id)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSceneFullscreen, setIsSceneFullscreen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInitialReady, setIsInitialReady] = useState(false)
  const [playbackError, setPlaybackError] = useState('')

  const activeStory = useMemo(
    () => stories.find((story) => story.id === activeStoryId) ?? stories[0],
    [activeStoryId],
  )
  const activeScene = activeStory.scenes[activeSceneIndex] ?? activeStory.scenes[0]
  const canGoPrevScene = activeSceneIndex > 0
  const canGoNextScene = activeSceneIndex < activeStory.scenes.length - 1

  useEffect(() => {
    let cancelled = false
    const preloadImage = (src) =>
      new Promise((resolve) => {
        const image = new Image()
        image.src = src
        image.onload = resolve
        image.onerror = resolve
      })

    const initialAssets = [
      '/img/first2.png',
      stories[0].coverImage,
      stories[0].scenes[0].image,
    ]

    Promise.all(initialAssets.map((src) => preloadImage(src))).then(() => {
      if (!cancelled) {
        setIsInitialReady(true)
      }
    })

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) {
        setIsInitialReady(true)
      }
    }, 2500)

    return () => {
      cancelled = true
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    audioElement.pause()
    audioElement.currentTime = 0
    audioElement.load()
  }, [activeStoryId])

  useEffect(() => {
    if (!isSceneFullscreen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        setIsSceneFullscreen(false)
        return
      }

      if (event.key === 'ArrowLeft') {
        setActiveSceneIndex((prev) => Math.max(prev - 1, 0))
        return
      }

      if (event.key === 'ArrowRight') {
        setActiveSceneIndex((prev) => Math.min(prev + 1, activeStory.scenes.length - 1))
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isSceneFullscreen, activeStory.scenes.length])

  const selectStory = (storyId) => {
    setActiveStoryId(storyId)
    setActiveSceneIndex(0)
    setIsSceneFullscreen(false)
    setIsPlaying(false)
    setPlaybackError('')
  }

  const selectScene = (sceneIndex) => {
    const boundedIndex = Math.max(0, Math.min(sceneIndex, activeStory.scenes.length - 1))
    setActiveSceneIndex(boundedIndex)
  }

  const handleImmersiveTouchStart = (event) => {
    immersiveTouchStartXRef.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleImmersiveTouchEnd = (event) => {
    const startX = immersiveTouchStartXRef.current
    if (startX === null) {
      return
    }

    const endX = event.changedTouches[0]?.clientX ?? startX
    const deltaX = endX - startX
    const swipeThreshold = 48

    if (deltaX <= -swipeThreshold) {
      selectScene(activeSceneIndex + 1)
    } else if (deltaX >= swipeThreshold) {
      selectScene(activeSceneIndex - 1)
    }

    immersiveTouchStartXRef.current = null
  }

  const handlePlay = async () => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    try {
      await audioElement.play()
      setIsPlaying(true)
      setPlaybackError('')
    } catch {
      setIsPlaying(false)
      setPlaybackError('音訊播放被瀏覽器阻擋，請再按一次播放。')
    }
  }

  const handlePause = () => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    audioElement.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    audioElement.pause()
    audioElement.currentTime = 0
    setIsPlaying(false)
  }

  return (
    <div className="app-shell">
      {!isInitialReady ? (
        <div className="initial-loader" role="status" aria-live="polite">
          <img src="/img/loadingbg.png" alt="" className="initial-loader__bg" />
          <div className="initial-loader__content">
            <p className="initial-loader__title">聽見，福爾摩沙</p>
            <p className="initial-loader__text">正在準備聲景故事...</p>
            <span className="initial-loader__bar" />
          </div>
        </div>
      ) : null}

      <header className="hero">
        <img src="/img/inlogo.png" alt="聽見，福爾摩沙" className="hero__logo" />
        <div className="hero__text-group">
          <p className="hero__eyebrow">Taiwan Cultural Soundscape</p>
          <h1>聽見，福爾摩沙</h1>
        </div>
      </header>

      <section className="experience">
        <section className="player">
          <div className="player__cover-wrap">
            <img
              src={activeStory.coverImage}
              alt={`${activeStory.title} 封面`}
              className={`player__cover ${isPlaying ? 'is-spinning' : ''}`}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="player__meta">
            <p className="player__category">{activeStory.category}</p>
            <h2>{activeStory.title}</h2>
            <p className="player__quote">{activeStory.quote}</p>
            <p className="player__scene-indicator">
              章節 {activeSceneIndex + 1} / {activeStory.scenes.length}
            </p>
            <div className="player__controls">
              <button
                type="button"
                className={`player__icon-btn ${isPlaying ? 'is-active' : ''}`}
                onClick={handlePlay}
                aria-label="播放"
                title="播放"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 6v12l10-6z" fill="currentColor" />
                </svg>
                <span className="sr-only">播放</span>
              </button>
              <button
                type="button"
                className="player__icon-btn"
                onClick={handlePause}
                aria-label="暫停"
                title="暫停"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="7" y="6" width="4" height="12" fill="currentColor" />
                  <rect x="13" y="6" width="4" height="12" fill="currentColor" />
                </svg>
                <span className="sr-only">暫停</span>
              </button>
              <button
                type="button"
                className="player__icon-btn"
                onClick={handleStop}
                aria-label="停止"
                title="停止"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="7" y="7" width="10" height="10" fill="currentColor" />
                </svg>
                <span className="sr-only">停止</span>
              </button>
            </div>
            {playbackError ? (
              <p className="player__error" role="alert">
                {playbackError}
              </p>
            ) : null}
            <div className="player__scene-tools">
              <div className="scene-nav">
                <button
                  type="button"
                  className="scene-nav__btn"
                  onClick={() => selectScene(activeSceneIndex - 1)}
                  disabled={!canGoPrevScene}
                  aria-label="上一章"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15.4 5.9L9.3 12l6.1 6.1-1.4 1.4L6.5 12l7.5-7.5z" fill="currentColor" />
                  </svg>
                </button>
                <span className="scene-nav__progress">
                  {activeSceneIndex + 1} / {activeStory.scenes.length}
                </span>
                <button
                  type="button"
                  className="scene-nav__btn"
                  onClick={() => selectScene(activeSceneIndex + 1)}
                  disabled={!canGoNextScene}
                  aria-label="下一章"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.6 18.1L14.7 12 8.6 5.9 10 4.5l7.5 7.5-7.5 7.5z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <div className="scene-switcher player__scene-switcher">
                {activeStory.scenes.map((scene, index) => (
                  <button
                    type="button"
                    key={scene.heading}
                    className={`scene-switcher__btn ${activeSceneIndex === index ? 'is-active' : ''}`}
                    onClick={() => selectScene(index)}
                    aria-pressed={activeSceneIndex === index}
                  >
                    <span className="scene-switcher__index">{index + 1}</span>
                    <span className="scene-switcher__title">{scene.heading}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <audio ref={audioRef} preload="metadata" onEnded={() => setIsPlaying(false)}>
            <source src={activeStory.audio.mp3} type="audio/mpeg" />
            <source src={activeStory.audio.ogg} type="audio/ogg" />
          </audio>
        </section>

        <section className="scene-stage">
          <article className="story-intro">
            <p>{activeStory.description}</p>
          </article>
          <div className="scene-stage__head">
            <h3>故事章節</h3>
            <button
              type="button"
              className="brand-btn scene-stage__immersive-btn"
              onClick={() => setIsSceneFullscreen(true)}
            >
              全螢幕展開
            </button>
          </div>
          <article className="scene-card is-in-view">
            <img
              src={activeScene.image}
              alt={`${activeStory.title} ${activeScene.heading}`}
              loading="eager"
              decoding="async"
            />
            <div className="scene-card__content">
              <h4>{activeScene.heading}</h4>
              <p>{activeScene.text}</p>
            </div>
          </article>
        </section>
      </section>

      <section className="album-list">
        <div className="album-list__head">
          <h3>聲音選輯</h3>
          <button
            type="button"
            className="brand-btn album-list__menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? '收起選單' : '展開選單'}
          </button>
        </div>
        <div className={`album-list__grid ${isMenuOpen ? 'is-open' : ''}`}>
          {stories.map((story, index) => {
            const isActive = story.id === activeStoryId
            return (
              <button
                type="button"
                key={story.id}
                className={`album-card ${isActive ? 'is-active' : ''}`}
                onClick={() => selectStory(story.id)}
                aria-pressed={isActive}
              >
                <img
                  src={story.coverImage}
                  alt={`${story.title} 專輯`}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span>{story.title}</span>
              </button>
            )
          })}
        </div>
      </section>

      {isSceneFullscreen ? (
        <div
          className="immersive-view"
          role="dialog"
          aria-modal="true"
          aria-label="故事章節沉浸模式"
          onTouchStart={handleImmersiveTouchStart}
          onTouchEnd={handleImmersiveTouchEnd}
        >
          <img
            src={activeScene.image}
            alt={`${activeStory.title} ${activeScene.heading}`}
            className="immersive-view__image"
            loading="eager"
            decoding="async"
          />
          <div className="immersive-view__shade" />
          <button
            type="button"
            className="immersive-view__nav immersive-view__nav--prev"
            onClick={() => selectScene(activeSceneIndex - 1)}
            disabled={!canGoPrevScene}
            aria-label="上一章"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.4 5.9L9.3 12l6.1 6.1-1.4 1.4L6.5 12l7.5-7.5z" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className="immersive-view__nav immersive-view__nav--next"
            onClick={() => selectScene(activeSceneIndex + 1)}
            disabled={!canGoNextScene}
            aria-label="下一章"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.6 18.1L14.7 12 8.6 5.9 10 4.5l7.5 7.5-7.5 7.5z" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className="immersive-view__close"
            onClick={() => setIsSceneFullscreen(false)}
            aria-label="關閉沉浸模式"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="immersive-view__content">
            <p className="immersive-view__meta">
              {activeStory.title} · 章節 {activeSceneIndex + 1}
            </p>
            <h4>{activeScene.heading}</h4>
            <p>{activeScene.text}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
