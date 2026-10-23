import { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';

const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxN2EyZmYyNDE4NjUzYWZjZmZhZjE4MzZmZTgzMWM0MyIsIm5iZiI6MTc5Mjc0MTM2My41NjksInN1YiI6IjZhZGIwZmYzOTNlMGNlMDgxOGIwZTA2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9-iDlc7wt7c8nnDD-WPpTqkXUWhLP_rtgLZkQY7NliE',
  },
};

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState({
    name: 'Featured Netflix Trailer',
    key: 'L61p2uyiMSo', // Default Stranger Things official trailer fallback
    published_at: new Date().toISOString().slice(0, 10),
    type: 'Trailer',
  });

  useEffect(() => {
    let isMounted = true;

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, TMDB_OPTIONS)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          if (res.results && res.results.length > 0) {
            // Find trailer or teaser
            const trailer = res.results.find((v) => v.type === 'Trailer') || res.results[0];
            setApiData(trailer);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error fetching movie video:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading text="Loading Video..." />;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="player">
      <button className="back-btn" onClick={handleBack} aria-label="Go back">
        <img src={back_arrow_icon} alt="Back" />
      </button>

      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1&rel=0&modestbranding=1`}
          title={apiData.name || 'Trailer'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="player-info">
        <div className="player-meta-left">
          <h2 className="player-title">{apiData.name}</h2>
          <span className="player-tag">{apiData.type}</span>
        </div>
        <div className="player-meta-right">
          <span className="player-date">
            Released: {apiData.published_at ? apiData.published_at.slice(0, 10) : 'Recent'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;