import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the account. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-brass-400 uppercase mb-3">
            No. 002 — New Account
          </p>
          <h1 className="font-display italic text-4xl text-brass-50">Ledger</h1>
          <p className="text-brass-200/70 text-sm mt-2">Create your team account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-brass-50 rounded-sm p-8 shadow-2xl border-t-4 border-brass-500"
        >
          {error && (
            <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">
              Name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-ink/15 rounded px-3 py-2 bg-white focus:border-pine-500 outline-none"
              placeholder="Your name"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded px-3 py-2 bg-white focus:border-pine-500 outline-none"
              placeholder="you@company.com"
            />
          </label>

          <label className="block mb-2">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">
              Password
            </span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/15 rounded px-3 py-2 bg-white focus:border-pine-500 outline-none"
              placeholder="At least 8 characters"
            />
          </label>
          <p className="text-[11px] text-ink/40 mb-6">Minimum 8 characters.</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine-600 hover:bg-pine-500 disabled:opacity-60 text-brass-50 font-semibold py-2.5 rounded transition-colors"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-brass-200/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brass-400 hover:text-brass-200 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
