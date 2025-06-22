import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';
import Button from '../../components/shared/Button';

const signupSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters').max(20),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must match'),
  role: z.enum(['USER', 'SELLER', 'ORGANIZATION', 'BOOKSTORE'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  nic: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const response = await signupUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        nic: data.nic || '',
        address: data.address,
      });
      localStorage.setItem('token', response.token);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
                <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                  <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
                  <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>Hive</span></span>
                </div>
              </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: '#407aff' }}
            onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
            onMouseOut={(e) => (e.target.style.color = '#407aff')}
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
  <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="mt-1">
          <input
            id="username"
            type="text"
            {...register('username')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            {...register('role')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          >
            <option value="USER">User</option>
            <option value="SELLER">Seller</option>
            <option value="ORGANIZATION">Organization</option>
            <option value="BOOKSTORE">Bookstore</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
          NIC (optional)
        </label>
        <div className="mt-1">
          <input
            id="nic"
            type="text"
            {...register('nic')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="e.g., 123456789V"
          />
          {errors.nic && (
            <p className="mt-1 text-sm text-red-600">{errors.nic.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1">
          <textarea
            id="address"
            {...register('address')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none h-20 resize-none"
            style={{
              borderColor: '#D1D5DB'
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            required
            className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-yellow"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to Terms and Conditions
          </label>
        </div>
      </div>

      <div>
        <Button type="submit" variant="primary" fullWidth>
          Sign up
        </Button>
      </div>
    </form>

    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          Google
        </button>
        <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          Facebook
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default SignupPage;