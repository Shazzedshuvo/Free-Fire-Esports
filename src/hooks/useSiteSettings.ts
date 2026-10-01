'use client';

import { useState, useEffect } from 'react';
import { OFFICIAL_DEPOSIT_NUMBER } from '@/components/DepositModal';

export interface SiteSettings {
  site_name: string;
  bkash_number: string;
  support_whatsapp: string;
  support_telegram: string;
  youtube_live_url: string;
  facebook_live_url: string;
  notice_text: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Free Fire Esports BD',
  bkash_number: OFFICIAL_DEPOSIT_NUMBER,
  support_whatsapp: OFFICIAL_DEPOSIT_NUMBER,
  support_telegram: 'https://t.me/ff_esports_bd',
  youtube_live_url: 'https://www.youtube.com/@FreeFireEsportsBD/live',
  facebook_live_url: 'https://www.facebook.com',
  notice_text: 'টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
};

let cachedSettings: SiteSettings = { ...defaultSettings };
let isLoaded = false;
const listeners = new Set<(s: SiteSettings) => void>();

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings);

  useEffect(() => {
    const handler = (newSettings: SiteSettings) => setSettings(newSettings);
    listeners.add(handler);

    if (!isLoaded) {
      isLoaded = true;
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.settings) {
            cachedSettings = { ...defaultSettings, ...data.settings };
            listeners.forEach((l) => l(cachedSettings));
          }
        })
        .catch(() => {});
    } else {
      setSettings(cachedSettings);
    }

    return () => {
      listeners.delete(handler);
    };
  }, []);

  return { settings };
}

export function updateCachedSettings(newSettings: Partial<SiteSettings>) {
  cachedSettings = { ...cachedSettings, ...newSettings };
  listeners.forEach((l) => l(cachedSettings));
}
