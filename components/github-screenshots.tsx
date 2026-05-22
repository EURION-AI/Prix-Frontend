'use client'

import Image from 'next/image'
import { Lightning as Zap } from '@phosphor-icons/react'
import { GitPullRequest } from 'lucide-react'

export function ConversationScreenshot() {
  return (
    <div className="w-full overflow-hidden border border-white/[0.12] bg-[#0d0d12] rounded-xl shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#121218]/50 border-b border-white/[0.1]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#238636] rounded-full uppercase tracking-wider flex items-center gap-1">
            <GitPullRequest className="w-3 h-3" />
            Open
          </span>
          <h3 className="text-[12px] font-bold text-white opacity-95">Fix memory leak in AuthProvider</h3>
          <span className="text-white/40 text-[12px] font-medium">#427</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.1] text-[9px] font-bold uppercase tracking-widest px-4">
        <div className="py-2 text-primary border-b-2 border-primary mr-5 relative">
          Review
        </div>
        <div className="py-2 text-white/40 mr-5">Files changed <span className="text-[8px] bg-white/10 px-1 py-0.5 rounded-full ml-0.5">12</span></div>
        <div className="py-2 text-white/40 mr-5">Commits <span className="text-[8px] bg-white/10 px-1 py-0.5 rounded-full ml-0.5">2</span></div>
        <div className="py-2 text-white/40">Checks <span className="text-[8px] bg-white/10 px-1 py-0.5 rounded-full ml-0.5">3</span></div>
      </div>

      <div className="p-4">
        {/* Bot Info Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-black border border-white/20 flex items-center justify-center">
            <Image src="/logo.png" alt="Prix" width={14} height={16} className="brightness-150" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-white text-[11px] opacity-95">PrixAI</span>
              <span className="px-1 py-0.25 text-[7px] font-black bg-white/10 text-white/70 rounded uppercase">bot</span>
            </div>
            <span className="text-[8px] text-white/40 tracking-tight">reviewed 19 hours ago</span>
          </div>
          <button className="ml-auto px-2 py-0.5 text-[8px] font-bold text-white/70 bg-white/5 border border-white/15 rounded hover:bg-white/10 transition-colors">
            View changes
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-[#121218] border border-white/[0.1] rounded-lg p-3.5 space-y-3">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-white opacity-95">
            <span className="text-sm">🤖</span>
            PRIX AI Review
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[9px] font-mono text-[#3b82ff] underline opacity-90">43a535c</div>
            <p className="text-[10px] text-white/50">Reviewing 3 files...</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white opacity-90">
              <span className="text-xs">⚠️</span>
              Issues detected: 10
            </div>
            <div className="text-[10px] text-white/60 ml-5">
              • 10 issues need attention
            </div>
          </div>

          <div className="h-px bg-white/[0.08]" />

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white opacity-90">
              <span className="text-pink-500">🛠️</span>
              Fix all issues instantly
            </div>
            <div className="flex flex-wrap gap-1 ml-5">
              {['data_processor.py', 'math_utils.py', 'string_utils.py'].map(file => (
                <div key={file} className="text-[9px] font-mono bg-white/5 px-1.5 py-0.25 rounded border border-white/[0.1] text-white/80">
                  {file}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.08]" />

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white opacity-90">
              <span className="text-yellow-600">📂</span>
              Files affected
            </div>
            <div className="flex flex-wrap gap-1 ml-5">
              {['data_processor.py', 'math_utils.py', 'string_utils.py'].map(file => (
                <div key={file} className="text-[9px] font-mono bg-white/5 px-1.5 py-0.25 rounded border border-white/[0.1] text-white/80">
                  {file}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.08]" />

          <div className="flex items-center gap-1.5 text-[10px] text-white/80">
            <span>💡</span>
            Use <code className="px-1 py-0.25 bg-white/10 rounded text-[8px] font-mono border border-white/5">!prix fix</code> to auto-generate fixes.
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
            <span>▶️</span>
            <span className="flex items-center gap-1">
              <span className="text-[9px]">🤖</span> Master AI Prompt
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DiffScreenshot() {
  return (
    <div className="w-full overflow-hidden border border-[#30363d] bg-[#0d1117] rounded-lg">
      <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="px-[6px] py-[2px] text-[11px] font-semibold text-white bg-[#238636] rounded-[2rem] leading-none">Open</span>
          <span className="text-sm font-semibold text-[#e6edf3]">Fix missing validation in API route handler</span>
          <span className="text-[#8b949e] text-sm">#429</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#8b949e]">
          <span className="text-[#e6edf3]">PrixAI</span>
          <span>wants to merge 1 commit into</span>
          <span className="text-[#58a6ff]">main</span>
          <span>from</span>
          <span className="text-[#58a6ff]">fix/missing-validation</span>
        </div>
      </div>

      <div className="flex border-b border-[#30363d] text-xs">
        <div className="px-4 py-2 text-[#8b949e]">Conversation</div>
        <div className="px-4 py-2 text-[#8b949e]">Commits</div>
        <div className="px-4 py-2 text-[#8b949e]">Checks</div>
        <div className="px-4 py-2 text-[#e6edf3] font-semibold border-b-2 border-[#f78166]">Files changed</div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 px-4 py-2 mb-3 text-xs bg-[#161b22] border border-[#30363d] rounded-t-md">
          <span className="font-mono text-[#e6edf3] text-xs">src/api/users.ts</span>
          <span className="ml-auto text-[#3fb950]">+8</span>
          <span className="text-[#f85149]">-1</span>
        </div>

        <div className="font-mono text-xs leading-[1.6] border-x border-b border-[#30363d] rounded-b-md overflow-hidden">
          <div className="flex px-4 py-1 bg-[#161b22] text-[#8b949e] text-[10px] border-b border-[#30363d]">
            <span className="w-8 text-right shrink-0 mr-4">23</span>
            <span className="w-8 text-right shrink-0 mr-4">24</span>
            <span className="text-[#e6edf3]">{'@@ -23,7 +23,15 @@ export async function POST(req: Request) {' + '{' + '}'}</span>
          </div>

          <div className="flex px-4 py-1 bg-[#f85149]/[0.12] border-l-2 border-[#f85149]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">23</span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">23</span>
            <span className="text-[#f85149]"><span className="font-bold">-</span>  const data = await req.json()</span>
          </div>

          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">23</span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">23</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>  const schema = z.object({'{'}</span>
          </div>
          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none"></span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">24</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>    name: z.string().min(1),</span>
          </div>
          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none"></span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">25</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>    email: z.string().email(),</span>
          </div>
          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none"></span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">26</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>    role: z.enum(['admin', 'user', 'viewer']),</span>
          </div>
          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none"></span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">27</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>{'  });'}</span>
          </div>
          <div className="flex px-4 py-1 bg-[#3fb950]/[0.12] border-l-2 border-[#3fb950]">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none"></span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">28</span>
            <span className="text-[#3fb950]"><span className="font-bold">+</span>  const data = schema.parse(await req.json())</span>
          </div>
          <div className="flex px-4 py-1">
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">24</span>
            <span className="w-8 text-right shrink-0 mr-4 text-[#8b949e] select-none">29</span>
            <span className="text-[#e6edf3]">  // ... rest of handler</span>
          </div>
        </div>

        <div className="mt-4 p-4 border border-[#30363d] rounded-lg bg-[#161b22]">
          <p className="text-xs font-semibold text-[#e6edf3] mb-1">PR Description</p>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            This PR adds input validation to the <code className="text-xs text-[#f0883e] font-mono">POST /api/users</code> endpoint.
            Prix detected that user input was passed directly to the database without validation.
          </p>
          <p className="text-xs text-[#58a6ff] mt-2">Closes #418</p>
        </div>
      </div>
    </div>
  )
}

export function SummaryScreenshot() {
  return (
    <div className="w-full overflow-hidden border border-[#30363d] bg-[#0d1117] rounded-lg">
      <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="px-[6px] py-[2px] text-[11px] font-semibold text-white bg-[#238636] rounded-[2rem] leading-none">Open</span>
          <span className="text-sm font-semibold text-[#e6edf3]">Refactor authentication middleware</span>
          <span className="text-[#8b949e] text-sm">#436</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#8b949e]">
          <span className="text-[#e6edf3]">PrixAI</span>
          <span>wants to merge 3 commits into</span>
          <span className="text-[#58a6ff]">main</span>
          <span>from</span>
          <span className="text-[#58a6ff]">refactor/auth-middleware</span>
        </div>
      </div>

      <div className="flex border-b border-[#30363d] text-xs">
        <div className="px-4 py-2 text-[#e6edf3] font-semibold border-b-2 border-[#f78166]">Files changed</div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-[#8b949e] mb-4 pb-3 border-b border-[#30363d]">
          <span className="text-[#e6edf3] font-medium">11 files analyzed</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#8b949e]" />
          <span className="text-[#e6edf3] font-medium">8,247 lines reviewed</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#8b949e]" />
          <span className="text-[#f85149] font-medium">4 issues found</span>
        </div>

        <div className="overflow-hidden border border-[#30363d] rounded-lg text-xs">
          <div className="grid grid-cols-[1fr_60px_80px] text-[11px] text-[#8b949e] bg-[#161b22] border-b border-[#30363d]">
            <div className="px-3 py-2 font-medium">File</div>
            <div className="px-3 py-2 font-medium text-right">Issues</div>
            <div className="px-3 py-2 font-medium">Severity</div>
          </div>
          {[
            { file: 'src/middleware/auth.ts', issues: 2, severity: 'error, warning' },
            { file: 'src/handlers/users.ts', issues: 1, severity: 'error' },
            { file: 'src/lib/session.ts', issues: 1, severity: 'warning' },
            { file: 'src/utils/validation.ts', issues: 0, severity: '\u2014' },
            { file: 'src/types/index.ts', issues: 0, severity: '\u2014' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_60px_80px] border-b border-[#30363d] last:border-b-0">
              <div className="px-3 py-2 font-mono text-[11px] text-[#e6edf3]">{row.file}</div>
              <div className={`px-3 py-2 text-right font-medium ${row.issues > 0 ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>{row.issues}</div>
              <div className="px-3 py-2 text-[#8b949e]">{row.severity}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 px-3 py-2 text-xs text-[#8b949e] bg-[#161b22] border border-[#30363d] rounded-lg">
          <span className="text-[#e6edf3] font-medium">4 issues</span> found across <span className="text-[#e6edf3] font-medium">3 modules</span>. <span className="text-[#f85149]">1 critical</span>, <span className="text-[#d29922]">2 warnings</span>, <span className="text-[#8b949e]">1 info</span>.
        </div>
      </div>
    </div>
  )
}
