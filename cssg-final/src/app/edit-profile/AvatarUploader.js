'use client';

import { useRef, useState } from 'react';
import { createClient } from '../../../utils/supabase/client.ts';

export default function AvatarUploader({ userId }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !userId) return;

        // get the new file name we'll use
        const fileExt = file.name.split('.').pop();
        const time = Date.now()
        const filePath = `${userId}-${time}.${fileExt}`;

        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });
        if (uploadError) {
            console.log('Upload Error:', uploadError);
            alert('Failed to upload image');
            setUploading(false);
            return;
        }

        // get the old file name
        const { data: old } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', userId)
            .single();
        const oldUrl = old?.avatar_url;

        // remove the old pfp
        if (!oldUrl.includes('default-pfp.jpg')) {
            const older = oldUrl.split("avatars/").pop();
            const { error: removeError } = await supabase.storage
                .from('avatars')
                .remove([older]);
            if (removeError) {
                console.log('Upload Error:', removeError);
                alert('Failed to upload image');
                setUploading(false);
                return;
            }
        }

        const { data: publicURLData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

        const avatar_url = publicURLData?.publicUrl;

        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url })
            .eq('id', userId);

        setUploading(false);

        if (updateError) {
            alert('Failed to update profile');
        } else {
            alert('Profile photo updated!');
            window.location.reload(); // Refresh to show new avatar
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold"
            >
                {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
        </div>
    );
}