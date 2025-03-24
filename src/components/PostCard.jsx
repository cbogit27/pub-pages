// components/PostCard.js
import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post }) {
  return (
    <div className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        {/* Post Image */}
        {post.image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="rounded-t-lg object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="p-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600 mt-2 line-clamp-3 text-sm">{post.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>By {post.author.name}</span>
            <span> • {post.category.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}