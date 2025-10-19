import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from '../../components/shared/Button';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:9090/api/login", {
        email: email,
        password: password,
      });

      console.log(res.data);

      if (res.data.status) {
        if (res.data.token) {
          login(res.data.token); // Decode and store email, userId, role
        }
        navigate('/' + (res.data.role || 'default'));
      } else {
        setPopup({ show: true, message: res.data.message });
        setTimeout(() => setPopup({ show: false, message: '' }), 5000); // Auto-close after 5 seconds
      }
    } catch (err) {
      setPopup({ show: true, message: "An error occurred: " + err.message });
      setTimeout(() => setPopup({ show: false, message: '' }), 5000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {popup.show && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-sm z-50 animate-fade-in">
          <p>{popup.message}</p>
          <button
            className="mt-2 text-sm text-red-700 underline"
            onClick={() => setPopup({ show: false, message: '' })}
          >
            Close
          </button>
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
            <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>Hive</span></span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium"
            style={{ color: '#407aff' }}
            onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
            onMouseOut={(e) => (e.target.style.color = '#407aff')}
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: '#D1D5DB' }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  placeholder="you@example.com"
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: '#D1D5DB' }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  style={{ borderColor: '#D1D5DB' }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-500 hover:text-blue-700">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div> <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                Sign in
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

            <div className="mt-6">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// // src/pages/common/LoginPage.jsx
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BookOpen } from 'lucide-react';
// import Button from '../../components/shared/Button';
// import axios from 'axios';
// import { useAuth } from '../../components/AuthContext';

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   async function handleLogin(event) {
//     event.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:9090/api/login", {
//         email: email,
//         password: password,
//       });

//       console.log(res.data);

//       if (res.data.message === "Email not exits") {
//         alert("Email not exits");
//       } else if (res.data.message === "Login Success") {
//         if (res.data.token) {
//           login(res.data.token); // Decode and store email, userId, role
//         }
//         navigate('/' + (res.data.role || 'default'));
//       } else {
//         alert("Incorrect Email and Password not match");
//       }
//     } catch (err) {
//       alert(err);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//             <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
//             <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>Hive</span></span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//           Welcome back
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link to="/signup" className="font-medium" style={{ color: '#407aff' }}
//             onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
//             onMouseOut={(e) => (e.target.style.color = '#407aff')}
//           >
//             Sign up for free
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                   style={{ borderColor: '#D1D5DB' }}
//                   onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                   onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                   style={{ borderColor: '#D1D5DB' }}
//                   onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                   onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                   style={{ borderColor: '#D1D5DB' }}
//                   onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                   onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <Link to="/forgot-password" className="font-medium text-blue-500 hover:text-blue-700">
//                   Forgot your password?
//                 </Link>
//               </div>
//             </div>

//             <div>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 fullWidth
//               >
//                 Sign in
//               </Button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                 Google
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
