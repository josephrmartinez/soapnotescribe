'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ClientComponent() {
 const [userId, setUserId] = useState("");

 useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUserId(data.user?.id);
      }
    };

    fetchUser();
 }, []);

 return (
    <div>
      {userId ? (
        <div>This is a client component. This is your user id: {userId}</div>
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
 );
}