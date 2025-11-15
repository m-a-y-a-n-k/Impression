import React, { useState } from 'react';
import '../styles/Avatar.css';

/**
 * Avatar Component
 * Displays user's Google profile picture or generates initials-based avatar
 */

export default function Avatar({ user, size = 'medium', className = '' }) {
  const [imageError, setImageError] = useState(false);

  // Get user's initials from display name or email
  const getInitials = () => {
    if (user?.displayName) {
      const nameParts = user.displayName.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return user.displayName.substring(0, 2).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Generate a consistent color based on user email or name
  const getAvatarColor = () => {
    const str = user?.email || user?.displayName || 'default';
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', text: '#ffffff' },
      { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#4a5568' },
      { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', text: '#4a5568' },
      { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', text: '#4a5568' },
      { bg: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', text: '#ffffff' },
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizeClass = `avatar-${size}`;
  const hasPhoto = user?.photoURL && !imageError;
  const avatarColor = getAvatarColor();

  const handleImageError = () => {
    setImageError(true);
  };

  if (hasPhoto) {
    return (
      <div className={`avatar ${sizeClass} ${className}`}>
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="avatar-image"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Fallback: Initials avatar
  return (
    <div
      className={`avatar avatar-initials ${sizeClass} ${className}`}
      style={{
        background: avatarColor.bg,
        color: avatarColor.text
      }}
    >
      <span className="avatar-text">{getInitials()}</span>
    </div>
  );
}

