'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, User, Store, Lock, Save, Mail, Phone, MapPin, Globe, Truck, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
}

const defaultSettings: StoreSettings = {
  storeName: 'Clothing Store',
  storeEmail: 'contact@store.com',
  storePhone: '+216 XX XXX XXX',
  storeAddress: 'Tunisia',
  currency: 'TND',
  taxRate: '0',
  shippingFee: '7',
  freeShippingThreshold: '100',
};

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [savingStore, setSavingStore] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultSettings);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  useEffect(() => {
    if (mounted) {
      // Load store settings from localStorage only on client
      try {
        const savedSettings = localStorage.getItem('storeSettings');
        if (savedSettings) {
          setStoreSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, [mounted]);

  async function fetchUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleStoreInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStoreSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const saveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStore(true);

    try {
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      toast.success('Store settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSavingStore(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!mounted) {
    return (
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Settings
        </h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-48 bg-neutral-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-neutral-900 rounded-lg">
          <Settings size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Account Information</h2>
              <p className="text-sm text-neutral-500">Your admin account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <Mail size={18} className="text-neutral-400" />
                <span className="text-neutral-700 font-medium">{user?.email || 'Loading...'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Account Created
              </label>
              <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <span className="text-neutral-700 font-medium">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <form onSubmit={saveStoreSettings} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Store size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Store Settings</h2>
                <p className="text-sm text-neutral-500">Configure your store information</p>
              </div>
            </div>
            <Button type="submit" isLoading={savingStore}>
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Store Name
              </label>
              <div className="relative">
                <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  name="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Your Store Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contact Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  name="storeEmail"
                  value={storeSettings.storeEmail}
                  onChange={handleStoreInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="contact@store.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  name="storePhone"
                  value={storeSettings.storePhone}
                  onChange={handleStoreInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Store Address
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  name="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={handleStoreInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Currency
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select
                  name="currency"
                  value={storeSettings.currency}
                  onChange={handleStoreInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white appearance-none cursor-pointer"
                >
                  <option value="TND">TND - Tunisian Dinar</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tax Rate (%)
              </label>
              <div className="relative">
                <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="number"
                  name="taxRate"
                  value={storeSettings.taxRate}
                  onChange={handleStoreInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Shipping Section */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Shipping Settings</h3>
                <p className="text-sm text-neutral-500">Configure shipping fees and thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Standard Shipping Fee ({storeSettings.currency})
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  value={storeSettings.shippingFee}
                  onChange={handleStoreInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="7.00"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  This fee is applied to all orders below the free shipping threshold
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Free Shipping Threshold ({storeSettings.currency})
                </label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={storeSettings.freeShippingThreshold}
                  onChange={handleStoreInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="100.00"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Orders above this amount qualify for free shipping
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={changePassword} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Lock size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Change Password</h2>
              <p className="text-sm text-neutral-500">Update your admin password</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Enter new password"
                minLength={6}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Minimum 6 characters required
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              isLoading={savingPassword}
              disabled={!passwordData.newPassword || !passwordData.confirmPassword}
            >
              <Lock size={18} className="mr-2" />
              Update Password
            </Button>
          </div>
        </form>

        {/* Quick Info */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
          <ul className="space-y-2 text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              Store settings are saved locally in your browser
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              Change your password regularly for security
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              Free shipping threshold helps increase average order value
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              Contact information appears in order confirmation emails
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
