import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
  platform: string;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    userAgent: '',
    platform: ''
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const platform = navigator.platform || '';
      
      // Padrões para detectar dispositivos móveis
      const mobilePatterns = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Mobile/i,
        /Tablet/i
      ];
      
      // Padrões específicos para tablets
      const tabletPatterns = [
        /iPad/i,
        /Android(?!.*Mobile)/i, // Android sem "Mobile" no user agent
        /Tablet/i
      ];
      
      const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
      const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
      const isDesktop = !isMobile && !isTablet;
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        userAgent,
        platform
      });
    };

    // Detecta o dispositivo imediatamente
    detectDevice();

    // Re-detecta quando a janela é redimensionada (útil para tablets em modo desktop)
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
}; 