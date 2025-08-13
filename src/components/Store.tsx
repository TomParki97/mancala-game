import React from 'react';

interface StoreProps {
  stones: number;
  player: 0 | 1;
}

const Store: React.FC<StoreProps> = ({ stones }) => (
  <div className="w-16 h-36 m-1 rounded-lg flex items-center justify-center border-2 bg-gray-200 text-xl">
    {stones}
  </div>
);

export default Store;
