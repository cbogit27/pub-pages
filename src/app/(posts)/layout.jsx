import Header from "@/components/Header";
import MainPost from "./posts/[slug]/@mainPost/page";
import SideBar from "./posts/[slug]/@sideBar/page";
import Socials from "./posts/[slug]/@socials/page";
import Footer from "@/components/Footer";

export default function Layout({ children, mainPost, sideBar, socials, authorId, currentPostId }) {
  return (
    <main>
      <Header/>
      {children}
      <div className="flex flex-col md:flex-row mt-6 gap-4 px-2">
        {/* Socials (Hidden on mobile, sticky on desktop) */}
        <div className="hidden md:flex md:w-[140px] md:h-auto lg:h-screen md:sticky top-0">
          <Socials>{socials}</Socials>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[600px] lg:w-[820px] flex-auto">
          <MainPost>{mainPost}</MainPost>
        </div>

        {/* Sidebar (Sticky on desktop) */}
        <div className="w-full md:w-[280px] lg:w-[300px] md:h-auto lg:h-screen md:sticky top-0">
          <SideBar authorId={authorId} currentPostId={currentPostId}>
            {sideBar}
          </SideBar>
        </div>
      </div>
      <Footer/>
    </main>
  );
}