import React from 'react';

const Hero = ({ title, subtitle, bgImage, ctaButtons }) => (
    // Use a generic gradient background if no image is provided, or a specific image
    <section className="hero" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
        <div className="container hero-content text-center">
            <h1>{title}</h1>
            <p>{subtitle}</p>

            {ctaButtons && (
                <div className="flex justify-center gap-4">
                    {ctaButtons.map((btn, idx) => (
                        <a key={idx} href={btn.link} className={`btn ${btn.secondary ? 'btn-secondary' : 'btn-primary'}`}>
                            {btn.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    </section>
);

export default Hero;
