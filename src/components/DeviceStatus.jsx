import React, { useEffect, useState } from 'react';
// import supabase from '../supabase'; // Supabase removed

const DeviceStatus = ({ deviceId }) => {
  const [status, setStatus] = useState('unknown');
  const [lastOnline, setLastOnline] = useState(null);
  const [latestTransaction, setLatestTransaction] = useState(null); // New state for latest transaction

  useEffect(() => {
    // Since Supabase is removed, we'll use dummy data or a simplified status
    // For demonstration, let's assume the device is always online or use a basic timer
    const dummyStatus = 'online';
    const dummyLastOnline = new Date();
    const dummyLatestTransaction = {
      type: 'credit',
      note: 'Dummy Transaction',
      amount: 1000,
      timestamp: new Date().toLocaleString(),
    };

    setStatus(dummyStatus);
    setLastOnline(dummyLastOnline);
    setLatestTransaction(dummyLatestTransaction);

    // You can add a simple interval for a dynamic feel if needed
    const interval = setInterval(() => {
      // Simulate status changes or new transactions
      // This is purely for UI demonstration without a backend
      setStatus(prevStatus => (prevStatus === 'online' ? 'offline' : 'online'));
      setLastOnline(new Date());
    }, 5000); // Toggle status every 5 seconds

    return () => clearInterval(interval);

  }, [deviceId]); // Re-run effect if deviceId prop changes

  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <span
          className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
        ></span>
        <span className="text-foreground">
          Device Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {lastOnline && status === 'offline' && (
          <span className="text-muted-foreground">
            (Last online: {lastOnline.toLocaleString()})
          </span>
        )}
      </div>

      {latestTransaction && (
        <div className="mt-4 p-2 bg-card rounded-md border border-border">
          <span className="font-semibold text-foreground">Latest Transaction:</span>
          <p className="text-muted-foreground mt-1">
            Type: {latestTransaction.type.charAt(0).toUpperCase() + latestTransaction.type.slice(1)} ({latestTransaction.note})
          </p>
          <p className="text-muted-foreground">
            Amount: ₹{latestTransaction.amount}
          </p>
          <p className="text-muted-foreground text-xs">
            Time: {latestTransaction.timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeviceStatus;
