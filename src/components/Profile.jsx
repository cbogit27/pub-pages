"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Profile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId); // Debug log
        const response = await fetch(`/api/profile?userId=${userId}`);
        if (!response.ok) {
          console.error('Failed to fetch profile:', response.statusText); // Debug log
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        console.log('Profile data:', data); // Debug log
        setProfile(data);
      } catch (error) {
        console.error('Profile fetch error:', error); // Debug log
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-xs">Loading profile...</div>;
  if (!profile) return <div>No profile available</div>;

  return (
    <div className="space-y-4 text-sm font-light">
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar || profile.user.image || '/default-avatar.png'}
          alt={profile.user.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h3 className="font-medium">{profile.user.name}</h3>
          <p className="text-gray-600">{profile.bio || 'No bio available'}</p>
        </div>
      </div>
    </div>
  );
}