'use client'

const testimonials = [
  {
    quote: "Prix cut our PR review time by 80%. The auto-fix feature is a game changer for our open source projects.",
    name: "ShaikhWarsi",
    handle: "@ShaikhWarsi",
    role: "Open Source Maintainer",
    initials: "SW"
  },
  {
    quote: "Finally an AI tool that actually fixes code instead of just pointing out problems. Our team ships faster with Prix.",
    name: "Rachit Tiwari",
    handle: "@RachitTiwari",
    role: "Software Engineer",
    initials: "RT"
  }
]

export function SocialProofSection() {
  return (
    <section className="section-padding bg-[#0a0a0f] border-y border-white/[0.03]">
      <div className="section-container">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-base p-8"
              >
                <blockquote className="text-[15px] text-white/70 leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center bg-[#121218]">
                    <span className="text-sm font-bold text-white/60">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/40">{testimonial.handle}</p>
                    <p className="text-xs text-primary mt-0.5">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Integrations</span>
            <div className="flex items-center gap-10">
              {['GitHub', 'GitLab', 'VS Code', 'JetBrains'].map((brand) => (
                <span key={brand} className="text-sm font-medium text-white/30">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
