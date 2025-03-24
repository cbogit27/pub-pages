import { signIn } from 'next-auth/react'

export default function SignInPrompt() {
  return (
    <div className="bg-blue-400 p-4 rounded-lg border border-blue-200">
      <p className="text-blue-800">
        Please{' '}
        <button
          onClick={() => signIn('google')}
          className="text-blue-600 hover:underline font-medium"
        >
          sign in with Google
        </button>{' '}
        to post a comment.
      </p>
    </div>
  )
}