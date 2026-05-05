import { Link } from 'react-router-dom';
import { Clock, Shield, Zap, Heart, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Capsule</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-2 px-6">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold mb-8 animate-bounce">
          <Zap className="w-4 h-4" />
          Now with Secure Time-Locking
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Talk to the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-purple-500 to-blue-600">
            Future You.
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Create digital time capsules filled with messages, photos, and videos. 
          Lock them away and schedule them to be opened on your chosen date.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2 group">
            Start Your First Capsule
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
            <Play className="w-5 h-5 fill-current" />
            Watch How it Works
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Time Locking",
              desc: "Once sealed, your capsule cannot be opened until the exact second you specify.",
              icon: Clock,
              color: "bg-blue-500"
            },
            {
              title: "Military Encryption",
              desc: "Your data is encrypted and private. Only intended recipients can ever see your content.",
              icon: Shield,
              color: "bg-purple-500"
            },
            {
              title: "Emotional Milestones",
              desc: "Perfect for birthdays, graduations, or letters to your children when they grow up.",
              icon: Heart,
              color: "bg-pink-500"
            }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-300">
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${feature.color.split('-')[1]}-500/20`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2026 Digital Time Capsule. Bridging today and tomorrow.</p>
      </footer>
    </div>
  );
};

export default Landing;
