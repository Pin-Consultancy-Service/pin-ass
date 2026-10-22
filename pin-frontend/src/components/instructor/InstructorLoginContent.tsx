"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, BookOpen, Users, Award } from "lucide-react";

export default function InstructorLoginContent() {
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
      // TODO: Replace with actual instructor authentication API
      // For now, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store instructor token (demo)
      localStorage.setItem('instructor_token', 'demo-instructor-token');
      localStorage.setItem('instructor_user', JSON.stringify({
        id: 'INS001',
        first_name: 'Dr. Adebayo',
        last_name: 'Johnson',
        email: email,
        role: 'instructor'
      }));
      
      router.push('/instructor/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
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
              alt="PIN Associate" 
              width={40} 
              height={40} 
              className="object-contain" 
            />
            <span 
              className="font-bold text-xl"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
            >
              PIN Associate
            </span>
          </Link>

          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
            >
              Instructor Portal
            </h1>
            <p style={{ color: 'var(--ink-muted)' }}>
              Sign in to manage your classes and students
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
                  placeholder="instructor@pinassociate.com"
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
                href="/instructor/forgot-password"
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
              Not an instructor?{' '}
              <Link 
                href="/portal/login"
                className="font-semibold hover:underline"
                style={{ color: 'var(--navy)' }}
              >
                Student Login
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
            Instructor Dashboard
          </h2>
          <p className="text-lg mb-8 text-white/80">
            Everything you need to manage your classes and track student progress
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Manage Classes</h3>
                <p className="text-white/70 text-sm">
                  Schedule classes, upload materials, and track attendance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Track Students</h3>
                <p className="text-white/70 text-sm">
                  Monitor student performance and provide feedback
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Grade Assignments</h3>
                <p className="text-white/70 text-sm">
                  Review submissions and provide detailed assessments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
