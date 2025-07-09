import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form } from '@heroui/react';
import axios from 'axios';

function RegisterUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    };

    const createUser = async () => {
      if (!email || !password) {
        return;
      }
      const response = await axios.post('http://localhost:3000/users', {email, password});
      console.log('User created:', response.data);
      navigate(`/sets/`, { state: { email, password } });
    }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-gray-600 to-purple-800">
        <Form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Create new account</h1>
          <span>Already have an account? <a href="/signIn">Sign in</a></span>
          <Input  
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            onPress={createUser}
            type="submit"
          >
            Create account
          </Button>
        </Form>
      </div>
  );
}
export default RegisterUser;