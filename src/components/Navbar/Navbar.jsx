import { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/assets/logo.png';
import search_icon from '../../assets/assets/search_icon.svg';
import bell_icon from '../../assets/assets/bell_icon.svg';
import profile_img from '../../assets/assets/profile_img.png';
import caret_icon from '../../assets/assets/caret_icon.svg';
import { authService } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ user }) => {
  const navRef = useRef();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY >= 80) {
          navRef.current.classList.add('nav-dark');
        } else {
          navRef.current.classList.remove('nav-dark');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast.info('Signed out of Netflix. See you soon!', { theme: 'dark' });
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Error signing out', { theme: 'dark' });
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          alt="Netflix"
          className="nav-logo"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Desktop Navigation Links */}
        <ul className="nav-links desktop-links">
          <li className="active" onClick={() => navigate('/')}>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>

        {/* Mobile Browse Dropdown Button */}
        <div className="mobile-browse-wrapper">
          <button
            className="mobile-browse-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Browse <img src={caret_icon} alt="" className={`caret ${mobileMenuOpen ? 'open' : ''}`} />
          </button>

          {mobileMenuOpen && (
            <div className="mobile-dropdown-menu">
              <div className="mobile-menu-arrow"></div>
              <ul>
                <li onClick={() => setMobileMenuOpen(false)}>Home</li>
                <li onClick={() => setMobileMenuOpen(false)}>TV Shows</li>
                <li onClick={() => setMobileMenuOpen(false)}>Movies</li>
                <li onClick={() => setMobileMenuOpen(false)}>New & Popular</li>
                <li onClick={() => setMobileMenuOpen(false)}>My List</li>
                <li onClick={() => setMobileMenuOpen(false)}>Browse by Languages</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Interactive Search Bar */}
        <div className={`nav-search-box ${searchOpen ? 'open' : ''}`}>
          <img
            src={search_icon}
            alt="Search"
            className="icons search-icon"
            onClick={() => setSearchOpen(!searchOpen)}
          />
          {searchOpen && (
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          )}
        </div>

        <span className="nav-kids-label">Children</span>

        <div className="notification-wrapper">
          <img src={bell_icon} alt="Notifications" className="icons" />
        </div>

        {/* Profile Dropdown */}
        <div
          className="navbar-profile"
          onMouseEnter={() => setProfileDropdownOpen(true)}
          onMouseLeave={() => setProfileDropdownOpen(false)}
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
        >
          <img
            src={user?.user_metadata?.avatar_url || profile_img}
            alt="Profile"
            className="profile"
          />
          <img src={caret_icon} alt="" className={`caret ${profileDropdownOpen ? 'open' : ''}`} />

          {profileDropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-user-info">
                <span className="user-greeting">Signed in as</span>
                <strong className="user-name">{displayName}</strong>
                <span className="user-email">{user?.email}</span>
              </div>
              <div className="dropdown-divider"></div>
              <p className="dropdown-item">Account</p>
              <p className="dropdown-item">Help Centre</p>
              <div className="dropdown-divider"></div>
              <p className="dropdown-item signout-btn" onClick={handleSignOut}>
                Sign Out of Netflix
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
