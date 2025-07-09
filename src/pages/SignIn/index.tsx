import axios from 'axios';
import { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Input, Form } from '@heroui/react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const validateLogin = async () => {
    if (email === '' || password === '') {
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/users', {
        params: {
          email,
          password
        }
      });
      console.log('Login successful:', response.data);
      navigate(`/sets/`, { state: { email, password } });
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="339097861854-8qanh5e5p7m4lmqb358sjfjvf9494njk.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-gray-600 to-purple-800">
        <Form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Login</h1>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input  
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            onPress={validateLogin}
            type="submit"
          >
            Login
          </Button>
          <span className='cursor-pointer'>Forgot password</span>
          <span onClick={() => navigate('/RegisterUser')} className='cursor-pointer'>Don't have an account? Sign up</span>
            <div className="flex items-center justify-center my-4 w-full gap-2">
              <Divider className="flex-1" />
              <span className="mx-2 text-gray-400 whitespace-nowrap">or</span>
              <Divider className="flex-1" />
            </div>
          <GoogleLogin
            onSuccess={credentialResponse => {
              const token = credentialResponse.credential;
              fetch('abubleble/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
              })
                .then(res => res.json())
                .then(data => {
                  console.log(data);
                })
                .catch(err => {
                  console.log('Erro')
                });
              console.log(credentialResponse);
            }}
            onError={() => {
              alert('Erro ao fazer login com Google');
            }}
            width="100%"
            theme="filled_blue"
            text="continue_with"
          />
        </Form>
      </div>
    </GoogleOAuthProvider>
  );
}

export default SignIn;  