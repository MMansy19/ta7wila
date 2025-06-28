import getPostData from "@/lib/posts";
export const dynamic = 'force-dynamic';

export default async function Documentation() {
  const postData = await getPostData("documentation");

  return (
    
    <div className="container  mx-auto p-4  w-full bg-neutral-900 rounded-xl mt-4" dir='ltr' >
      <div
        className="prose *:text-white prose-strong:text-white max-w-full p-4 "
        style={{color: "white"}}
        dangerouslySetInnerHTML={{
          __html: postData.contentHtml,
        }}
      ></div>
    </div>

  );
}



