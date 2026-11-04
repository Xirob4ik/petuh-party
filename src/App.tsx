import React, { useCallback, useEffect, useState } from 'react';
import { Home } from './components/Home';
import { ProfileDialog } from './components/ProfileDialog';
import { Room } from './components/Room';
import { Toasts } from './components/ui';
import { loadProfile, saveProfile, type UserProfile } from './lib/user';
import { roomFromPath } from './lib/util';

export interface Nav {
  room: string | null;
  /** пришли кликом внутри приложения — браузер уже разрешил автозапуск */
  activated: boolean;
  /** видео, которое нужно включить сразу после входа */
  initialUrl?: string;
}

export default function App() {
  const [user, setUser] = useState<UserProfile>(loadProfile);
  const [nav, setNav] = useState<Nav>(() => ({ room: roomFromPath(), activated: false }));
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setNav({ room: roomFromPath(), activated: true });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((room: string | null, initialUrl?: string) => {
    history.pushState({}, '', room ? `/room/${room}` : '/');
    setNav({ room, activated: true, initialUrl });
  }, []);

  const updateUser = useCallback((u: UserProfile) => {
    setUser(u);
    saveProfile(u);
  }, []);

  useEffect(() => {
    document.title = nav.room ? `Комната ${nav.room} — Petuh Party` : 'Petuh Party — смотрите видео вместе';
  }, [nav.room]);

  return (
    <>
      {nav.room ? (
        <Room
          key={nav.room}
          roomId={nav.room}
          nav={nav}
          user={user}
          onUserChange={updateUser}
          onHome={() => go(null)}
          onOpenProfile={() => setProfileOpen(true)}
        />
      ) : (
        <Home user={user} onGo={go} onOpenProfile={() => setProfileOpen(true)} />
      )}
      {profileOpen && <ProfileDialog user={user} onSave={updateUser} onClose={() => setProfileOpen(false)} />}
      <Toasts />
    </>
  );
}
