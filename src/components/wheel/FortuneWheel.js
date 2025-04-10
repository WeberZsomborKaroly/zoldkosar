import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './FortuneWheel.css';

const FortuneWheel = ({ onClose, onCouponWin }) => {
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [couponCode, setCouponCode] = useState(null);
    const canvasRef = useRef(null);
    const wheelRef = useRef(null);
    const [canSpin, setCanSpin] = useState(true);
    const [spinLimitMessage, setSpinLimitMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Define segments with their probability weights and better colors
    const segments = [
        { text: "Nem nyert", color: "#E74C3C", textColor: "#FFFFFF", probability: 0.5 },
        { text: "Új pörgetés", color: "#F1C40F", textColor: "#FFFFFF", probability: 0.3 },
        { text: "5% kedvezmény", color: "#3498DB", textColor: "#FFFFFF", probability: 0.15 },
        { text: "20% kedvezmény", color: "#2ECC71", textColor: "#FFFFFF", probability: 0.05 }
    ];

    // Check if user can spin today and if there's an active coupon
    useEffect(() => {
        const checkSpinEligibility = () => {
            // Get user from localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setCanSpin(false);
                setSpinLimitMessage('Bejelentkezés szükséges a pörgetéshez!');
                return;
            }
            
            const user = JSON.parse(userStr);
            
            // Admin users can always spin
            if (user.roles && user.roles.includes('ROLE_ADMIN')) {
                setCanSpin(true);
                setIsAdmin(true);
                return;
            }
            
            // Check if user has an active wheel coupon
            const activeCoupon = localStorage.getItem('wheelCoupon');
            if (activeCoupon) {
                const couponData = JSON.parse(activeCoupon);
                setWinner(couponData.discountText);
                setCouponCode(couponData.code);
                setCanSpin(false);
                setSpinLimitMessage('Már van egy aktív kuponod. Használd fel a vásárláshoz!');
                return;
            }
            
            // Check if user has already spun today
            const lastSpinDate = localStorage.getItem('lastWheelSpin');
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            
            if (lastSpinDate === today) {
                setCanSpin(false);
                setSpinLimitMessage('Ma már forgattad a szerencsekereket. Gyere vissza holnap!');
            } else {
                setCanSpin(true);
            }
        };
        
        checkSpinEligibility();
    }, []);

    // Draw the wheel with improved design
    useEffect(() => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 15;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw wheel outer border with gradient
        const outerGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 15);
        outerGradient.addColorStop(0, '#2C3E50');
        outerGradient.addColorStop(1, '#1A2530');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        ctx.fillStyle = outerGradient;
        ctx.fill();
        
        // Draw wheel segments
        let startAngle = 0;
        
        segments.forEach((segment, index) => {
            const sliceAngle = 2 * Math.PI * segment.probability;
            const endAngle = startAngle + sliceAngle;
            
            // Create gradient for segment
            const segmentGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            
            // Lighter version of the color for gradient
            const lighterColor = lightenColor(segment.color, 20);
            segmentGradient.addColorStop(0, lighterColor);
            segmentGradient.addColorStop(1, segment.color);
            
            // Draw segment with gradient
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segmentGradient;
            ctx.fill();
            
            // Add segment border
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            
            // Add decorative dots along the arc
            const dotCount = 10;
            for (let i = 0; i < dotCount; i++) {
                const dotAngle = startAngle + (sliceAngle * i) / dotCount;
                const dotX = centerX + (radius - 8) * Math.cos(dotAngle);
                const dotY = centerY + (radius - 8) * Math.sin(dotAngle);
                
                ctx.beginPath();
                ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
            }
            
            // Add text with rotation to fit inside segment
            const midAngle = startAngle + sliceAngle / 2;
            const textDistance = radius * 0.65;
            const textX = centerX + textDistance * Math.cos(midAngle);
            const textY = centerY + textDistance * Math.sin(midAngle);
            
            ctx.save();
            ctx.translate(textX, textY);
            
            // Special handling for "Nem nyert" to keep it straight
            if (segment.text === "Nem nyert") {
                // No rotation for "Nem nyert"
                if (midAngle > Math.PI / 2 && midAngle < Math.PI * 3 / 2) {
                    // If in bottom half, flip text to keep it readable
                    ctx.rotate(Math.PI);
                }
            } else {
                // Rotate text to follow the curve of the wheel for other segments
                ctx.rotate(midAngle);
            }
            
            // Text styling - standardize color to white for all segments
            ctx.fillStyle = '#FFFFFF';
            
            // Use smaller font for discount segments
            if (segment.text.includes("kedvezmény")) {
                ctx.font = 'bold 11px Arial'; // Even smaller font for discount text
            } else {
                ctx.font = 'bold 14px Arial'; // Regular size for other text
            }
            
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Draw text
            ctx.fillText(segment.text, 0, 0);
            ctx.restore();
            
            startAngle = endAngle;
        });
        
        // Draw decorative circles
        // Outer decorative circle with shine effect
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
        const outerCircleGradient = ctx.createLinearGradient(
            centerX - radius - 5, centerY - radius - 5,
            centerX + radius + 5, centerY + radius + 5
        );
        outerCircleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        outerCircleGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        outerCircleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
        ctx.strokeStyle = outerCircleGradient;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Inner decorative circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw center circle with 3D effect
        const centerRadius = 35;
        
        // Draw center circle shadow
        ctx.beginPath();
        ctx.arc(centerX + 2, centerY + 2, centerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(
            centerX - centerRadius/3, centerY - centerRadius/3, 0,
            centerX, centerY, centerRadius
        );
        gradient.addColorStop(0, '#3498DB');
        gradient.addColorStop(1, '#2980B9');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add highlight to center circle
        ctx.beginPath();
        ctx.arc(
            centerX - centerRadius/4,
            centerY - centerRadius/4,
            centerRadius/2,
            0, 2 * Math.PI
        );
        const highlightGradient = ctx.createRadialGradient(
            centerX - centerRadius/4, centerY - centerRadius/4, 0,
            centerX - centerRadius/4, centerY - centerRadius/4, centerRadius/2
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fill();
        
        // Add border to center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
    }, [segments]);
    
    // Helper function to lighten a color
    const lightenColor = (color, percent) => {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    };
    
    const spinWheel = () => {
        if (spinning || !canSpin) return;
        
        // Record spin for today for non-admin users
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Only record spin for regular users, not admins
            if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('lastWheelSpin', today);
                setCanSpin(false);
            }
        }
        
        setSpinning(true);
        setWinner(null);
        setCouponCode(null);
        
        // Determine the winning segment based on probabilities
        const random = Math.random();
        let cumulativeProbability = 0;
        let winningIndex = 0;
        
        for (let i = 0; i < segments.length; i++) {
            cumulativeProbability += segments[i].probability;
            if (random < cumulativeProbability) {
                winningIndex = i;
                break;
            }
        }
        
        // Calculate the rotation angle
        const spinAngle = 5 * 360 + (360 - (winningIndex * (360 / segments.length))) + Math.random() * (360 / segments.length);
        
        // Get the wheel element
        const wheel = wheelRef.current;
        if (!wheel) return;
        
        // Apply the animation
        wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        wheel.style.transform = `rotate(${spinAngle}deg)`;
        
        // After animation completes, show the result
        setTimeout(() => {
            setSpinning(false);
            handleWheelFinished(segments[winningIndex].text);
            
            // Reset the wheel position for next spin
            setTimeout(() => {
                wheel.style.transition = 'none';
                wheel.style.transform = 'rotate(0deg)';
            }, 500);
        }, 5000);
    };

    const handleWheelFinished = async (winningSegment) => {
        setWinner(winningSegment);

        if (winningSegment === "Új pörgetés") {
            // Allow spinning again after a short delay
            setTimeout(() => {
                setWinner(null);
                setCanSpin(true); // Reset spin limit for "Új pörgetés" result
            }, 2000);
            return;
        }

        if (winningSegment.includes("kedvezmény")) {
            try {
                // Get the discount percentage from the winning segment
                const discountPercent = parseInt(winningSegment.match(/\d+/)[0]);
                
                // Only proceed if user is logged in
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    console.error('Felhasználó nincs bejelentkezve');
                    return;
                }
                
                const user = JSON.parse(userStr);
                const token = user.accessToken;
                
                // Generate a random coupon code
                const randomCode = 'WHEEL' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                
                // Create the coupon in the database
                const response = await axios.post(
                    'http://localhost:3001/api/admin/kuponok',
                    {
                        kod: randomCode,
                        kedvezmeny_tipus: 'szazalek',
                        ertek: discountPercent,
                        minimum_osszeg: 0,
                        felhasznalhato: 1,
                        aktiv: true,
                        ervenyes_kezdete: new Date().toISOString().split('T')[0],
                        ervenyes_vege: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Valid for 7 days
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                setCouponCode(randomCode);
                
                // Save the coupon to localStorage to persist until purchase
                localStorage.setItem('wheelCoupon', JSON.stringify({
                    code: randomCode,
                    discount: discountPercent,
                    discountText: winningSegment,
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }));
                
                // Call the callback function with the coupon data
                if (onCouponWin) {
                    onCouponWin({
                        code: randomCode,
                        discount: discountPercent
                    });
                }
            } catch (error) {
                console.error('Hiba a kupon létrehozásakor:', error);
            }
        }
    };

    const handleSpinAgain = () => {
        setWinner(null);
        setCouponCode(null);
    };
    
    const handleRemoveCoupon = () => {
        // Remove the coupon from localStorage
        localStorage.removeItem('wheelCoupon');
        setWinner(null);
        setCouponCode(null);
        
        // Allow spinning again
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastWheelSpin', today);
        setCanSpin(false);
        setSpinLimitMessage('Ma már forgattad a szerencsekereket. Gyere vissza holnap!');
    };

    return (
        <div className="fortune-wheel-container">
            <div className="fortune-wheel-content">
                <div className="close-button-container">
                    <button className="fortune-wheel-close" onClick={onClose}>×</button>
                </div>
                
                <h2 className="fortune-wheel-title">Szerencsekerék</h2>
                <p className="fortune-wheel-subtitle">Pörgesd meg a kereket és nyerj kedvezményt!</p>
                
                {!winner ? (
                    <div className="wheel-wrapper">
                        <div className="wheel-container">
                            <div className="wheel-pointer"></div>
                            <div className="wheel-outer" ref={wheelRef}>
                                <canvas 
                                    ref={canvasRef} 
                                    width="300" 
                                    height="300" 
                                    className="wheel-canvas"
                                />
                            </div>
                        </div>
                        
                        {!canSpin && !spinning && !winner && !isAdmin && (
                            <div className="spin-limit-message">
                                <p>{spinLimitMessage}</p>
                            </div>
                        )}
                        
                        {isAdmin && (
                            <div className="admin-message">
                                <p>Admin felhasználóként korlátlanul pörgethetsz.</p>
                            </div>
                        )}
                        
                        <button 
                            className={`spin-button ${!canSpin && 'disabled'}`}
                            onClick={spinWheel}
                            disabled={spinning || !canSpin}
                        >
                            {spinning ? 'PÖRÖG...' : 'PÖRGETÉS'}
                        </button>
                    </div>
                ) : (
                    <div className="wheel-result">
                        <h3>{winner}</h3>
                        
                        {winner === "Nem nyert" && (
                            <div>
                                <p>Sajnos most nem nyertél, próbáld újra{!isAdmin && " holnap"}!</p>
                                <button className="wheel-button" onClick={isAdmin ? handleSpinAgain : onClose}>
                                    {isAdmin ? "ÚJRA PÖRGETÉS" : "BEZÁRÁS"}
                                </button>
                            </div>
                        )}
                        
                        {winner === "Új pörgetés" && (
                            <div>
                                <p>Újra pörgethetsz!</p>
                                <button className="wheel-button" onClick={handleSpinAgain}>ÚJRA PÖRGETÉS</button>
                            </div>
                        )}
                        
                        {winner.includes("kedvezmény") && couponCode && (
                            <div className="coupon-win">
                                <p>Gratulálunk! Nyertél egy {winner} kupont!</p>
                                <div className="coupon-code">
                                    <span>{couponCode}</span>
                                </div>
                                <p className="coupon-info">A kupon a következő vásárlásig érvényes és a kosárban válthatod be.</p>
                                <div className="coupon-buttons">
                                    <button className="wheel-button" onClick={onClose}>
                                        BEZÁRÁS
                                    </button>
                                    {!isAdmin && (
                                        <button className="wheel-button remove-coupon" onClick={handleRemoveCoupon}>
                                            KUPON TÖRLÉSE
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FortuneWheel;
