import { useEffect, useMemo, useRef, useState } from 'react'
import { stories } from './data/stories'
import './App.css'

function App() {
  const audioRef = useRef(null)
  const [activeStoryId, setActiveStoryId] = useState(stories[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isInitialReady, setIsInitialReady] = useState(false)
  const [playbackError, setPlaybackError] = useState('')

  const activeStory = useMemo(
    () => stories.find((story) => story.id === activeStoryId) ?? stories[0],
    [activeStoryId],
  )

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

  const selectStory = (storyId) => {
    setActiveStoryId(storyId)
    setIsCommentsOpen(false)
    setIsPlaying(false)
    setPlaybackError('')
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
          <p className="hero__description">
            將舊站重構為現代化網頁體驗，保留原有故事精神，並改善載入效能、互動流暢度與手機閱讀體驗。
          </p>
        </div>
      </header>

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
          <div className="player__controls">
            <button type="button" onClick={handlePlay}>
              播放
            </button>
            <button type="button" onClick={handlePause}>
              暫停
            </button>
            <button type="button" onClick={handleStop}>
              停止
            </button>
          </div>
          {playbackError ? (
            <p className="player__error" role="alert">
              {playbackError}
            </p>
          ) : null}
        </div>
        <audio ref={audioRef} preload="metadata" onEnded={() => setIsPlaying(false)}>
          <source src={activeStory.audio.mp3} type="audio/mpeg" />
          <source src={activeStory.audio.ogg} type="audio/ogg" />
        </audio>
      </section>

      <section className="story-intro">
        <p>{activeStory.description}</p>
      </section>

      <section className="album-list">
        <div className="album-list__head">
          <h3>聲景選輯</h3>
          <button
            type="button"
            className="album-list__menu-btn"
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

      <section className="scene-list">
        {activeStory.scenes.map((scene, index) => (
          <article key={scene.heading} className="scene-card">
            <img
              src={scene.image}
              alt={`${activeStory.title} ${scene.heading}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="scene-card__content">
              <h4>{scene.heading}</h4>
              <p>{scene.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="comments">
        <div className="comments__head">
          <h3>社群留言</h3>
          <button
            type="button"
            onClick={() => setIsCommentsOpen((prev) => !prev)}
          >
            {isCommentsOpen ? '收起留言' : '載入留言'}
          </button>
        </div>
        {isCommentsOpen ? (
          <iframe
            key={activeStory.id}
            title={`${activeStory.title} facebook comments`}
            src={`/fb${activeStory.id - 1}.html`}
            className="comments__frame"
            loading="lazy"
          />
        ) : (
          <p className="comments__placeholder">
            為了改善首屏載入速度，留言區採用按需載入。
          </p>
        )}
      </section>
    </div>
  )
}

export default App
