import React, { useEffect, useState } from 'react';
import supabase from '../supabase';

const DeviceStatus = ({ deviceId }) => {
  const [status, setStatus] = useState('unknown');
  const [lastOnline, setLastOnline] = useState(null);
  const [latestTransaction, setLatestTransaction] = useState(null); // New state for latest transaction

  useEffect(() => {
    // Use the hardcoded device ID sent by the ESP code
    const currentDeviceId = deviceId || "ESP32_DevKitV1"; 

    if (!currentDeviceId) return;

    // --- Device Status Monitoring ---
    // Supabase real-time listeners for device status and last_online
    const statusSubscription = supabase
      .channel('device_status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'devices', filter: `id=eq.${currentDeviceId}` },
        payload => {
          setStatus(payload.new.status || 'offline');
        }
      )
      .subscribe();

    const lastOnlineSubscription = supabase
      .channel('device_last_online')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'devices', filter: `id=eq.${currentDeviceId}` },
        payload => {
          setLastOnline(payload.new.last_online ? new Date(payload.new.last_online) : null);
        }
      )
      .subscribe();

    // --- Transaction Monitoring ---
    // Supabase real-time listener for latest transaction
    const transactionsSubscription = supabase
      .channel('latest_transaction')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `device_id=eq.${currentDeviceId}` },
        payload => {
          setLatestTransaction(payload.new);
        }
      )
      .subscribe();

    // Initial fetch for status and last_online
    const fetchInitialData = async () => {
      const { data: statusData } = await supabase.from('devices').select('status').eq('id', currentDeviceId).single();
      if (statusData) setStatus(statusData.status || 'offline');

      const { data: lastOnlineData } = await supabase.from('devices').select('last_online').eq('id', currentDeviceId).single();
      if (lastOnlineData) setLastOnline(lastOnlineData.last_online ? new Date(lastOnlineData.last_online) : null);

      const { data: latestTxData } = await supabase.from('transactions').select('*').eq('device_id', currentDeviceId).order('timestamp', { ascending: false }).limit(1).single();
      if (latestTxData) setLatestTransaction(latestTxData);
    };
    fetchInitialData();

    return () => {
      statusSubscription.unsubscribe();
      lastOnlineSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
    };
  }, [deviceId]);

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
