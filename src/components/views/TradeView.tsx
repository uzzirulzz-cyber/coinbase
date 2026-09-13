import React from 'react';
import { User, AppView } from '../../types';
import { CryptoProTerminal } from '../trading/CryptoProTerminal';

interface TradeViewProps {
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  selectedSymbol?: string;
}

export const TradeView: React.FC<TradeViewProps> = ({
  currentUser,
  onNavigate,
  selectedSymbol
}) => {
  return (
    <div className="py-2">
      <CryptoProTerminal
        currentUser={currentUser}
        onNavigate={onNavigate}
        selectedSymbol={selectedSymbol}
      />
    </div>
  );
};
