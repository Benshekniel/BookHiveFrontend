import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';

const SignupPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    alert(`Signed up: ${data.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: '#1E3A8A' }} // text-secondary
            onMouseOver={(e) => (e.target.style.color = '#152B70')} // hover:text-secondary-dark
            onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  {...register('name')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  style={{
                    borderColor: '#D1D5DB', // border-gray-300
                    boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)', // focus:ring-2 focus:ring-primary/50
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  style={{
                    borderColor: '#D1D5DB',
                    boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)',
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  placeholder="Email"
                />
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
                    borderColor: '#D1D5DB',
                    boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)',
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <Button type="submit" variant="primary" fullWidth>
                Signup
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;