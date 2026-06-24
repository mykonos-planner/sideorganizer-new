import Link from 'next/link'

const fakeQuests = [
  'Run 5km',
  'Read 20 pages',
  'Meditate 10min',
  'Learn 3 words in Japanese',
  'Do 50 pushups',
]

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center fade-in">
      <h1 className="font-orbitron text-6xl md:text-8xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        SideOrganizer
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-blue-300">
        Organize your life, conquer your missions.
      </p>

      <div className="relative w-full max-w-3xl overflow-hidden mt-10 py-4 border-y border-blue-500/20">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[...fakeQuests, ...fakeQuests].map((quest, i) => (
            <span key={i} className="mx-6 text-lg font-medium text-blue-400">
              {quest}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 flex gap-6">
        <Link
          href="/auth"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
        >
          Log In
        </Link>
        <Link
          href="/auth"
          className="px-8 py-3 rounded-full border border-blue-500 text-blue-400 font-semibold hover:bg-blue-500/10 transition-all hover:scale-105"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
