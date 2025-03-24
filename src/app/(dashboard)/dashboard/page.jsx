import PostsListPage from "../components/post-list";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPostsList() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/");
  }

  return (
    <>
      <PostsListPage />
    </>
  );
}