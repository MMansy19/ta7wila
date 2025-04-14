import * as fs from "fs";
import matter from "gray-matter";
import * as path from "path";
import { remark } from "remark";
import html from "remark-html";

export default async function getPostData(id: string): Promise<{
  id: string;
  contentHtml: string;
  [key: string]: any;
}> {
  const filePath = path.join(process.cwd(), "public", `${id}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
