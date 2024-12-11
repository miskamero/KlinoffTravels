import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.scss';

const Footer = () => {
    useEffect(() => {
        let requestId;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e) => {
            const footer = document.querySelector('.footer');
            const rect = footer.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        };

        const updatePosition = () => {
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;
            const footer = document.querySelector('.footer');
            footer.style.setProperty('--x', `${currentX}px`);
            footer.style.setProperty('--y', `${currentY}px`);
            requestId = requestAnimationFrame(updatePosition);
        };

        window.addEventListener('mousemove', handleMouseMove);
        requestId = requestAnimationFrame(updatePosition);

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