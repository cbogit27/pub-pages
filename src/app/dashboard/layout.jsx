import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto py-8">{children}</main>
      </div>
    );
  }
  