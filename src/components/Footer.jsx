import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.scss';

const Footer = () => {
    useEffect(() => {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let requestId;
    
        const handleMouseMove = (e) => {
            if (!requestId) {
                requestId = requestAnimationFrame(() => {
                    const footer = document.querySelector('.footer');
                    const rect = footer.getBoundingClientRect();
                    targetX = e.clientX - rect.left;
                    targetY = e.clientY - rect.top;
                    requestId = null;
                });
            }
        };
    
        const updatePosition = () => {
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;
            const footer = document.querySelector('.footer');
            footer.style.setProperty('--x', `${currentX}px`);
            footer.style.setProperty('--y', `${currentY}px`);
            requestAnimationFrame(updatePosition);
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        requestAnimationFrame(updatePosition);
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestId);
        };
    }, []);

    return (
        <footer className="footer">
            <div className="footerContent">
                <p>&copy; 2023 Klinoff Travels</p>
                <p>All rights reserved.</p>
                <p>
                    <Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;