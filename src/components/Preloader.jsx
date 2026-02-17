
import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Keep visible for at least 3.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 3500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className="preloader-overlay">
            <div className="preloader-content">
                <h1 className="preloader-text">Welcome to Renee</h1>
                <p className="preloader-subtext">Premium Agric Food Value Chain</p>
                <div className="loading-line-container">
                    <div className="loading-line"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
