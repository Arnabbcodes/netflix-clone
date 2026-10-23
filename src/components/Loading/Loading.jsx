import './Loading.css';
import logo from '../../assets/assets/logo.png';
import netflix_spinner from '../../assets/assets/netflix_spinner.gif';

const Loading = ({ text = '' }) => {
  return (
    <div className="netflix-loader-container" role="status" aria-label="Loading Netflix">
      <div className="netflix-loader-content">
        <img src={logo} alt="Netflix" className="netflix-loader-logo" />
        <div className="netflix-spinner-wrapper">
          <img src={netflix_spinner} alt="Loading..." className="netflix-gif-spinner" />
          {/* High-res CSS Netflix Red Ring fallback overlay */}
          <div className="netflix-ring-spinner" />
        </div>
        {text && <p className="netflix-loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
