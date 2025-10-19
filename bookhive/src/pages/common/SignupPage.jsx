import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';
import Button from '../../components/shared/Button';
import axios from "axios";
import { showMessageCard } from './MessageCard';

const signupSchemaStep1 = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string()
    .regex(/^\d+$/, 'Phone must contain only numbers')
    .min(10, 'Phone must be at least 10 digits')
    .max(10, 'Phone must not exceed 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must match'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip Code must be at least 5 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const signupSchemaStep2 = z.object({
  role: z.enum(['user', 'bookstore', 'organization', 'delivery-agent'], 'Please select a role'),
});

const userSchemaStep3 = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  idType: z.enum(['nic', 'passport'], 'Please select ID type'),
  idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  billImage: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
  gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
});

const bookstoreSchemaStep3 = z.object({
  storeRegistrationNo: z.string().min(1, 'Store Registration No is required'),
  registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
  runningYear: z.string().min(1, 'Running Year is required'),
});

const organizationSchemaStep3 = z.object({
  organizationType: z.string().min(1, 'Organization Type is required'),
  registrationNo: z.string().min(1, 'Registration No is required'),
  registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
  runningYears: z.string().min(1, 'Running Years is required'),
});

const deliveryAgentSchemaStep3 = z.object({
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
  idType: z.enum(['nic', 'passport'], 'Please select ID type'),
  idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
  hub: z.string().min(1, 'Hub is required'),
  vehicleType: z.string().min(1, 'Vehicle Type is required'),
  vehicleRC: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const getSchemaForStep = () => {
    if (step === 1) return signupSchemaStep1;
    if (step === 2) return signupSchemaStep2;
    if (step === 3) {
      switch (selectedRole) {
        case 'user': return userSchemaStep3;
        case 'bookstore': return bookstoreSchemaStep3;
        case 'organization': return organizationSchemaStep3;
        case 'delivery-agent': return deliveryAgentSchemaStep3;
        default: return userSchemaStep3;
      }
    }
    return signupSchemaStep1;
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(getSchemaForStep()),
  });
  const [error, setError] = useState('');

  const onSubmitStep1 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
    reset();
  };

  const onSubmitStep2 = (data) => {
    setFormData({ ...formData, ...data });
    setSelectedRole(data.role);
    setStep(3);
    reset();
  };

  const onSubmitStep3 = async (data) => {
    const allData = { ...formData, ...data };
    setFormData(allData);

    if (selectedRole === 'user') {
      const idFrontFile = allData.idFront?.[0];
      const idBackFile = allData.idBack?.[0];
      const billImageFile = allData.billImage?.[0];

      // Validate file uploads
      if (!idFrontFile || !idBackFile || !billImageFile) {
        setError('ID Front, ID Back, and Bill Image are required');
        alert('ID Front, ID Back, and Bill Image are required');
        return;
      }

      // Create FormData and append JSON + files
      const formDataToSend = new FormData();

      // Append files
      formDataToSend.append('idFront', idFrontFile);
      formDataToSend.append('idBack', idBackFile);
      formDataToSend.append('billImage', billImageFile);

      // Create JSON and append as Blob
      const userData = {
        email: allData.email,
        password: allData.password,
        fname: allData.firstName,
        lname: allData.lastName,
        phone: parseInt(allData.phone.slice(0, 10), 10),
        dob: allData.dob,
        idType: allData.idType,
        gender: allData.gender,
        address: allData.address,
        city: allData.city,
        state: allData.state,
        zip: allData.zipCode,
      };

      const jsonBlob = new Blob([JSON.stringify(userData)], {
        type: 'application/json',
      });

      formDataToSend.append('userData', jsonBlob);

      try {
        setIsLoading(true); // Start loading animation
        const response = await axios.post(
          'http://localhost:9090/api/registerUser', // Updated endpoint
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const result = response.data;

        if (result.message === 'success&pending') {
          // Show card for pending verification
          showMessageCard(
            'Your account request has been received!',
            'We are currently verifying your information. Please check your email for updates.',
            'info'
          );
        } else if (result.message === 'success&active') {
          // Show card for successful account creation
          showMessageCard(
            'Account Created Successfully!',
            'You can now log in to your account.',
            'success'
          );
          setTimeout(() => navigate('/login'), 2000);
        } else {
          // Any other response, treat as error
          showMessageCard(
            'Error',
            'Something went wrong: ' + result.message,
            'error'
          );
          setError(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        const errMsg =
          'Something went wrong: ' +
          (error.response?.data?.message || error.message);
        showMessageCard('Error', errMsg, 'error');
        setError(errMsg);
      } finally {
        setIsLoading(false); // Stop loading animation
      }
    } else if (selectedRole === 'organization') {
      const registrationCopyFile = allData.registrationCopy?.[0];

      if (!registrationCopyFile) {
        setError('Registration copy is required');
        alert('Registration copy is required');
        return;
      }

      // Create FormData and append JSON + file
      const formDataToSend = new FormData();

      // Append file
      formDataToSend.append('registrationCopyFile', registrationCopyFile);

      // Create JSON and append as Blob
      const orgData = {
        type: allData.organizationType,
        reg_no: allData.registrationNo,
        fname: allData.firstName,
        lname: allData.lastName,
        email: allData.email,
        password: allData.password,
        phone: parseInt(allData.phone.slice(0, 10), 10),
        years: parseInt(allData.runningYears, 10),
        address: allData.address,
        city: allData.city,
        state: allData.state,
        zip: allData.zipCode
      };

      const jsonBlob = new Blob([JSON.stringify(orgData)], {
        type: 'application/json'
      });

      formDataToSend.append('orgData', jsonBlob);

      try {
        setIsLoading(true); // Start loading animation
        const response = await axios.post('http://localhost:9090/api/registerOrg', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const result = response.data;

        if (result.message === 'success&pending') {
          // Show card for pending verification
          showMessageCard(
            'Your account request has been received!',
            'We are currently verifying your information. Please check your email for updates.',
            'info'
          );
        } else if (result.message === 'success&active') {
          // Show card for successful account creation
          showMessageCard(
            'Account Created Successfully!',
            'You can now log in to your account.',
            'success'
          );
          setTimeout(() => navigate('/login'), 2000);
        } else {
          // Any other response, treat as error
          showMessageCard(
            'Error',
            'Something went wrong: ' + result.message,
            'error'
          );
          setError(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        const errMsg =
          'Something went wrong: ' +
          (error.response?.data?.message || error.message);
        showMessageCard('Error', errMsg, 'error');
        setError(errMsg);
      } finally {
        setIsLoading(false); // Stop loading animation
      }
    } else {
      navigate('/login');
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User (Buyer, Borrower, Lender, Seller)' },
    { value: 'bookstore', label: 'Book Store' },
    { value: 'organization', label: 'Organization' },
    // { value: 'delivery-agent', label: 'Delivery Agent' },
  ];

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
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          {isLoading && (
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Processing...</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(
            step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
          )}>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
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
                    Phone Number
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="address"
                      type="text"
                      {...register('address')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        id="state"
                        type="text"
                        {...register('state')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                        placeholder="NY"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="zipCode"
                        type="text"
                        {...register('zipCode')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                        placeholder="10001"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
                    </div>
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
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary">
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Your Role
                  </label>
                  <div className="space-y-3">
                    {roleOptions.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={option.value}
                          type="radio"
                          value={option.value}
                          {...register('role')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={option.value} className="ml-3 block text-sm text-gray-900">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
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

            {step === 3 && selectedRole === 'user' && (
              <>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      id="dob"
                      type="date"
                      {...register('dob')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="nic"
                        type="radio"
                        value="nic"
                        {...register('idType')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="nic" className="ml-2 block text-sm text-gray-900">
                        NIC
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="passport"
                        type="radio"
                        value="passport"
                        {...register('idType')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="passport" className="ml-2 block text-sm text-gray-900">
                        Passport
                      </label>
                    </div>
                  </div>
                  {errors.idType && (
                    <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
                      ID Front
                    </label>
                    <div className="mt-1">
                      <input
                        id="idFront"
                        type="file"
                        accept="image/jpeg,image/png"
                        {...register('idFront')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                      {errors.idFront && (
                        <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
                      ID Back
                    </label>
                    <div className="mt-1">
                      <input
                        id="idBack"
                        type="file"
                        accept="image/jpeg,image/png"
                        {...register('idBack')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                      {errors.idBack && (
                        <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="billImage" className="block text-sm font-medium text-gray-700">
                    Bill Image (Address Proof)
                  </label>
                  <div className="mt-1">
                    <input
                      id="billImage"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      {...register('billImage')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.billImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.billImage.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="male"
                        type="radio"
                        value="male"
                        {...register('gender')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
                        Male
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="female"
                        type="radio"
                        value="female"
                        {...register('gender')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
                        Female
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="other"
                        type="radio"
                        value="other"
                        {...register('gender')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
                        Other
                      </label>
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && selectedRole === 'bookstore' && (
              <>
                <div>
                  <label htmlFor="storeRegistrationNo" className="block text-sm font-medium text-gray-700">
                    Store Registration No
                  </label>
                  <div className="mt-1">
                    <input
                      id="storeRegistrationNo"
                      type="text"
                      {...register('storeRegistrationNo')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="REG123456"
                    />
                    {errors.storeRegistrationNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.storeRegistrationNo.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
                    Registration Copy
                  </label>
                  <div className="mt-1">
                    <input
                      id="registrationCopy"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      {...register('registrationCopy')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.registrationCopy && (
                      <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="runningYear" className="block text-sm font-medium text-gray-700">
                    Running Year
                  </label>
                  <div className="mt-1">
                    <input
                      id="runningYear"
                      type="number"
                      {...register('runningYear')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="2020"
                    />
                    {errors.runningYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.runningYear.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && selectedRole === 'organization' && (
              <>
                <div>
                  <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
                    Organization Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="organizationType"
                      {...register('organizationType')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    >
                      <option value="">Select organization type</option>
                      <option value="nonprofit">Non-Profit</option>
                      <option value="government">Government</option>
                      <option value="educational">Educational Institution</option>
                      <option value="library">Library</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.organizationType && (
                      <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
                    Registration No
                  </label>
                  <div className="mt-1">
                    <input
                      id="registrationNo"
                      type="text"
                      {...register('registrationNo')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="ORG123456"
                    />
                    {errors.registrationNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
                    Registration Copy
                  </label>
                  <div className="mt-1">
                    <input
                      id="registrationCopy"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      {...register('registrationCopy')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.registrationCopy && (
                      <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="runningYears" className="block text-sm font-medium text-gray-700">
                    Running Years
                  </label>
                  <div className="mt-1">
                    <input
                      id="runningYears"
                      type="number"
                      {...register('runningYears')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      placeholder="5"
                    />
                    {errors.runningYears && (
                      <p className="mt-1 text-sm text-red-600">{errors.runningYears.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && selectedRole === 'delivery-agent' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <div className="mt-1">
                      <input
                        id="age"
                        type="number"
                        {...register('age')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                        placeholder="25"
                      />
                      {errors.age && (
                        <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="male-agent"
                          type="radio"
                          value="male"
                          {...register('gender')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="male-agent" className="ml-2 block text-sm text-gray-900">
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="female-agent"
                          type="radio"
                          value="female"
                          {...register('gender')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="female-agent" className="ml-2 block text-sm text-gray-900">
                          Female
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="other-agent"
                          type="radio"
                          value="other"
                          {...register('gender')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="other-agent" className="ml-2 block text-sm text-gray-900">
                          Other
                        </label>
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="nic-agent"
                        type="radio"
                        value="nic"
                        {...register('idType')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="nic-agent" className="ml-2 block text-sm text-gray-900">
                        NIC
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="passport-agent"
                        type="radio"
                        value="passport"
                        {...register('idType')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="passport-agent" className="ml-2 block text-sm text-gray-900">
                        Passport
                      </label>
                    </div>
                  </div>
                  {errors.idType && (
                    <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
                      ID Front
                    </label>
                    <div className="mt-1">
                      <input
                        id="idFront"
                        type="file"
                        accept="image/jpeg,image/png"
                        {...register('idFront')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                      {errors.idFront && (
                        <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
                      ID Back
                    </label>
                    <div className="mt-1">
                      <input
                        id="idBack"
                        type="file"
                        accept="image/jpeg,image/png"
                        {...register('idBack')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        style={{ borderColor: '#D1D5DB' }}
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                      {errors.idBack && (
                        <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="hub" className="block text-sm font-medium text-gray-700">
                    Hub
                  </label>
                  <div className="mt-1">
                    <select
                      id="hub"
                      {...register('hub')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    >
                      <option value="">Select hub</option>
                      <option value="central">Central Hub</option>
                      <option value="north">North Hub</option>
                      <option value="south">South Hub</option>
                      <option value="east">East Hub</option>
                      <option value="west">West Hub</option>
                    </select>
                    {errors.hub && (
                      <p className="mt-1 text-sm text-red-600">{errors.hub.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="vehicleType"
                      {...register('vehicleType')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    >
                      <option value="">Select vehicle type</option>
                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                      <option value="bicycle">Bicycle</option>
                    </select>
                    {errors.vehicleType && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleRC" className="block text-sm font-medium text-gray-700">
                    Vehicle Registration Certificate (RC)
                  </label>
                  <div className="mt-1">
                    <input
                      id="vehicleRC"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      {...register('vehicleRC')}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      style={{ borderColor: '#D1D5DB' }}
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    {errors.vehicleRC && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleRC.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the Terms and Conditions
                    </label>
                    <p className="text-gray-500">
                      By creating an account, you agree to our{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Inline CSS for Loading Animation */}
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { BookOpen } from 'lucide-react';
// import Button from '../../components/shared/Button';
// import axios from "axios";
// import { showMessageCard } from './MessageCard'; 

// const signupSchemaStep1 = z.object({
//   firstName: z.string().min(2, 'First Name must be at least 2 characters'),
//   lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   phone: z.string()
//     .regex(/^\d+$/, 'Phone must contain only numbers')
//     .min(10, 'Phone must be at least 10 digits')
//     .max(10, 'Phone must not exceed 10 digits'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string().min(8, 'Confirm password must match'),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   city: z.string().min(2, 'City must be at least 2 characters'),
//   state: z.string().min(2, 'State must be at least 2 characters'),
//   zipCode: z.string().min(5, 'Zip Code must be at least 5 characters'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword'],
// });

// const signupSchemaStep2 = z.object({
//   role: z.enum(['user', 'bookstore', 'organization', 'delivery-agent'], 'Please select a role'),
// });

// const userSchemaStep3 = z.object({
//   dob: z.string().min(1, 'Date of birth is required'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   billImage: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
// });

// const bookstoreSchemaStep3 = z.object({
//   storeRegistrationNo: z.string().min(1, 'Store Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYear: z.string().min(1, 'Running Year is required'),
// });

// const organizationSchemaStep3 = z.object({
//   organizationType: z.string().min(1, 'Organization Type is required'),
//   registrationNo: z.string().min(1, 'Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYears: z.string().min(1, 'Running Years is required'),
// });

// const deliveryAgentSchemaStep3 = z.object({
//   age: z.string().min(1, 'Age is required'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   hub: z.string().min(1, 'Hub is required'),
//   vehicleType: z.string().min(1, 'Vehicle Type is required'),
//   vehicleRC: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
// });

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [selectedRole, setSelectedRole] = useState('');

//   const getSchemaForStep = () => {
//     if (step === 1) return signupSchemaStep1;
//     if (step === 2) return signupSchemaStep2;
//     if (step === 3) {
//       switch (selectedRole) {
//         case 'user': return userSchemaStep3;
//         case 'bookstore': return bookstoreSchemaStep3;
//         case 'organization': return organizationSchemaStep3;
//         case 'delivery-agent': return deliveryAgentSchemaStep3;
//         default: return userSchemaStep3;
//       }
//     }
//     return signupSchemaStep1;
//   };

//   const { register, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: zodResolver(getSchemaForStep()),
//   });
//   const [error, setError] = useState('');

//   const onSubmitStep1 = (data) => {
//     setFormData({ ...formData, ...data });
//     setStep(2);
//     reset();
//   };

//   const onSubmitStep2 = (data) => {
//     setFormData({ ...formData, ...data });
//     setSelectedRole(data.role);
//     setStep(3);
//     reset();
//   };

//   const onSubmitStep3 = async (data) => {
//     const allData = { ...formData, ...data };
//     setFormData(allData);

//     if (selectedRole === 'user') {
//       const idFrontFile = allData.idFront?.[0];
//       const idBackFile = allData.idBack?.[0];
//       const billImageFile = allData.billImage?.[0];

//       // Validate file uploads
//       if (!idFrontFile || !idBackFile || !billImageFile) {
//         setError('ID Front, ID Back, and Bill Image are required');
//         showMessageCard('Error', 'ID Front, ID Back, and Bill Image are required', 'error');
//         return;
//       }

//       try {
//         // Upload files to Google Drive
//         const idFrontFormData = new FormData();
//         idFrontFormData.append('file', idFrontFile);
//         const idFrontResponse = await axios.post('http://localhost:9090/upload/idFront', idFrontFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const idFrontId = idFrontResponse.data;

//         const idBackFormData = new FormData();
//         idBackFormData.append('file', idBackFile);
//         const idBackResponse = await axios.post('http://localhost:9090/upload/idBack', idBackFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const idBackId = idBackResponse.data;

//         const billImageFormData = new FormData();
//         billImageFormData.append('file', billImageFile);
//         const billImageResponse = await axios.post('http://localhost:9090/upload/billImage', billImageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const billImageId = billImageResponse.data;

//         // Create userData with file IDs
//         const userData = {
//           email: allData.email,
//           password: allData.password,
//           fname: allData.firstName,
//           lname: allData.lastName,
//           phone: parseInt(allData.phone.slice(0, 10), 10),
//           dob: allData.dob,
//           idType: allData.idType,
//           gender: allData.gender,
//           address: allData.address,
//           city: allData.city,
//           state: allData.state,
//           zip: allData.zipCode,
//           idFront: idFrontId,
//           idBack: idBackId,
//           billImage: billImageId,
//         };

//         // Submit to register endpoint
//         const formDataToSend = new FormData();
//         const jsonBlob = new Blob([JSON.stringify(userData)], {
//           type: 'application/json',
//         });
//         formDataToSend.append('userData', jsonBlob);

//         const response = await axios.post('http://localhost:9090/api/registerUser', formDataToSend, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const result = response.data;

//         if (result.message === 'success&pending') {
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
//     } else if (selectedRole === 'organization') {
//       const registrationCopyFile = allData.registrationCopy?.[0];

//       if (!registrationCopyFile) {
//         setError('Registration copy is required');
//         showMessageCard('Error', 'Registration copy is required', 'error');
//         return;
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append('registrationCopyFile', registrationCopyFile);

//       const orgData = {
//         type: allData.organizationType,
//         reg_no: allData.registrationNo,
//         fname: allData.firstName,
//         lname: allData.lastName,
//         email: allData.email,
//         password: allData.password,
//         phone: parseInt(allData.phone.slice(0, 10), 10),
//         years: parseInt(allData.runningYears, 10),
//         address: allData.address,
//         city: allData.city,
//         state: allData.state,
//         zip: allData.zipCode
//       };

//       const jsonBlob = new Blob([JSON.stringify(orgData)], {
//         type: 'application/json'
//       });

//       formDataToSend.append('orgData', jsonBlob);

//       try {
//         const response = await axios.post('http://localhost:9090/api/registerOrg', formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         const result = response.data;

//         if (result.message === 'success&pending') {
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
//     } else {
//       navigate('/login');
//     }
//   };

//   const roleOptions = [
//     { value: 'user', label: 'User (Buyer, Borrower, Lender, Seller)' },
//     { value: 'bookstore', label: 'Book Store' },
//     { value: 'organization', label: 'Organization' },
//     { value: 'delivery-agent', label: 'Delivery Agent' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//             <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
//             <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>BookHive</span></span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-medium" style={{ color: '#407aff' }}
//             onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
//             onMouseOut={(e) => (e.target.style.color = '#407aff')}
//           >
//             Log in
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
//           <div className="mb-6">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   1
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   2
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   3
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(
//             step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
//           )}>
//             {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            
//             {step === 1 && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                       First Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="firstName"
//                         type="text"
//                         {...register('firstName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="John"
//                       />
//                       {errors.firstName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                       Last Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="lastName"
//                         type="text"
//                         {...register('lastName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="Doe"
//                       />
//                       {errors.lastName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="email"
//                       type="email"
//                       {...register('email')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="john.doe@example.com"
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                     Phone Number
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="phone"
//                       type="tel"
//                       {...register('phone')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123-456-7890"
//                     />
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="password"
//                         type="password"
//                         {...register('password')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.password && (
//                         <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                       Confirm Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="confirmPassword"
//                         type="password"
//                         {...register('confirmPassword')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.confirmPassword && (
//                         <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                     Address
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="address"
//                       type="text"
//                       {...register('address')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123 Main Street"
//                     />
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="city"
//                         type="text"
//                         {...register('city')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="New York"
//                       />
//                       {errors.city && (
//                         <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="state"
//                         type="text"
//                         {...register('state')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="NY"
//                       />
//                       {errors.state && (
//                         <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
//                       Zip Code
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="zipCode"
//                         type="text"
//                         {...register('zipCode')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="10001"
//                       />
//                       {errors.zipCode && (
//                         <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       onClick={() => navigate('/login')}
//                     >
//                       Google
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-4">
//                     Select Your Role
//                   </label>
//                   <div className="space-y-3">
//                     {roleOptions.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           id={option.value}
//                           type="radio"
//                           value={option.value}
//                           {...register('role')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor={option.value} className="ml-3 block text-sm text-gray-900">
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.role && (
//                     <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(1)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'user' && (
//               <>
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
//                     Date of Birth
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="dob"
//                       type="date"
//                       {...register('dob')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.dob && (
//                       <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="billImage" className="block text-sm font-medium text-gray-700">
//                     Bill Image (Address Proof)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="billImage"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('billImage')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.billImage && (
//                       <p className="mt-1 text-sm text-red-600">{errors.billImage.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="male"
//                         type="radio"
//                         value="male"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
//                         Male
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="female"
//                         type="radio"
//                         value="female"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
//                         Female
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="other"
//                         type="radio"
//                         value="other"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
//                         Other
//                       </label>
//                     </div>
//                   </div>
//                   {errors.gender && (
//                     <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'bookstore' && (
//               <>
//                 <div>
//                   <label htmlFor="storeRegistrationNo" className="block text-sm font-medium text-gray-700">
//                     Store Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="storeRegistrationNo"
//                       type="text"
//                       {...register('storeRegistrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="REG123456"
//                     />
//                     {errors.storeRegistrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.storeRegistrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYear" className="block text-sm font-medium text-gray-700">
//                     Running Year
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYear"
//                       type="number"
//                       {...register('runningYear')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="2020"
//                     />
//                     {errors.runningYear && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYear.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'organization' && (
//               <>
//                 <div>
//                   <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
//                     Organization Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="organizationType"
//                       {...register('organizationType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select organization type</option>
//                       <option value="nonprofit">Non-Profit</option>
//                       <option value="government">Government</option>
//                       <option value="educational">Educational Institution</option>
//                       <option value="library">Library</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.organizationType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
//                     Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationNo"
//                       type="text"
//                       {...register('registrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="ORG123456"
//                     />
//                     {errors.registrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYears" className="block text-sm font-medium text-gray-700">
//                     Running Years
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYears"
//                       type="number"
//                       {...register('runningYears')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="5"
//                     />
//                     {errors.runningYears && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYears.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'delivery-agent' && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="age" className="block text-sm font-medium text-gray-700">
//                       Age
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="age"
//                         type="number"
//                         {...register('age')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="25"
//                       />
//                       {errors.age && (
//                         <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <input
//                           id="male-agent"
//                           type="radio"
//                           value="male"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="male-agent" className="ml-2 block text-sm text-gray-900">
//                           Male
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="female-agent"
//                           type="radio"
//                           value="female"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="female-agent" className="ml-2 block text-sm text-gray-900">
//                           Female
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="other-agent"
//                           type="radio"
//                           value="other"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="other-agent" className="ml-2 block text-sm text-gray-900">
//                           Other
//                         </label>
//                       </div>
//                     </div>
//                     {errors.gender && (
//                       <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic-agent"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic-agent" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport-agent"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport-agent" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="hub" className="block text-sm font-medium text-gray-700">
//                     Hub
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="hub"
//                       {...register('hub')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select hub</option>
//                       <option value="central">Central Hub</option>
//                       <option value="north">North Hub</option>
//                       <option value="south">South Hub</option>
//                       <option value="east">East Hub</option>
//                       <option value="west">West Hub</option>
//                     </select>
//                     {errors.hub && (
//                       <p className="mt-1 text-sm text-red-600">{errors.hub.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
//                     Vehicle Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="vehicleType"
//                       {...register('vehicleType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select vehicle type</option>
//                       <option value="bike">Bike</option>
//                       <option value="car">Car</option>
//                       <option value="van">Van</option>
//                       <option value="truck">Truck</option>
//                       <option value="bicycle">Bicycle</option>
//                     </select>
//                     {errors.vehicleType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleRC" className="block text-sm font-medium text-gray-700">
//                     Vehicle Registration Certificate (RC)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="vehicleRC"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('vehicleRC')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.vehicleRC && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleRC.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       required
//                     />
//                   </div>
//                   <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="font-medium text-gray-700">
//                       I agree to the Terms and Conditions
//                     </label>
//                     <p className="text-gray-500">
//                       By creating an account, you agree to our{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Privacy Policy
//                       </a>
//                       .
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { BookOpen } from 'lucide-react';
// import Button from '../../components/shared/Button';
// import axios from "axios";
// import { showMessageCard } from './MessageCard'; 

// const signupSchemaStep1 = z.object({
//   firstName: z.string().min(2, 'First Name must be at least 2 characters'),
//   lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   phone: z.string()
//     .regex(/^\d+$/, 'Phone must contain only numbers')
//     .min(10, 'Phone must be at least 10 digits')
//     .max(10, 'Phone must not exceed 10 digits'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string().min(8, 'Confirm password must match'),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   city: z.string().min(2, 'City must be at least 2 characters'),
//   state: z.string().min(2, 'State must be at least 2 characters'),
//   zipCode: z.string().min(5, 'Zip Code must be at least 5 characters'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword'],
// });

// const signupSchemaStep2 = z.object({
//   role: z.enum(['user', 'bookstore', 'organization', 'delivery-agent'], 'Please select a role'),
// });

// const userSchemaStep3 = z.object({
//   dob: z.string().min(1, 'Date of birth is required'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   billImage: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
// });

// const bookstoreSchemaStep3 = z.object({
//   storeRegistrationNo: z.string().min(1, 'Store Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYear: z.string().min(1, 'Running Year is required'),
// });

// const organizationSchemaStep3 = z.object({
//   organizationType: z.string().min(1, 'Organization Type is required'),
//   registrationNo: z.string().min(1, 'Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYears: z.string().min(1, 'Running Years is required'),
// });

// const deliveryAgentSchemaStep3 = z.object({
//   age: z.string().min(1, 'Age is required'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   hub: z.string().min(1, 'Hub is required'),
//   vehicleType: z.string().min(1, 'Vehicle Type is required'),
//   vehicleRC: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
// });

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [selectedRole, setSelectedRole] = useState('');

//   const getSchemaForStep = () => {
//     if (step === 1) return signupSchemaStep1;
//     if (step === 2) return signupSchemaStep2;
//     if (step === 3) {
//       switch (selectedRole) {
//         case 'user': return userSchemaStep3;
//         case 'bookstore': return bookstoreSchemaStep3;
//         case 'organization': return organizationSchemaStep3;
//         case 'delivery-agent': return deliveryAgentSchemaStep3;
//         default: return userSchemaStep3;
//       }
//     }
//     return signupSchemaStep1;
//   };

//   const { register, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: zodResolver(getSchemaForStep()),
//   });
//   const [error, setError] = useState('');

//   const onSubmitStep1 = (data) => {
//     setFormData({ ...formData, ...data });
//     setStep(2);
//     reset();
//   };

//   const onSubmitStep2 = (data) => {
//     setFormData({ ...formData, ...data });
//     setSelectedRole(data.role);
//     setStep(3);
//     reset();
//   };


//   const onSubmitStep3 = async (data) => {
//     const allData = { ...formData, ...data };
//     setFormData(allData);
  
//     if (selectedRole === 'organization') {
//       const registrationCopyFile = allData.registrationCopy?.[0];
  
//       if (!registrationCopyFile) {
//         setError('Registration copy is required');
//         alert('Registration copy is required');
//         return;
//       }
  
//       // 📦 Create FormData and append JSON + file
//       const formDataToSend = new FormData();
      
//       // Append file
//       formDataToSend.append('registrationCopyFile', registrationCopyFile);
  
//       // Create JSON and append as Blob
//       const orgData = {
//         type: allData.organizationType,
//         reg_no: allData.registrationNo,
//         fname: allData.firstName,
//         lname: allData.lastName,
//         email: allData.email,
//         password: allData.password,
//         phone: parseInt(allData.phone.slice(0, 10), 10),
//         years: parseInt(allData.runningYears, 10),
//         address: allData.address,
//         city: allData.city,
//         state: allData.state,
//         zip: allData.zipCode
//       };
  
//       const jsonBlob = new Blob([JSON.stringify(orgData)], {
//         type: 'application/json'
//       });
  
//       formDataToSend.append('orgData', jsonBlob);
  
//       try {
//         const response = await axios.post('http://localhost:9090/api/registerOrg', formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
  
//         const result = response.data;

//         if (result.message === 'success&pending') {
//           // Show card for pending verification
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           // Show card for successful account creation
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           // Any other response, treat as error
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
    
//     } 

//     if (selectedRole === 'user') {
//     const idFrontFile = allData.idFront?.[0];
//     const idBackFile = allData.idBack?.[0];
//     const billImageFile = allData.billImage?.[0];

//     // Validate file uploads
//     if (!idFrontFile || !idBackFile || !billImageFile) {
//       setError('ID Front, ID Back, and Bill Image are required');
//       alert('ID Front, ID Back, and Bill Image are required');
//       return;
//     }

//     // 📦 Create FormData and append JSON + files
//     const formDataToSend = new FormData();

//     // Append files
//     formDataToSend.append('idFront', idFrontFile);
//     formDataToSend.append('idBack', idBackFile);
//     formDataToSend.append('billImage', billImageFile);

//     // Create JSON and append as Blob
//     const userData = {
//       email: allData.email,
//       password: allData.password,
//       fname: allData.firstName,
//       lname: allData.lastName,
//       phone: parseInt(allData.phone.slice(0, 10), 10),
//       dob: allData.dob,
//       idType: allData.idType,
//       gender: allData.gender,
//       address: allData.address,
//       city: allData.city,
//       state: allData.state,
//       zip: allData.zipCode,
//     };

//     const jsonBlob = new Blob([JSON.stringify(userData)], {
//       type: 'application/json',
//     });

//     formDataToSend.append('userData', jsonBlob);

//     try {
//       const response = await axios.post(
//         'http://localhost:9090/api/registerUser',
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       const result = response.data;

//       if (result.message === 'success&pending') {
//         // Show card for pending verification
//         showMessageCard(
//           'Your account request has been received!',
//           'We are currently verifying your information. Please check your email for updates.',
//           'info'
//         );
//       } else if (result.message === 'success&active') {
//         // Show card for successful account creation
//         showMessageCard(
//           'Account Created Successfully!',
//           'You can now log in to your account.',
//           'success'
//         );
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         // Any other response, treat as error
//         showMessageCard(
//           'Error',
//           'Something went wrong: ' + result.message,
//           'error'
//         );
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       const errMsg =
//         'Something went wrong: ' +
//         (error.response?.data?.message || error.message);
//       showMessageCard('Error', errMsg, 'error');
//       setError(errMsg);
//     }
//   } 
  
//     else {
//     navigate('/login');
//   }
//   };
  
  
  
  

//   const roleOptions = [
//     { value: 'user', label: 'User (Buyer, Borrower, Lender, Seller)' },
//     { value: 'bookstore', label: 'Book Store' },
//     { value: 'organization', label: 'Organization' },
//     { value: 'delivery-agent', label: 'Delivery Agent' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//             <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
//             <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>BookHive</span></span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-medium" style={{ color: '#407aff' }}
//             onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
//             onMouseOut={(e) => (e.target.style.color = '#407aff')}
//           >
//             Log in
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
//           <div className="mb-6">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   1
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   2
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   3
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(
//             step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
//           )}>
//             {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            
//             {step === 1 && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                       First Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="firstName"
//                         type="text"
//                         {...register('firstName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="John"
//                       />
//                       {errors.firstName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                       Last Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="lastName"
//                         type="text"
//                         {...register('lastName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="Doe"
//                       />
//                       {errors.lastName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="email"
//                       type="email"
//                       {...register('email')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="john.doe@example.com"
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                     Phone Number
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="phone"
//                       type="tel"
//                       {...register('phone')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123-456-7890"
//                     />
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="password"
//                         type="password"
//                         {...register('password')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.password && (
//                         <p class courage="mt-1 text-sm text-red-600">{errors.password.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                       Confirm Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="confirmPassword"
//                         type="password"
//                         {...register('confirmPassword')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5 twistDB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.confirmPassword && (
//                         <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                     Address
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="address"
//                       type="text"
//                       {...register('address')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123 Main Street"
//                     />
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="city"
//                         type="text"
//                         {...register('city')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="New York"
//                       />
//                       {errors.city && (
//                         <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="state"
//                         type="text"
//                         {...register('state')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="NY"
//                       />
//                       {errors.state && (
//                         <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
//                       Zip Code
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="zipCode"
//                         type="text"
//                         {...register('zipCode')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="10001"
//                       />
//                       {errors.zipCode && (
//                         <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       onClick={() => navigate('/login')}
//                     >
//                       Google
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-4">
//                     Select Your Role
//                   </label>
//                   <div className="space-y-3">
//                     {roleOptions.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           id={option.value}
//                           type="radio"
//                           value={option.value}
//                           {...register('role')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor={option.value} className="ml-3 block text-sm text-gray-900">
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.role && (
//                     <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(1)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'user' && (
//               <>
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
//                     Date of Birth
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="dob"
//                       type="date"
//                       {...register('dob')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.dob && (
//                       <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="billImage" className="block text-sm font-medium text-gray-700">
//                     Bill Image (Address Proof)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="billImage"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('billImage')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.billImage && (
//                       <p className="mt-1 text-sm text-red-600">{errors.billImage.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="male"
//                         type="radio"
//                         value="male"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
//                         Male
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="female"
//                         type="radio"
//                         value="female"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
//                         Female
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="other"
//                         type="radio"
//                         value="other"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
//                         Other
//                       </label>
//                     </div>
//                   </div>
//                   {errors.gender && (
//                     <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'bookstore' && (
//               <>
//                 <div>
//                   <label htmlFor="storeRegistrationNo" className="block text-sm font-medium text-gray-700">
//                     Store Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="storeRegistrationNo"
//                       type="text"
//                       {...register('storeRegistrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="REG123456"
//                     />
//                     {errors.storeRegistrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.storeRegistrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYear" className="block text-sm font-medium text-gray-700">
//                     Running Year
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYear"
//                       type="number"
//                       {...register('runningYear')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="2020"
//                     />
//                     {errors.runningYear && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYear.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'organization' && (
//               <>
//                 <div>
//                   <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
//                     Organization Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="organizationType"
//                       {...register('organizationType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select organization type</option>
//                       <option value="nonprofit">Non-Profit</option>
//                       <option value="government">Government</option>
//                       <option value="educational">Educational Institution</option>
//                       <option value="library">Library</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.organizationType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
//                     Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationNo"
//                       type="text"
//                       {...register('registrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="ORG123456"
//                     />
//                     {errors.registrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYears" className="block text-sm font-medium text-gray-700">
//                     Running Years
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYears"
//                       type="number"
//                       {...register('runningYears')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="5"
//                     />
//                     {errors.runningYears && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYears.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'delivery-agent' && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="age" className="block text-sm font-medium text-gray-700">
//                       Age
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="age"
//                         type="number"
//                         {...register('age')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="25"
//                       />
//                       {errors.age && (
//                         <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <input
//                           id="male-agent"
//                           type="radio"
//                           value="male"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="male-agent" className="ml-2 block text-sm text-gray-900">
//                           Male
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="female-agent"
//                           type="radio"
//                           value="female"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="female-agent" className="ml-2 block text-sm text-gray-900">
//                           Female
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="other-agent"
//                           type="radio"
//                           value="other"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="other-agent" className="ml-2 block text-sm text-gray-900">
//                           Other
//                         </label>
//                       </div>
//                     </div>
//                     {errors.gender && (
//                       <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic-agent"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic-agent" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport-agent"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport-agent" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="hub" className="block text-sm font-medium text-gray-700">
//                     Hub
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="hub"
//                       {...register('hub')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select hub</option>
//                       <option value="central">Central Hub</option>
//                       <option value="north">North Hub</option>
//                       <option value="south">South Hub</option>
//                       <option value="east">East Hub</option>
//                       <option value="west">West Hub</option>
//                     </select>
//                     {errors.hub && (
//                       <p className="mt-1 text-sm text-red-600">{errors.hub.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
//                     Vehicle Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="vehicleType"
//                       {...register('vehicleType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select vehicle type</option>
//                       <option value="bike">Bike</option>
//                       <option value="car">Car</option>
//                       <option value="van">Van</option>
//                       <option value="truck">Truck</option>
//                       <option value="bicycle">Bicycle</option>
//                     </select>
//                     {errors.vehicleType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleRC" className="block text-sm font-medium text-gray-700">
//                     Vehicle Registration Certificate (RC)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="vehicleRC"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('vehicleRC')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.vehicleRC && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleRC.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       required
//                     />
//                   </div>
//                   <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="font-medium text-gray-700">
//                       I agree to the Terms and Conditions
//                     </label>
//                     <p className="text-gray-500">
//                       By creating an account, you agree to our{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Privacy Policy
//                       </a>
//                       .
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;