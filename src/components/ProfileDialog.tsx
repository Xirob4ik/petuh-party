import React, { useRef, useState } from 'react';
import { LIMITS } from '../../shared/types';
import { isSoundOn, playChime, setSoundOn } from '../lib/sound';
import { AVATAR_COLORS, type UserProfile } from '../lib/user';
import { compressImage } from '../lib/util';
import { InstallButton } from './Extras';
import { Avatar, Dialog, toast } from './ui';

export function ProfileDialog({
  user,
  onSave,
  onClose,
}: {
  user: UserProfile;
  onSave: (u: UserProfile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [color, setColor] = useState(user.color);
  const [sound, setSound] = useState(isSoundOn());
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      let data = await compressImage(file, 192, 0.85, true);
      if (data.length > LIMITS.avatar) data = await compressImage(file, 128, 0.7, true);
      setAvatar(data);
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().slice(0, LIMITS.name);
    if (!n) return;
    setSoundOn(sound);
    onSave({ ...user, name: n, avatar, color });
    onClose();
  };

  return (
    <Dialog title="Профиль" onClose={onClose}>
      <form className="profile" onSubmit={save}>
        <div className="profile-avatar">
          <Avatar name={name || '?'} avatar={avatar} color={color} size={72} />
          <div className="profile-avatar-actions">
            <button type="button" className="btn ghost small" onClick={() => fileRef.current?.click()}>
              Загрузить фото
            </button>
            {avatar && (
              <button type="button" className="btn ghost small" onClick={() => setAvatar(null)}>
                Убрать фото
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
          </div>
        </div>

        {!avatar && (
          <div className="swatches" role="radiogroup" aria-label="Цвет аватара">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={c === color}
                aria-label={c}
                className={`swatch${c === color ? ' on' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        )}

        <label className="label" htmlFor="profile-name">
          Имя, которое видят в комнате
        </label>
        <input
          id="profile-name"
          className="field"
          value={name}
          maxLength={LIMITS.name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="nickname"
        />

        <label className="toggle">
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => {
              setSound(e.target.checked);
              if (e.target.checked) {
                setSoundOn(true);
                playChime();
              }
            }}
          />
          <span>Звуки сообщений и реакций</span>
        </label>

        <div className="profile-install">
          <InstallButton wide />
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn primary" disabled={!name.trim()}>
            Сохранить
          </button>
        </div>
      </form>
    </Dialog>
  );
}
