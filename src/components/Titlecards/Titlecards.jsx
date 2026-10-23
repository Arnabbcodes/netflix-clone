import { useEffect, useRef, useState } from 'react';
import './Titlecards.css';
import cards_data from '../../assets/assets/cards/Cards_data';
import { Link } from 'react-router-dom';

const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxN2EyZmYyNDE4NjUzYWZjZmZhZjE4MzZmZTgzMWM0MyIsIm5iZiI6MTc5Mjc0MTM2My41NjksInN1YiI6IjZhZGIwZmYzOTNlMGNlMDgxOGIwZTA2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9-iDlc7wt7c8nnDD-WPpTqkXUWhLP_rtgLZkQY7NliE',
  },
};

const Titlecards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  const scroll = (direction) => {
    if (cardsRef.current) {
      const scrollAmount = direction === 'left' ? -cardsRef.current.clientWidth * 0.75 : cardsRef.current.clientWidth * 0.75;
      cardsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : 'now_playing'}?language=en-US&page=1`,
      TMDB_OPTIONS
    )
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          if (res.results && Array.isArray(res.results) && res.results.length > 0) {
            setApiData(res.results);
          } else {
            // Graceful fallback to local cards_data
            setApiData(
              cards_data.map((c, i) => ({
                id: 933260 + i,
                original_title: c.name,
                backdrop_path: null,
                localImage: c.image,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.warn('TMDB fetch error, falling back to local dataset:', err);
        if (isMounted) {
          setApiData(
            cards_data.map((c, i) => ({
              id: 933260 + i,
              original_title: c.name,
              backdrop_path: null,
              localImage: c.image,
            }))
          );
        }
      });

    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      isMounted = false;
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, [category]);

  return (
    <div className="title-cards">
      <h2 className="section-title">{title ? title : 'Top Picks For You'}</h2>
      <div className="card-slider-wrapper">
        <button
          className="slider-arrow arrow-left"
          onClick={() => scroll('left')}
          aria-label="Previous titles"
        >
          ‹
        </button>

        <div className="card-list" ref={cardsRef}>
          {apiData &&
            apiData.map((card, index) => {
              const imgSrc = card.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
                : card.localImage;

              return (
                <Link to={`/player/${card.id}`} className="card" key={card.id || index}>
                  <div className="card-img-container">
                    <img
                      src={imgSrc}
                      alt={card.original_title || 'Movie'}
                      loading="lazy"
                    />
                    <div className="card-overlay">
                      <span className="card-play-icon">▶</span>
                    </div>
                  </div>
                  <p className="card-title">{card.original_title || card.title}</p>
                </Link>
              );
            })}
        </div>

        <button
          className="slider-arrow arrow-right"
          onClick={() => scroll('right')}
          aria-label="Next titles"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Titlecards;