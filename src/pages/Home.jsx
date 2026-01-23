import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          navigate('/Portfolio');
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}