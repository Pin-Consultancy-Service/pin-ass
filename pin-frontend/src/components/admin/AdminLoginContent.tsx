"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Users, DollarSign, BarChart3 } from "lucide-react";
import { login, logout } from "@/lib/auth";

export default function AdminLoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await login(email, password);
      if (user.role !== "ADMIN" && user.role !== "STAFF") {
        await logout();
        setError("This account does not have administrator access.");
        return;
      }
      router.push('/admin/dashboard');
    } catch (err) {
      const apiError = err as { body?: { detail?: string } };
      setError(apiError.body?.detail ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image 
              src="/images/pin-logo.png" 
              alt="PIN Associates" 
              width={40} 
              height={40} 
              className="object-contain" 
            />
            <span 
              className="font-bold text-xl"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
            >
              PIN Associates
            </span>
          </Link>

          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
            >
              Admin Portal
            </h1>
            <p style={{ color: 'var(--ink-muted)' }}>
              Manage the entire PIN Associates system
            </p>
          </div>

          {error && (
            <div 
              className="p-4 rounded-xl mb-6 text-sm"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--ink-faint)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pinassociates.com"
                  required
                  className="form-input pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--ink-faint)' }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input pl-12 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                  Remember me
                </span>
              </label>
              <Link 
                href="/admin/forgot-password"
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--navy)' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              <Link 
                href="/"
                className="font-semibold hover:underline"
                style={{ color: 'var(--navy)' }}
              >
                Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{ backgroundColor: 'var(--navy)' }}
      >
        <div className="max-w-md text-white">
          <h2 
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Admin Dashboard
          </h2>
          <p className="text-lg mb-8 text-white/80">
            Comprehensive system management for PIN Associates education platform
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">User Management</h3>
                <p className="text-white/70 text-sm">
                  Manage students, instructors, and admin accounts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Financial Overview</h3>
                <p className="text-white/70 text-sm">
                  Track payments, revenue, and financial reports
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">System Analytics</h3>
                <p className="text-white/70 text-sm">
                  Comprehensive reports and performance metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
