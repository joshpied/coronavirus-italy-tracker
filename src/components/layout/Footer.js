import React from 'react';

export default function Footer() {
  return (
    <footer className="text-light">
      <a
        href="https://github.com/joshpied"
        target="_blank"
        rel="noopener noreferrer"
      >
        Josh Piedimonte
      </a>{' '}
      {new Date().getFullYear()}
    </footer>
  );
}
