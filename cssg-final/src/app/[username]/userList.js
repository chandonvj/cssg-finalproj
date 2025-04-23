'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { createClient } from '../../../utils/supabase/client.ts';

export default function UserList({ isOpen, onClose, type, userId }) {
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        if (!isOpen || !type || !userId) return;

        const supabase = createClient();
        const fetchUsers = async () => {
            if (type === 'followers') {
                const { data } = await supabase
                    .from('follows')
                    .select('follower:users!follows_follower_fkey(id, username, name, avatar_url)')
                    .eq('recipient', userId)
                setUsers(data.map(f => f.follower));
            } else if (type === 'following') {
                const { data } = await supabase
                    .from('follows')
                    .select('recipient:users!follows_recipient_fkey(id, username, name, avatar_url)')
                    .eq('follower', userId);
                setUsers(data.map(f => f.recipient));
            }
        };
        fetchUsers();
    }, [isOpen, type, userId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-zinc-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto text-white relative">
            <button className="absolute top-3 right-5 text-white text-2xl" onClick={onClose}>×</button>
            <h2 className="text-2xl font-semibold mb-4 capitalize">{type}</h2>
            <ul className="space-y-4">
              {users.map((u) => (
                <li key={u.id} className="flex items-center space-x-4">
                  <Link href={`/${u.username}`}>
                    <Image src={u.avatar_url} alt={u.username} width={40} height={40} className="w-12 h-12 rounded-full object-cover cursor-pointer" />
                  </Link>
                  <div>
                    <Link href={`/${u.username}`}>
                      <p className="font-bold hover:underline cursor-pointer">{u.username}</p>
                    </Link>
                    <p className="text-sm text-zinc-400">{u.name}</p>
                  </div>
                </li>
              ))}
              {users.length === 0 && <p className="text-center text-zinc-400 mt-10">No users found</p>}
            </ul>
          </div>
        </div>
    );    
}
