import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";
import {
  Users,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  Target,
  Layers,
  UserCheck,
  Zap,
} from "lucide-react";

const COLORS = ['#00d4ff', '#00ff88', '#ff6b6b', '#ffd93d', '#8884d8', '#82ca9d', '#ff8042'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg">
      <p className="text-xs text-muted-foreground font-mono mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-primary">{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function MarketCharts({ analytics, outcomes }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analytics) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChartIcon },
    { id: 'traders', label: 'Traders', icon: Users },
    { id: 'outcomes', label: 'Outcomes', icon: Target },
    { id: 'volume', label: 'Volume', icon: DollarSign },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  // Prepare pie data for buy/sell ratio
  const buySellPieData = analytics.buySellData || [
    { name: 'Buys', value: analytics.buySellRatio || 50, fill: '#00ff88' },
    { name: 'Sells', value: 100 - (analytics.buySellRatio || 50), fill: '#ff6b6b' }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-primary/20 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-mono rounded-lg transition-all ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Buy/Sell Ratio Donut */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-primary" />
                Buy vs Sell Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={buySellPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {buySellPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
                  <span className="text-muted-foreground">Buys</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
                  <span className="text-muted-foreground">Sells</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-secondary/20">
                  <div className="text-xl font-bold text-primary">{analytics.recentActivity || 0}</div>
                  <div className="text-xs text-muted-foreground">24h Trades</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/20">
                  <div className="text-xl font-bold text-neon-green">{analytics.uniqueTraders || 0}</div>
                  <div className="text-xs text-muted-foreground">Unique Traders</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/20">
                  <div className="text-xl font-bold text-yellow-500">{analytics.totalTrades || 0}</div>
                  <div className="text-xs text-muted-foreground">Total Trades</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/20">
                  <div className="text-xl font-bold text-purple-500">{analytics.avgTradeSize || 0}</div>
                  <div className="text-xs text-muted-foreground">Avg Trade Size</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buy vs Sell by Outcome */}
          {analytics.outcomePositions && analytics.outcomePositions.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Buy vs Sell by Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={analytics.outcomePositions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="buys" stackId="a" fill="#00ff88" name="Buys" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sells" stackId="a" fill="#ff6b6b" name="Sells" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="net" stroke="#00d4ff" strokeWidth={2} name="Net" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Traders Tab */}
      {activeTab === 'traders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Position Holders */}
          {analytics.topHolders && analytics.topHolders.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Top Position Holders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.topHolders.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalShares" fill="#00d4ff" name="Total Shares" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Most Active Traders */}
          {analytics.topTraders && analytics.topTraders.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Most Active Traders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.topTraders.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tradeCount" fill="#00ff88" name="Trades" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Traders by Volume */}
          {analytics.topTradersByVolume && analytics.topTradersByVolume.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Top Traders by Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.topTradersByVolume.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" fill="#ffd93d" name="Volume" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Position Concentration */}
          {analytics.concentrationData && analytics.concentrationData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Position Concentration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics.concentrationData}>
                    <defs>
                      <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(200 20% 60%)' }} angle={-30} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="percentage" stroke="#8884d8" fillOpacity={1} fill="url(#colorConc)" name="Cumulative %" />
                    <Line type="monotone" dataKey="shares" stroke="#ff8042" strokeWidth={2} name="Shares" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Outcomes Tab - Per Outcome Charts */}
      {activeTab === 'outcomes' && (
        <div className="space-y-4">
          {/* Probability vs Volume Scatter */}
          {analytics.probVolumeData && analytics.probVolumeData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Probability vs Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis type="number" dataKey="probability" name="Probability" unit="%" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis type="number" dataKey="volume" name="Volume" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg">
                              <p className="font-semibold text-primary">{data.name}</p>
                              <p className="text-sm">Probability: {data.probability}%</p>
                              <p className="text-sm">Volume: {data.volume?.toFixed(2)} tokens</p>
                              <p className="text-sm">Shares: {data.shares?.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter data={analytics.probVolumeData} fill="#00d4ff" name="Outcomes" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Holders by Outcome - Per Person Per Outcome */}
          {analytics.topHoldersByOutcome && Object.keys(analytics.topHoldersByOutcome).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Top Holders by Outcome
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.topHoldersByOutcome).map(([outcome, holders], idx) => (
                  <div key={outcome}>
                    <h4 className="text-xs font-mono text-primary mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {outcome}
                    </h4>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={holders.slice(0, 4)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                        <XAxis type="number" tick={{ fontSize: 9, fill: 'hsl(200 20% 60%)' }} />
                        <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 9, fill: 'hsl(200 20% 60%)' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="shares" fill={COLORS[idx % COLORS.length]} name="Shares" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Volume Tab */}
      {activeTab === 'volume' && (
        <div className="grid grid-cols-1 gap-4">
          {/* Cumulative Volume */}
          {analytics.cumulativeData && analytics.cumulativeData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Cumulative Trading Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={analytics.cumulativeData}>
                    <defs>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis dataKey="trade" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cumulative" stroke="#00d4ff" strokeWidth={2} fillOpacity={1} fill="url(#colorCumulative)" name="Cumulative" />
                    <Line type="monotone" dataKey="volume" stroke="#ff8042" strokeWidth={2} name="Trade Volume" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Volume by Outcome */}
          {analytics.outcomePositions && analytics.outcomePositions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Volume by Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.outcomePositions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="buys" fill="#00ff88" name="Buys" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="grid grid-cols-1 gap-4">
          {/* Recent Activity by Top Holders */}
          {analytics.recentActivityByHolders && analytics.recentActivityByHolders.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Recent Activity by Top Holders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.recentActivityByHolders.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(187 100% 50% / 0.1)" />
                    <XAxis dataKey="holder" tick={{ fontSize: 9, fill: 'hsl(200 20% 60%)' }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(200 20% 60%)' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-lg">
                              <p className="font-semibold text-primary">{data.holder}</p>
                              <p className="text-sm">Outcome: {data.outcome}</p>
                              <p className="text-sm">Volume: {data.volume?.toFixed(2)} tokens</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="volume" fill="#ff8042" name="Volume" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity List */}
          {analytics.recentActivityByHolders && analytics.recentActivityByHolders.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Recent Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {analytics.recentActivityByHolders.slice(0, 10).map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate max-w-[100px]">{activity.holder}</span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary/30 rounded">{activity.outcome}</span>
                      </div>
                      <span className="font-mono text-sm text-primary">{activity.volume?.toFixed(1)} tokens</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
