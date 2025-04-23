'use client';

import { useState, useEffect } from 'react';
import ContentUploader from './ContentUploader';

export default function ContentUploaderWrapper({ userId }) {
    const [uploadedUrl, setUploadedUrl] = useState(null);

    useEffect(() => {
        if (uploadedUrl) {
            const hiddenInput = document.getElementById('imageSrcInput');
            if (hiddenInput) {
                hiddenInput.value = uploadedUrl;
            }
        }
    }, [uploadedUrl]);

    return (
        <div className="mx-auto my-5">
            {uploadedUrl && (
                <img src={uploadedUrl} alt="Uploaded Post" className="w-115 h-115 object-cover mb-5" />
            )}
            <div className="mx-auto my-5">
                <ContentUploader userId={userId} onUploadComplete={setUploadedUrl} />
            </div>
        </div>
    );
}