import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BalanceCard } from './BalanceCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WalletStackProps {
  accounts: any[];
}

export function WalletStack({ accounts }: WalletStackProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (accounts.length === 0) {
    return <div className="text-gray-500 text-center py-4">No accounts found</div>;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Cards</h2>
        <button 
           onClick={() => setIsExpanded(!isExpanded)}
           className="text-sm text-emerald-600 font-medium flex items-center hover:text-emerald-700 transition-colors"
        >
           {isExpanded ? 'Stack Cards' : 'View All cards'}
           {isExpanded ? <ChevronUp className="w-4 h-4 ml-1"/> : <ChevronDown className="w-4 h-4 ml-1"/>}
        </button>
      </div>

      <div className={`relative transition-all duration-300 ${isExpanded ? 'h-auto mb-8' : 'h-[240px]'}`}>
        <AnimatePresence initial={false}>
          {accounts.map((account, index) => {
            return (
              <motion.div
                key={account.id}
                layout
                initial={false}
                animate={{
                  top: isExpanded ? 0 : index * 45, // Stack offset
                  scale: isExpanded ? 1 : 1 - index * 0.05, // Scale down cards in back
                  zIndex: accounts.length - index,
                  position: isExpanded ? 'relative' : 'absolute',
                  width: '100%',
                  marginTop: isExpanded ? 16 : 0, // Margin between cards when expanded
                }}
                transition={{
                   type: "spring",
                   stiffness: 300,
                   damping: 30 
                }}
                className={`shadow-lg rounded-xl origin-top cursor-pointer ${!isExpanded ? 'hover:-translate-y-2 transition-transform' : ''}`}
                onClick={() => {
                   if (!isExpanded) setIsExpanded(true);
                }}
              >
                  <BalanceCard {...account} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {!isExpanded && (
          <div className="absolute top-[200px] left-0 right-0 text-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                  Click stack to expand
              </span>
          </div>
      )}
    </div>
  );
}
