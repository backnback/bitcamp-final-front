import { useEffect } from 'react';

const useScrollEnd = (onReachEnd) => {
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // 스크롤 끝 감지

            if (isAtBottom && typeof onReachEnd === 'function') {
                onReachEnd();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onReachEnd]);
};

export default useScrollEnd;
