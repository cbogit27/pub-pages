import Profile from '@/components/Profile';
import OtherPosts from '@/components/OtherPosts';

export default function SideBar({ userId, currentPostId }) {
  console.log('SideBar received authorId:', userId);

  return (
    <section className="flex flex-col">
      {/* Profile Section */}
      <section className="w-auto h-auto p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-md font-semibold uppercase">Author</h2>
          </div>
          <Profile userId={userId} />
        </div>
      </section>

      {/* Other Posts Section */}
      <section className="w-auto h-auto rounded-md p-4">
        <div className="space-y-8">
          <div className="border-y border-gray-600 py-2">
            <h4 className="text-md font-light uppercase">Other Posts You Might Like</h4>
          </div>
          <OtherPosts currentPostId={currentPostId} />
        </div>
      </section>
    </section>
  );
}