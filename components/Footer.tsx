
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [imgVisible, setImgVisible] = useState(true);
  const profileImgUrl = "https://scontent-cgk1-1.cdninstagram.com/v/t51.2885-19/499610567_17888034495254697_2573318821034915388_n.jpg?stp=dst-jpg_s640x640_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2QHVLWiTw3uF5ywEjntzM9kHKXiCi7ZN3--BFNuKf3llcQ3c0nYzuP18zhNNbesPE7U&_nc_ohc=EntOoQ0gS1QQ7kNvwHNEmwb&_nc_gid=ZKyz7gtUNoEXZtov7nIROg&edm=AAZTMJEBAAAA&ccb=7-5&oh=00_AfjM0jYwSYiiO-enL8ZD7OWzHbh81TWj6du5KLWtPtY-4Q&oe=691249A1&_nc_sid=49cb7f";

  return (
    <footer className="w-full text-center text-white/70 py-4 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm">
        {imgVisible && (
          <img
            src={profileImgUrl}
            alt="Profil"
            className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
            onError={() => setImgVisible(false)}
          />
        )}
        <span>© teed 2025</span>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/kang_ted/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Instagram</a>
          <a href="https://www.threads.com/@kang_ted" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Threads</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
