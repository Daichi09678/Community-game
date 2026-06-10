// components/GoogleTranslate.tsx
'use client';

import { useEffect } from 'react';


declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    // Cek apakah script sudah ada
    if (document.querySelector('#google-translate-script')) {
      if (window.google && window.google.translate) {
        refreshWidget();
      }
      return;
    }

    // Inisialisasi fungsi callback global
    window.googleTranslateElementInit = () => {
      if (window.google) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,id,ja,zh-CN,ko,es,fr,de,it,pt,ru,ar,hi,th,vi,tr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Tambahkan script Google Translate
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('#google-translate-script');
      if (scriptElement) {
        scriptElement.remove();
      }
      const widgetElement = document.getElementById('google_translate_element');
      if (widgetElement) {
        widgetElement.innerHTML = '';
      }
    };
  }, []);

  const refreshWidget = () => {
    const widgetElement = document.getElementById('google_translate_element');
    if (widgetElement && window.google && window.google.translate) {
      widgetElement.innerHTML = '';
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,id,ja,zh-CN,ko,es,fr,de,it,pt,ru,ar,hi,th,vi,tr',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  };

  return (
    <div className="relative">
      <style>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-frame {
          z-index: 1000 !important;
        }
        .goog-te-gadget {
          font-family: inherit !important;
          color: inherit !important;
        }
        .goog-te-gadget-simple {
          background: rgba(200, 169, 110, 0.06) !important;
          border: 1px solid rgba(200, 169, 110, 0.2) !important;
          border-radius: 0 !important;
          padding: 6px 12px !important;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%) !important;
          cursor: pointer !important;
        }
        .goog-te-gadget-simple:hover {
          border-color: rgba(200, 169, 110, 0.5) !important;
          background: rgba(200, 169, 110, 0.1) !important;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
        .goog-te-gadget-simple span {
          color: #C8A96E !important;
          font-family: 'Rajdhani', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: bold !important;
        }
        body {
          top: 0 !important;
        }
        .VIpgJd-ZVi9M-l4eHX-hSRGPd {
          display: none !important;
        }
        iframe.goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-balloon-frame {
          display: none !important;
        }
      `}</style>
      <div id="google_translate_element" className="google-translate-container"></div>
    </div>
  );
}