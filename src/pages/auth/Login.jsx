import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#38BDF8]/10 to-[#0EA5E9]/5 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
            Welcome to ProjectPilot
          </h1>
          <p className="text-lg text-[#64748B] dark:text-gray-400 leading-relaxed">
            Manage projects, track tasks, and deliver results faster. 
            Your team's productivity hub.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: 'Projects', value: 'Track & Manage' },
              { label: 'Tasks', value: 'Organize Work' },
              { label: 'Analytics', value: 'Data Insights' },
              { label: 'Teams', value: 'Collaborate' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-border dark:border-dark-border"
              >
                <h3 className="font-semibold text-[#0F172A] dark:text-white">
                  {item.label}
                </h3>
                <p className="text-sm text-[#64748B]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <span className="text-4xl">🚀</span>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white mt-4">
              ProjectPilot
            </h1>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card border border-border dark:border-dark-border p-8">
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-[#64748B] dark:text-gray-400 mb-8">
              Sign in to continue to your workspace
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#38BDF8] font-medium hover:text-[#0EA5E9]"
              >
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-white dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border">
            <p className="text-xs text-[#64748B] text-center">
              <span className="font-medium">Demo Credentials:</span><br />
              Admin: admin@projectpilot.com / admin123<br />
              Member: member@projectpilot.com / member123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
