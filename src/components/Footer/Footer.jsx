import './Footer.css';
import youtube_icon from '../../assets/assets/youtube_icon.png';
import facebook_icon from '../../assets/assets/facebook_icon.png';
import twitter_icon from '../../assets/assets/twitter_icon.png';
import instagram_icon from '../../assets/assets/instagram_icon.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <img src={facebook_icon} alt="Facebook" />
        <img src={instagram_icon} alt="Instagram" />
        <img src={twitter_icon} alt="Twitter" />
        <img src={youtube_icon} alt="YouTube" />
      </div>

      <ul>
        <li>Audio Description</li>
        <li>Help Centre</li>
        <li>Gift Cards</li>
        <li>Media Centre</li>
        <li>Investor Relations</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>Legal Notices</li>
        <li>Cookie Preferences</li>
        <li>Corporate Information</li>
        <li>Contact Us</li>
      </ul>

      <button className="service-code-btn" type="button">Service Code</button>

      <p className="copyright-text">© 1997-2026 Netflix, Inc. · Built with React & Supabase</p>
    </footer>
  );
};

export default Footer;