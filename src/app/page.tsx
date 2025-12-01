import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 slide-in-up">
          <div className="inline-block mb-6">
            <div className="aurora-gradient p-1 rounded-2xl">
              <div className="bg-[var(--background)] px-6 py-2 rounded-xl">
                <span className="aurora-gradient-text font-bold text-sm uppercase tracking-wider">
                  Web3 Meme Contest Platform
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Create Epic
            <br />
            <span className="aurora-gradient-text">Meme Contests</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the ultimate decentralized platform where creativity meets
            blockchain.
            <br />
            Submit memes, vote for the best, and win amazing rewards!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link
              href="/create-contest"
              className="aurora-gradient text-white px-10 py-4 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] float-animation"
            >
              🚀 Create Contest
            </Link>
            <Link
              href="/contests"
              className="glass-strong text-white px-10 py-4 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg border border-white/20 hover:border-[var(--aurora-cyan)]"
            >
              🎨 Browse Contests
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="glass-strong p-6 rounded-xl border border-white/10 card-hover">
              <div className="text-4xl font-bold aurora-gradient-text mb-2">
                1000+
              </div>
              <div className="text-gray-400 font-medium">Active Contests</div>
            </div>
            <div className="glass-strong p-6 rounded-xl border border-white/10 card-hover">
              <div className="text-4xl font-bold aurora-gradient-text mb-2">
                50K+
              </div>
              <div className="text-gray-400 font-medium">Community Members</div>
            </div>
            <div className="glass-strong p-6 rounded-xl border border-white/10 card-hover">
              <div className="text-4xl font-bold aurora-gradient-text mb-2">
                $100K+
              </div>
              <div className="text-gray-400 font-medium">
                Rewards Distributed
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-24">
          <h2 className="text-4xl font-bold text-white text-center mb-12 aurora-gradient-text">
            Why ClipHaus?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-strong p-8 rounded-xl border border-white/10 card-hover slide-in-left">
              <div className="w-16 h-16 aurora-gradient rounded-xl flex items-center justify-center mb-6 float-animation">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Instant voting and real-time results powered by blockchain
                technology.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-xl border border-white/10 card-hover slide-in-up">
              <div
                className="w-16 h-16 aurora-gradient rounded-xl flex items-center justify-center mb-6 float-animation"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Fully Decentralized
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your content, your rules. No central authority, complete
                transparency.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-xl border border-white/10 card-hover slide-in-right">
              <div
                className="w-16 h-16 aurora-gradient rounded-xl flex items-center justify-center mb-6 float-animation"
                style={{ animationDelay: "0.4s" }}
              >
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Earn Rewards
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Win crypto rewards for creating viral content that the community
                loves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
