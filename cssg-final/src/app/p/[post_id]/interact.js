'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Interact({ post_id, user }) {
    const supabase = createClientComponentClient();
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            const { data } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', post_id)
                .eq('user_id', user.id)
                .maybeSingle();

            if (data) setLiked(true);
        };

        fetchLikeStatus();
    }, [post_id, user.id, supabase]);


    const handleLike = async () => {
        setLiked(!liked);

        if (!liked) {
            await supabase.from('likes').insert({
                post_id,
                user_id: user.id,
            });
        } else {
            await supabase
                .from('likes')
                .delete()
                .eq('post_id', post_id)
                .eq('user_id', user.id);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        await supabase.from('comments').insert({
            post_id,
            user_id: user.id,
            content: comment.trim(),
        });
        setComment('');
        setSubmitting(false);
        window.location.reload();
    };

    return (
        <div className="flex flex-col space-y-4 mt-4">
            <div className="flex items-center space-x-4">
                <button onClick={handleLike}>
                    <Image
                        src={liked ? "/icons/like-icon-red.svg" : "/icons/like-icon.svg"}
                        alt="Like"
                        width={36}
                        height={36}
                        className="cursor-pointer"
                    />
                </button>
                <Image
                    src="/icons/comment-icon.svg"
                    alt="Comment"
                    width={36}
                    height={36}
                />
            </div>
            <form onSubmit={handleComment} className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 p-2 rounded bg-zinc-700 text-white"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Post
                </button>
            </form>
        </div>
    );
}