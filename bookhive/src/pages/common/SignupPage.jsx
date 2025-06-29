import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';
import Button from '../../components/shared/Button';

const signupSchemaStep1 = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must match'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const signupSchemaStep2 = z.object({
  email: z.string().email('Please enter a valid email'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  district: z.string().min(2, 'District must be at least 2 characters'),
});

const signupSchemaStep3 = z.object({
  nicFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  nicBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  addressProof: z.any().refine((file) => file && file[0] && ['application/pdf', 'image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid PDF or image (JPEG/PNG)'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(
      step === 1 ? signupSchemaStep1 : step === 2 ? signupSchemaStep2 : signupSchemaStep3
    ),
  });
  const [error, setError] = useState('');

  const onSubmitStep1 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onSubmitStep2 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onSubmitStep3 = (data) => {
    setFormData({ ...formData, ...data });
    console.log('Final form data:', { ...formData, ...data });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
            <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>BookHive</span></span>
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
          <form className="space-y-6" onSubmit={handleSubmit(
            step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
          )}>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="123-456-7890"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
                      style={{ borderColor: '#D1D5DB' }}
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
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() => navigate('/login')}
                    >
                      Google
                    </button>
                    {/* <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() => navigate('/login')}
                    >
                      Facebook
                    </button> */}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    
                  >
                    Next
                  </Button>
                  
                </div>
              </>
            )}
            {step === 2 && (
              <>
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
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      id="city"
                      type="text"
                      {...register('city')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <div className="mt-1">
                    <input
                      id="district"
                      type="text"
                      {...register('district')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="Manhattan"
                    />
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary">
                    Next
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <label htmlFor="nicFront" className="block text-sm font-medium text-gray-700">
                    NIC Front
                  </label>
                  <div className="mt-1">
                    <input
                      id="nicFront"
                      type="file"
                      accept="image/jpeg,image/png"
                      {...register('nicFront', { required: true })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.nicFront && (
                      <p className="mt-1 text-sm text-red-600">{errors.nicFront.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="nicBack" className="block text-sm font-medium text-gray-700">
                    NIC Back
                  </label>
                  <div className="mt-1">
                    <input
                      id="nicBack"
                      type="file"
                      accept="image/jpeg,image/png"
                      {...register('nicBack', { required: true })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.nicBack && (
                      <p className="mt-1 text-sm text-red-600">{errors.nicBack.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="addressProof" className="block text-sm font-medium text-gray-700">
                    Address Proof (Bill/PDF)
                  </label>
                  <div className="mt-1">
                    <input
                      id="addressProof"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      {...register('addressProof', { required: true })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.addressProof && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressProof.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;