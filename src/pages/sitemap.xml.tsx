import dbConnect from "@/db/dbConnect";
import { TimeLineModel } from "@/db/models";
import { GetServerSideProps } from "next/types";

function generateSiteMap(urls: string[], tags: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <!--We manually set the two URLs we know already-->
       <url>
         <loc>${process.env.NEXT_PUBLIC_BASE_URL}</loc>
       </url>

       ${tags
         .map((tag) => {
           return `<url>
                <loc>${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/nota/search?tags=${encodeURIComponent(tag)}</loc>
            </url>`;
         })
         .join("")}

       ${urls
         .map((e: string) => {
           return `
         <url>
             <loc>${`${process.env.NEXT_PUBLIC_BASE_URL}/nota/${e}`}</loc>
         </url>`;
         })
         .join("")}
     </urlset>
   `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  await dbConnect();

  // urlSlugs
  const urlObjects = await TimeLineModel.find().select("urlSlug").lean();
  const urls = urlObjects
    .map((obj) => obj.urlSlug)
    .filter((e) => e !== undefined);

  // categories
  const tags = await TimeLineModel.distinct("tags");

  const sitemap = generateSiteMap(urls, tags);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
