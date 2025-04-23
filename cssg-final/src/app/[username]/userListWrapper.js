'use client';

import { useState } from 'react';
import UserList from './userList';

export default function UserListWrapper({ profileId, type }) {
    const [modalOpen, setModalOpen] = useState(false);
  
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };
  
    return (
      <>
        <div className="text-xl ml-2">
          <button onClick={() => openModal()}>
            <p className="hover:underline cursor-pointer">{type}</p>
          </button>
        </div>
  
        <UserList
          isOpen={modalOpen}
          onClose={closeModal}
          type={type}
          userId={profileId}
        />
      </>  
    );
}
