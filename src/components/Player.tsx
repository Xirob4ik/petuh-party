import React, { useEffect, useRef } from 'react';
import type { Source, VideoState } from '../../shared/types';
import type { RoomClient } from '../lib/net';
import { Html5Adapter, IframeAdapter } from '../player/html5';
import { RutubeAdapter } from '../player/rutube';
import { SyncEngine, type SyncInfo } from '../player/sync';
import type { PlayerAdapter } from '../player/types';
import { VkAdapter } from '../player/vk';
import { YouTubeAdapter } from '../player/youtube';

function createAdapter(s: Source): PlayerAdapter {
  switch (s.kind) {
    case 'vk':
      return new VkAdapter(s);
    case 'youtube':
      return new YouTubeAdapter(s.id);
    case 'rutube':
      return new RutubeAdapter(s);
    case 'file':
      return new Html5Adapter(s);
    case 'iframe':
      return new IframeAdapter(s.url);
  }
}

interface Props {
  video: VideoState & { source: Source };
  client: RoomClient;
  onInfo: (info: SyncInfo) => void;
  onEngine: (e: SyncEngine | null) => void;
}

export function Player({ video, client, onInfo, onEngine }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SyncEngine | null>(null);
  const videoRef = useRef(video);
  videoRef.current = video;
  const cb = useRef({ onInfo, onEngine });
  cb.current = { onInfo, onEngine };

  // Пересоздаём плеер только при смене самого видео
  const sourceKey = JSON.stringify(video.source);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const engine = new SyncEngine(createAdapter(videoRef.current.source), videoRef.current, {
      now: () => client.serverNow(),
      send: (action, pos) => client.send({ t: 'ctl', action, pos }),
      onInfo: (i) => cb.current.onInfo(i),
    });
    engineRef.current = engine;
    cb.current.onEngine(engine);
    engine.mount(host);

    // отчёт о своей позиции — для списка зрителей
    const report = window.setInterval(() => client.send({ t: 'pos', ...engine.report() }), 2000);
    const onVisible = () => document.visibilityState === 'visible' && engine.resync();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(report);
      document.removeEventListener('visibilitychange', onVisible);
      engine.destroy();
      engineRef.current = null;
      cb.current.onEngine(null);
      host.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, client]);

  useEffect(() => {
    engineRef.current?.setState(video);
  }, [video]);

  return <div className="screen-host" ref={hostRef} />;
}
