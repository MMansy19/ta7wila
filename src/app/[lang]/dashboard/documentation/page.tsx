import getPostData from "@/lib/posts";
import { BookOpen, FileText, Code, Lightbulb } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Documentation() {
  const postData = await getPostData("documentation");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/30 flex-shrink-0">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg">
                Complete guide and API reference
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="mb-6">
          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="p-4 sm:p-6">
              {/* Content Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700/50">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white min-w-0 flex-1">API Documentation</h2>
              </div>

              {/* Documentation Content */}
              <div className="w-full" dir='ltr'>
                <div
                  className="documentation-content w-full
                             [&_h1]:text-xl sm:[&_h1]:text-2xl lg:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-white [&_h1]:border-b [&_h1]:border-slate-700/50 [&_h1]:pb-3
                             [&_h2]:text-lg sm:[&_h2]:text-xl lg:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:text-blue-300 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:flex-wrap
                             [&_h3]:text-base sm:[&_h3]:text-lg lg:[&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:text-emerald-300
                             [&_h4]:text-sm sm:[&_h4]:text-base [&_h4]:font-medium [&_h4]:mb-2 [&_h4]:text-purple-300
                             [&_p]:text-xs sm:[&_p]:text-sm lg:[&_p]:text-base [&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:break-words
                             [&_code]:bg-slate-800/60 [&_code]:text-blue-400 [&_code]:px-1 sm:[&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:break-all [&_code]:whitespace-pre-wrap
                             [&_pre]:bg-slate-900/80 [&_pre]:border [&_pre]:border-slate-700/50 [&_pre]:rounded-xl [&_pre]:p-2 sm:[&_pre]:p-3 [&_pre]:mb-4 [&_pre]:text-xs sm:[&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:max-w-full
                             [&_pre_code]:bg-transparent [&_pre_code]:text-green-400 [&_pre_code]:p-0 [&_pre_code]:whitespace-pre [&_pre_code]:text-xs
                             [&_ul]:mb-3 [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-slate-300 [&_li]:mb-1 [&_li]:pl-2 [&_li]:break-words
                             [&_ol]:mb-3 [&_ol_li]:text-xs sm:[&_ol_li]:text-sm [&_ol_li]:text-slate-300 [&_ol_li]:mb-1 [&_ol_li]:pl-2 [&_ol_li]:break-words
                             [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:bg-slate-800/40 [&_blockquote]:p-2 sm:[&_blockquote]:p-3 [&_blockquote]:rounded-r-xl [&_blockquote]:mb-4 [&_blockquote]:break-words
                             [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_table]:bg-slate-800/30 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs sm:[&_table]:text-sm
                             [&_th]:bg-slate-700/50 [&_th]:text-white [&_th]:font-semibold [&_th]:p-1 sm:[&_th]:p-2 [&_th]:text-left [&_th]:border-b [&_th]:border-slate-600/50 [&_th]:break-words [&_th]:text-xs sm:[&_th]:text-sm
                             [&_td]:text-slate-300 [&_td]:p-1 sm:[&_td]:p-2 [&_td]:border-b [&_td]:border-slate-700/30 [&_td]:break-words [&_td]:text-xs sm:[&_td]:text-sm [&_td]:max-w-[120px] sm:[&_td]:max-w-[200px] [&_td]:overflow-hidden
                             [&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:transition-colors [&_a]:underline [&_a]:decoration-blue-500/50 [&_a]:break-all [&_a]:text-xs sm:[&_a]:text-sm
                             [&_strong]:text-white [&_strong]:font-semibold
                             [&_em]:text-yellow-300 [&_em]:italic"
        dangerouslySetInnerHTML={{
          __html: postData.contentHtml,
        }}
                />
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-400">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs sm:text-sm break-words min-w-0 flex-1">
                    Need help? Contact our support team or check the FAQ section for quick answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:shadow-blue-500/10 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Code className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white min-w-0 flex-1">API Reference</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Complete API endpoints and parameters documentation
            </p>
          </div>

          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:shadow-emerald-500/10 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <BookOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white min-w-0 flex-1">Guides</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Step-by-step tutorials and implementation guides
            </p>
          </div>

          <div className="backdrop-blur-sm bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white min-w-0 flex-1">Examples</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Code examples and best practices for integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



