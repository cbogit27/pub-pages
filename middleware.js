export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;
      
      // Public routes
      if (path.startsWith('/api/auth')) return true;
      
      // Admin-only routes
      if (path.startsWith('/dashboard')) {
        return token?.role === 'ADMIN';
      }

      return !!token;
    }
  }
});