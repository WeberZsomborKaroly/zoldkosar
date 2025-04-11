import React, { useEffect, useState } from 'react';
import './BlogModal.css';

const BlogModal = ({ post, onClose }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (post) {
           
            setTimeout(() => setIsActive(true), 10);
        }
    }, [post]);

    if (!post) return null;

    const handleClose = () => {
        setIsActive(false);
        
        setTimeout(onClose, 300);
    };

    return (
        <div 
            className={`blog-modal-overlay ${isActive ? 'active' : ''}`} 
            onClick={handleClose}
        >
            <div 
                className="blog-modal-content" 
                onClick={e => e.stopPropagation()}
            >
                <button className="blog-modal-close" onClick={handleClose}>×</button>
                <img src={post.image} alt={post.title} className="blog-modal-image" />
                <div className="blog-modal-date">{post.date}</div>
                <h2 className="blog-modal-title">{post.title}</h2>
                {post.fullContent.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <div className="blog-modal-tags">
                    {post.tags.map((tag, index) => (
                        <span key={index} className="blog-modal-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogModal;
