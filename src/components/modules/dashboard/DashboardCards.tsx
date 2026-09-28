'use client';

interface DashboardCardsProps {
  data: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    totalProduction: number;
    trends: {
      sales: string;
      expenses: string;
      netProfit: string;
    };
  };
}

export default function DashboardCards({ data }: DashboardCardsProps) {
  const salesTrendPositive = data.trends.sales?.startsWith('+');
  const expTrendPositive = data.trends.expenses?.startsWith('+');

  const smallCards = [
    {
      title: 'Monthly Spending',
      value: data.totalExpenses.toLocaleString(),
      unit: 'Birr',
      trend: data.trends.expenses,
      trendPositive: expTrendPositive,
      accent: '#ef4444',
      accentBg: 'rgba(239,68,68,0.08)',
    },
    {
      title: 'Net Profit',
      value: data.netProfit.toLocaleString(),
      unit: 'Birr',
      trend: data.trends.netProfit,
      trendPositive: data.trends.netProfit?.startsWith('+'),
      accent: '#6366f1',
      accentBg: 'rgba(99,102,241,0.08)',
    },
    {
      title: 'Units Built',
      value: data.totalProduction.toLocaleString(),
      unit: 'Units',
      trend: null,
      trendPositive: true,
      accent: '#8b5cf6',
      accentBg: 'rgba(139,92,246,0.08)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto',
      gap: '16px',
    }}
      className="dashboard-cards-grid"
    >
      {/* ── BIG PRIMARY CARD ── */}
      <div style={{
        gridColumn: '1 / 2',
        gridRow: '1 / 4',
        background: 'linear-gradient(145deg, #059669 0%, #10b981 60%, #34d399 100%)',
        borderRadius: '20px',
        padding: '28px 28px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
        minHeight: '200px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow circle decoration */}
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '-30px', right: '60px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
        }} />

        <div>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '11px',
            fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            margin: 0, marginBottom: '12px'
          }}>
            Total Revenue
          </p>
          <p style={{
            color: '#fff', fontSize: '40px', fontWeight: 900,
            letterSpacing: '-1px', margin: 0, lineHeight: 1
          }}>
            {data.totalSales.toLocaleString()}
            <span style={{ fontSize: '18px', fontWeight: 500, opacity: 0.7, marginLeft: '6px' }}>Birr</span>
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          {data.trends.sales && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff', fontSize: '12px', fontWeight: 600,
              padding: '4px 10px', borderRadius: '20px'
            }}>
              {salesTrendPositive ? '↑' : '↓'} {data.trends.sales} vs last month
            </span>
          )}
        </div>
      </div>

      {/* ── 3 SMALL SECONDARY CARDS ── */}
      {smallCards.map((card) => (
        <div key={card.title} style={{
          gridColumn: '2 / 3',
          background: '#fff',
          borderRadius: '16px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f3f4f6',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Left accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: '3px', borderRadius: '0 4px 4px 0',
            background: card.accent,
          }} />

          <p style={{
            color: '#9ca3af', fontSize: '10px', fontWeight: 700,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            margin: 0, marginBottom: '8px'
          }}>
            {card.title}
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
            <p style={{
              color: '#111827', fontSize: '22px', fontWeight: 800,
              letterSpacing: '-0.5px', margin: 0, lineHeight: 1
            }}>
              {card.value}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginLeft: '4px' }}>
                {card.unit}
              </span>
            </p>

            {card.trend && card.trend !== '0%' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                background:
                  card.trend === 'New' ? 'rgba(59,130,246,0.1)'
                  : card.trendPositive ? 'rgba(16,185,129,0.1)'
                  : 'rgba(239,68,68,0.1)',
                color:
                  card.trend === 'New' ? '#3b82f6'
                  : card.trendPositive ? '#10b981'
                  : '#ef4444',
                fontSize: '11px', fontWeight: 700,
                padding: '3px 8px', borderRadius: '20px', flexShrink: 0
              }}>
                {card.trend === 'New' ? '✦ New' : (card.trendPositive ? '↑' : '↓') + ' ' + card.trend}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 640px) {
          .dashboard-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-cards-grid > div:first-child {
            grid-column: 1 / 2 !important;
            grid-row: auto !important;
            min-height: 160px !important;
          }
          .dashboard-cards-grid > div:not(:first-child) {
            grid-column: 1 / 2 !important;
          }
        }
      `}</style>
    </div>
  );
}