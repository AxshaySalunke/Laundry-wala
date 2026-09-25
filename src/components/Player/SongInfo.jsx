import React from 'react';

export function SongInfo({ title, artist, film }) {
  return (
    <div className="song-info">
      <h2>{title}</h2>
      <p>{artist}</p>
      <small>{film}</small>
    </div>
  );
}
