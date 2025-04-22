import { useState, useContext } from 'react';
import { Context } from '../utils/Context';
import Button from './Button';
import { Dialog } from '@headlessui/react';

const ManualAccountForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    apr_percentage: '',
    minimum_payment_amount: '',
    current_balance: '',
    limit: '',
    name: '',
    next_payment_due_date: ''
  });
  const { authTokens } = useContext(Context);
  const url = import.meta.env.VITE_APP_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      institution: formData.institution,
      connection_data: {
        aprs: [
          {
            apr_percentage: parseFloat(formData.apr_percentage),
            apr_type: "purchase_apr",
          },
        ],
        minimum_payment_amount: parseFloat(formData.minimum_payment_amount),
        balances: {
          current: parseFloat(formData.current_balance),
          limit: parseFloat(formData.limit),
          iso_currency_code: "USD",
        },
        name: formData.name,
        type: "credit",
        next_payment_due_date: formData.next_payment_due_date
      }
    };

    try {
      const response = await fetch(`${url}/api/plaidstuff/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      // Close modal and reset form on success
      setIsModalOpen(false);
      setFormData({
        institution: '',
        apr_percentage: '',
        minimum_payment_amount: '',
        current_balance: '',
        limit: '',
        name: '',
        next_payment_due_date: ''
      });
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} variant="primary">
        Add Manual Account
      </Button>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="mx-auto max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-2xl font-bold mb-4">Add Manual Account</Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Card Nickname</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">APR Percentage</label>
                <input
                  type="number"
                  name="apr_percentage"
                  value={formData.apr_percentage}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Payment Amount</label>
                <input
                  type="number"
                  name="minimum_payment_amount"
                  value={formData.minimum_payment_amount}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Next Payment Due Date</label>
                <input
                  type="date"
                  name="next_payment_due_date"
                  value={formData.next_payment_due_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                <input
                  type="number"
                  name="current_balance"
                  value={formData.current_balance}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ManualAccountForm; 