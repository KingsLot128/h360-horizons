
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Zap, Star } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const Subscriptions = () => {
  const { toast } = useToast();

  const plans = [
    {
      name: 'Harmony Essentials',
      price: '25',
      priceUnit: '/ user / month',
      setupFee: '600',
      features: [
        'Bi-weekly virtual wellness sessions',
        'Basic GamiPress wellness points system',
        'Quarterly wellness analytics & newsletter',
        'Limited on-demand library access',
      ],
      color: 'from-emerald-400 to-teal-400',
      buttonLabel: 'Choose Essentials',
      priceId: 'price_essentials_tier',
    },
    {
      name: 'Harmony Plus',
      price: '55',
      priceUnit: '/ user / month',
      setupFee: '1,500',
      features: [
        'Tailored wellness sessions (live & recorded)',
        'Advanced wellness point tracking + leaderboard',
        'Mid-level wellness library access',
        'Midday digital stress-relief sessions',
        'One annual onsite wellness event',
      ],
      color: 'from-blue-400 to-indigo-400',
      buttonLabel: 'Choose Plus',
      isPopular: true,
      priceId: 'price_plus_tier',
    },
    {
      name: 'Harmony Pro',
      price: '85',
      priceUnit: '/ user / month',
      setupFee: '3,000',
      features: [
        'Comprehensive wellness programs',
        'Full access to complete wellness library',
        'Advanced analytics dashboard & ROI',
        'Quarterly onsite wellness/spa events',
        'Monthly live coaching/Q&A sessions',
      ],
      color: 'from-purple-400 to-pink-400',
      buttonLabel: 'Choose Pro',
      priceId: 'price_pro_tier',
    },
    {
      name: 'Zen Elite',
      price: '150',
      priceUnit: '/ individual / month',
      setupFee: null,
      features: [
        'Unlimited live virtual wellness sessions',
        'Personalized wellness plan creation',
        'Full wellness content library access',
        'Exclusive discounts on retreats & products',
        'GamiPress points & recognition system',
      ],
      color: 'from-amber-400 to-orange-400',
      buttonLabel: 'Choose Elite',
      priceId: 'price_elite_tier',
    },
  ];

  const handleSubscribe = (plan) => {
    if (!supabase) {
      toast({
        title: '🚧 Backend Not Connected',
        description: "Please complete the Supabase integration to enable user management and subscriptions.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    toast({
      title: '🚧 Subscriptions Coming Soon!',
      description: "We're putting the final touches on our subscription system. Please provide your Stripe keys to enable this feature!",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Find Your Harmony
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Strategic pricing for corporate wellness and individual executives. Choose a plan that aligns with your goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className={`harmony-card flex flex-col p-8 relative ${plan.isPopular ? 'border-2 border-blue-500' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>POPULAR</span>
                </div>
              </div>
            )}

            <div className="flex-grow">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                    ${plan.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 h-10">{plan.priceUnit}</p>
                {plan.setupFee && (
                  <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                    + ${plan.setupFee} Setup Fee
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full harmony-button ${plan.isPopular ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' : ''}`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="harmony-card p-8 text-center bg-gradient-to-r from-emerald-50 to-teal-50"
      >
        <Zap className="w-10 h-10 mx-auto mb-4 text-emerald-500" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Launch?</h3>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          To enable subscriptions and save user data, we need to connect to a backend service and a payment provider.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => {
            toast({
              title: 'Connect Supabase',
              description: "Please complete the Supabase integration steps to enable user data persistence.",
            });
          }} className="harmony-button">
            Connect Supabase
          </button>
          <button onClick={() => {
            toast({
              title: 'Connect Stripe',
              description: "Please provide your Stripe API keys to enable payments.",
            });
          }} className="harmony-button">
            Connect Stripe
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscriptions;
