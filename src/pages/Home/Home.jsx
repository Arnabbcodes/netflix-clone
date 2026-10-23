import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import hero_banner from '../../assets/assets/hero_banner.jpg';
import hero_title from '../../assets/assets/hero_title.png';
import play_icon from '../../assets/assets/play_icon.png';
import info_icon from '../../assets/assets/info_icon.png';
import Titlecards from '../../components/Titlecards/Titlecards';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar user={user} />
      <div className="hero">
        <img src={hero_banner} alt="The Protector" className="banner-img" />
        <div className="hero-gradient-overlay"></div>
        <div className="hero-caption">
          <img src={hero_title} alt="The Protector Title" className="caption-img" />
          <p className="hero-description">
            Discovering his ties to a secret organization, a young man living in modern
            Istanbul embarks on a quest to save the city from an immortal enemy.
          </p>
          <div className="hero-btns">
            <button className="btn" onClick={() => navigate('/player/933260')}>
              <img src={play_icon} alt="" /> Play
            </button>
            <button className="btn dark-btn" onClick={() => navigate('/player/933260')}>
              <img src={info_icon} alt="" /> More Info
            </button>
          </div>
          <div className="hero-titlecards-wrapper">
            <Titlecards title="Popular on Netflix" category="popular" />
          </div>
        </div>
      </div>
      <div className="more-cards">
        <Titlecards title="Blockbuster Movies" category="top_rated" />
        <Titlecards title="Only on Netflix" category="popular" />
        <Titlecards title="Upcoming Releases" category="upcoming" />
        <Titlecards title="Top Picks For You" category="now_playing" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
