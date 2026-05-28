export default function BackgroundGradients() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[-10%] left-[-15%] w-[80%] sm:w-[60%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/3 to-transparent blur-[80px] sm:blur-[140px]" />
      <div className="absolute top-[25%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] rounded-full bg-gradient-to-br from-cyan-500/8 via-[#6366F1]/3 to-transparent blur-[80px] sm:blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[70%] sm:w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-500/8 via-emerald-500/3 to-transparent blur-[80px] sm:blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
