import React from 'react';
import { Music2 } from 'lucide-react';

export function Vinyl({ playing }) {
  return (
    <div className={`vinyl ${playing ? 'spin' : ''}`} aria-hidden="true">
      <div className="vinyl-center">
        <Music2 size={14} />
      </div>
    </div>
  );
}
