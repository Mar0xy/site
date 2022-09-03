import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import config from "../lib/config.json";

export default function Header({ title }) {
  const router = useRouter();
  const { blogTitle, navItems, authorName, baseURL, description, twitter } =
    config;
  const pageTitle = title ? `${title} - ${blogTitle}` : blogTitle;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="keywords" content={`${blogTitle}, ${authorName}, Blog`} />
        <meta name="Description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={`${baseURL}${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={blogTitle} />
        <meta property="og:description" content={description} />
        <meta name="twitter:site" content={twitter} />
        <meta name="twitter:card" content="summary" />
        {/* <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" /> */}
      </Head>
      <header className="flex mx-6 my-6 text-gray-500">
        <h2 className="w-28">
          <Link href={"/"}>
            <div className="rounded cursor-pointer bg-gray-100 text-gray-700 dark:bg-opacity-0 dark:text-gray-300 p-2 -mx-2">
              {blogTitle}
            </div>
          </Link>
        </h2>
        <div className="flex-1"></div>
        <div className="flex-4 flex items-center">
          <ul className="flex">
            {navItems.map(item => {
              return (
                <li key={item.label} className="px-3">
                  <Link href={item.path}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </header>
    </>
  );
}
