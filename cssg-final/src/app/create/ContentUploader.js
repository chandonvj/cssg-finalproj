'use client';

import { useRef, useState } from 'react';
import { createClient } from '../../../utils/supabase/client.ts';

export default function ContentUploader({ userId, onUploadComplete }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || !userId) return;

        const fileExt = file.name.split('.').pop();
        const time = Date.now()
        const filePath = `${userId}-${time}.${fileExt}`;

        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });
        if (uploadError) {
            alert('Failed to upload image');
            setUploading(false);
            return;
        }

        const { data: publicURLData } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);

        const post_url = publicURLData?.publicUrl;

        /** 
        const { error: tableError } = await supabase
            .from('posts')
            .insert([
                {
                  user_id: userId,
                  image_url: post_url,
                  caption: "being created",
                },
              ]);*/

        setUploading(false);


        if (false && tableError) {
            alert('Failed to upload photo');
        } else {
            alert('Photo uploaded!');
            onUploadComplete(post_url);
        }
    };

    return (
        <div className="mx-auto my-5">
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
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-2xl text-white font-semibold"
            >
                {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
        </div>
    );
}