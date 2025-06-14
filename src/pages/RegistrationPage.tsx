import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { RegistrationInfo } from '../services/api';

export const RegistrationPage: React.FC = () => {
  const [, setRegistrationInfo] = useState<RegistrationInfo | null>(null);
  // const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  // const [activeTab, setActiveTab] = useState<'register' | 'stats' | 'info'>('register');

  // Registration form state (commented out until UI is implemented)
  // const [formData, setFormData] = useState<RegisterUserRequest>({
  //   full_name: '',
  //   id_number: '',
  //   email: '',
  //   phone: '',
  //   payment_method: 'bank_transfer'
  // });
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isReRegistration, setIsReRegistration] = useState(false);

  // const founderAddress = "DIS1FOUNDER00000000000000000000000000";

  useEffect(() => {
    loadRegistrationData();
  }, []);

  const loadRegistrationData = async () => {
    try {
      setLoading(true);
      
      const [infoResponse] = await Promise.allSettled([
        ApiService.getRegistrationInfo(),
        // ApiService.getRegistrationStats(founderAddress)
      ]);

      if (infoResponse.status === 'fulfilled' && infoResponse.value.success) {
        setRegistrationInfo(infoResponse.value.data!);
      }

      // if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
      //   setRegistrationStats(statsResponse.value.data!);
      // }

    } catch (err: any) {
      console.error('Failed to load registration data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers (commented out until UI is implemented)
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     // Validate form data
  //     if (!formData.full_name || !formData.id_number || !formData.email) {
  //       throw new Error('Please fill in all required fields');
  //     }

  //     // Email validation
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     if (!emailRegex.test(formData.email)) {
  //       throw new Error('Please enter a valid email address');
  //     }

  //     const response = isReRegistration 
  //       ? await ApiService.reRegisterUser(formData)
  //       : await ApiService.registerUser(formData);

  //     if (response.success) {
  //       setSuccess(
  //         isReRegistration 
  //           ? 'Re-registration successful! Please complete payment to activate your account.'
  //           : 'Registration successful! Please complete payment to activate your account.'
  //       );
        
  //       // Reset form
  //       setFormData({
  //         full_name: '',
  //         id_number: '',
  //         email: '',
  //         phone: '',
  //         payment_method: 'bank_transfer'
  //       });

  //       // Reload data to update stats
  //       loadRegistrationData();
  //     } else {
  //       setError(response.message || 'Registration failed');
  //     }
  //   } catch (err: any) {
  //     setError(err.message || 'Registration failed');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const getFeeDisplay = () => {
  //   if (!registrationInfo) return 'Loading...';
    
  //   const fee = isReRegistration 
  //     ? registrationInfo.re_registration_fee 
  //     : registrationInfo.registration_fee;
    
  //   return `${fee} ${registrationInfo.currency}`;
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-2">
        👥 User Registration
      </h1>
      <p className="text-gray-600">
        Register new users for the Binoma Digital Infrastructure System
      </p>
    </div>
  );
}; 