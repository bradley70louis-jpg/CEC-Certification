import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Layout({ children }) {
  const { user, handleLogout } = useAuth();

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #e6f0ff, #ffffff)',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <header
        style={{
          backgroundColor: '#003366',
          padding: '15px 0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          {/* 🌍 Always visible */}
          <NavButton label="Home" path="/" />

          {/* 🔐 Show when user IS logged in */}
          {user && (
            <>
              <NavButton label="Dashboard" path="/dashboard" />
              <NavButton label="Certificates" path="/certificates" />
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#b30000',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.1s ease-in-out'
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Logout
              </button>
            </>
          )}

          {/* 👤 Show when user is NOT logged in */}
          {!user && (
            <>
              <NavButton label="Login" path="/login" />
              <NavButton label="Signup" path="/signup" />
            </>
          )}
        </div>
      </header>

      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        {children}
      </main>
    </div>
  );
}

// 🧭 Reusable button component for nav links
function NavButton({ label, path }) {
  return (
    <Link
      to={path}
      style={{
        backgroundColor: '#0059b3',
        color: 'white',
        padding: '10px 18px',
        borderRadius: '8px',
        fontWeight: 'bold',
        textDecoration: 'none',
        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.1s ease-in-out'
      }}
      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {label}
    </Link>
  );
}
