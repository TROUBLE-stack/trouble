
import React, { useRef, useEffect } from 'react';

interface MatrixBackgroundProps {
    isEnabled: boolean;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ isEnabled }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameId = useRef<number>(0);
    const lastFrameTime = useRef<number>(0);
    const isVisible = useRef<boolean>(true);
    const frameInterval = 60; // Locked to ~16fps for efficiency

    useEffect(() => {
        const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const handleVisibilityChange = () => {
            isVisible.current = document.visibilityState === 'visible';
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;
        
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let fontSize = 16;
        let cols = Math.floor(w / fontSize) + 1;
        let ypos = Array(cols).fill(0);

        const resizeHandler = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            cols = Math.floor(w / fontSize) + 1;
            ypos = Array(cols).fill(0);
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(0, 0, w, h);
        };

        window.addEventListener('resize', resizeHandler);

        const matrix = (timestamp: number) => {
            if (!isEnabled || !isVisible.current) {
                animationFrameId.current = requestAnimationFrame(matrix);
                return;
            }

            if (timestamp - lastFrameTime.current > frameInterval) {
                lastFrameTime.current = timestamp;
                
                ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = '#00ff41';
                ctx.font = `${fontSize}px VT323`;

                for (let i = 0; i < ypos.length; i++) {
                    const text = String.fromCharCode(Math.random() * 128);
                    const x = i * fontSize;
                    ctx.fillText(text, x, ypos[i]);

                    if (ypos[i] > 100 + Math.random() * 10000) {
                        ypos[i] = 0;
                    } else {
                        ypos[i] += fontSize;
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(matrix);
        };
        
        if (isEnabled) {
             animationFrameId.current = requestAnimationFrame(matrix);
        }

        return () => {
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isEnabled]);

    return null;
};
