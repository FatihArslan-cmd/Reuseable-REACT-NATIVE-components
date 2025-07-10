// hooks/useStatusBar.js
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

/**
 * 
 * @param {boolean} hidden - StatusBar gizlensin mi?
 * @param {'slide' | 'fade' | 'none'} animation - Animasyon tipi (sadece Android)
 * @param {'default' | 'light-content' | 'dark-content'} barStyle - StatusBar yazı rengi
 * @param {boolean} restoreOnUnmount - Ekrandan çıkınca eski haline dönsün mü?
 */
export const useStatusBar = (
  hidden,
  animation = 'slide',
  barStyle = 'default',
  restoreOnUnmount = false
) => {
  useEffect(() => {
    StatusBar.setHidden(hidden, animation);
    StatusBar.setBarStyle(barStyle);

    return () => {
      if (restoreOnUnmount) {
        StatusBar.setHidden(!hidden, animation);
      }
    };
  }, [hidden, animation, barStyle, restoreOnUnmount]);
};

//useStatusBar(true, 'slide', 'light-content', false);

