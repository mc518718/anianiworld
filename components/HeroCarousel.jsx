'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Sliding showcase of the most-watched shows. Advances on its own; swipe, arrows or dots to move.
export default function HeroCarousel({ slides }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);
  const n = slides.length;
  const go = (k) => setI(((k % n) + n) % n);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((k) => (k + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  if (!n) return null;

  return (
    <section
      className="hc"
      aria-roledescription="carousel"
      aria-label="Anime thịnh hành"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (startX.current ?? 0);
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        startX.current = null;
        setPaused(false);
      }}
    >
      <div className="hc-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <article className="hc-slide" key={s.id} aria-hidden={k !== i}>
            {s.image && <img className="hc-bg" src={s.image} alt="" loading={k === 0 ? 'eager' : 'lazy'} />}
            <div className="hc-in">
              {s.poster && <img className="hc-poster" src={s.poster} alt={`Poster ${s.title}`} loading={k === 0 ? 'eager' : 'lazy'} />}
              <div className="hc-txt">
                <span className="kicker">Top {k + 1} thịnh hành</span>
                <h1>{s.title}</h1>
                <p className="hc-meta">{s.meta}</p>
                {s.genres.length > 0 && (
                  <div className="genres">
                    {s.genres.map((g) => (
                      <span key={g}>{g}</span>
                    ))}
                  </div>
                )}
                {s.story && <p className="hc-story">{s.story}</p>}
                <Link className="btn" href={`/series/${s.id}`} tabIndex={k === i ? 0 : -1}>
                  ▶ Xem ngay
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {n > 1 && (
        <>
          <button className="hc-arrow prev" onClick={() => go(i - 1)} aria-label="Trước">
            ‹
          </button>
          <button className="hc-arrow next" onClick={() => go(i + 1)} aria-label="Sau">
            ›
          </button>
          <div className="hc-dots">
            {slides.map((s, k) => (
              <button key={s.id} className={k === i ? 'on' : ''} onClick={() => go(k)} aria-label={`Top ${k + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
