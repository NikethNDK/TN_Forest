import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import type { ContactFormData } from '../../types';

const PURPOSE_OPTIONS = [
  'Internship',
  'Product Purchase',
  'Lab Visit',
  'Training Programs',
  'Others',
] as const;

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  purpose: z.enum(PURPOSE_OPTIONS, { required_error: 'Please select a purpose for your enquiry' }),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormSchema): Promise<void> => {
    try {
      // In a real application, this would send data to an API endpoint
      console.log('Form submitted:', data);
      alert('Thank you for your message! We will get back to you soon.');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#37281b' }}>
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-4 py-3 border rounded-lg transition-shadow focus:ring-4 focus:ring-[#5f7447]/30 focus:border-[#5f7447] ${
              errors.name ? 'border-status-error-main' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-status-error-main">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#37281b' }}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-3 border rounded-lg transition-shadow focus:ring-4 focus:ring-[#5f7447]/30 focus:border-[#5f7447] ${
              errors.email ? 'border-status-error-main' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-status-error-main">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium mb-2" style={{ color: '#37281b' }}>
          Purpose of Enquiry *
        </label>
        <select
          id="purpose"
          {...register('purpose')}
          className={`w-full px-4 py-3 border rounded-lg transition-shadow focus:ring-4 focus:ring-[#5f7447]/30 focus:border-[#5f7447] ${
            errors.purpose ? 'border-status-error-main' : 'border-gray-300'
          }`}
        >
          <option value="">Select purpose...</option>
          {PURPOSE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.purpose && (
          <p className="mt-1 text-sm text-status-error-main">{errors.purpose.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#37281b' }}>
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
className={`w-full px-4 py-3 border rounded-lg transition-shadow focus:ring-4 focus:ring-[#5f7447]/30 focus:border-[#5f7447] ${
              errors.subject ? 'border-status-error-main' : 'border-gray-300'
            }`}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-status-error-main">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#37281b' }}>
          Message *
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className={`w-full px-4 py-3 border rounded-lg transition-shadow focus:ring-4 focus:ring-[#5f7447]/30 focus:border-[#5f7447] ${
            errors.message ? 'border-status-error-main' : 'border-gray-300'
          }`}
          placeholder="Please provide details about your inquiry (e.g., collaboration proposal, data request, general question)."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-status-error-main">{errors.message.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center shadow-lg text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        style={{ backgroundColor: '#5f7447' }}
      >
        <Send className="h-5 w-5 mr-3" />
        {isSubmitting ? 'Submitting...' : 'Submit Message'}
      </button>
    </form>
  );
};

export default ContactForm;

