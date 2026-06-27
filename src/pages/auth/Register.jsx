import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Create Your Workspace
          </h1>
          <p className="text-lg text-[#64748B] dark:text-gray-400 leading-relaxed">
            Start managing projects with confidence. 
            Join thousands of teams using ProjectPilot.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up in seconds' },
              { step: '2', title: 'Set Up Projects', desc: 'Define your workflow' },
              { step: '3', title: 'Manage Tasks', desc: 'Track progress easily' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8] font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A] dark:text-white text-sm">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#64748B]">{item.desc}</p>
                </div>
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
              Create Account
            </h2>
            <p className="text-sm text-[#64748B] dark:text-gray-400 mb-8">
              Start your journey with ProjectPilot
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-xs text-danger mt-1">{errors.name.message}</p>
                )}
              </div>

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
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className="input-field"
                  placeholder="Min 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (v) => v === watch('password') || 'Passwords do not match',
                  })}
                  className="input-field"
                  placeholder="Repeat your password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="input-field"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#38BDF8] font-medium hover:text-[#0EA5E9]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
