export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'purple',
  badge,
  className = '',
  onClick,
  children,
}) => {
  const iconColorStyles = {
    purple: 'bg-[#190e30] text-purple-400 border-purple-500/30',
    cyan: 'bg-[#08202d] text-cyan-400 border-cyan-500/30',
    magenta: 'bg-[#230f36] text-fuchsia-400 border-fuchsia-500/30',
    amber: 'bg-[#291707] text-amber-400 border-amber-500/30',
    emerald: 'bg-[#08221c] text-emerald-400 border-emerald-500/30',
  };

  return (
    <Card
      onClick={onClick}
      hover={!!onClick}
      className={`p-5 relative overflow-hidden group card-lift bg-[#0d081a]/90 border border-[#23143f] hover:border-purple-500/40 shadow-card ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-2 rounded-xl border ${iconColorStyles[color] || iconColorStyles.purple} shrink-0 transition-transform group-hover:scale-105`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</p>
        </div>
        {badge && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#180e2e] border border-purple-500/30 text-purple-300">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3.5 flex items-baseline gap-2">
        <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-slate-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>}

      {children}
    </Card>
  );
};
