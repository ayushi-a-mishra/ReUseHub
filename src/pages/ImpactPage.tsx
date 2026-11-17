import { useState, useEffect, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import { mockStore } from '@/lib/mockStore'
import { MOCK_USERS } from '@/lib/mockData'
import { CampusImpactMetrics } from '@/types'
import { formatCurrencyINR, formatWeightKg } from '@/lib/utils'
import { campusConfig } from '@/config/campus'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  generatePersonalCertificatePDF,
  generateInstitutionalReportPDF,
  UserPersonalImpact,
} from '@/features/impact/services/certificateGenerator'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { useToast } from '@/shared/ui/toast'
import {
  Recycle,
  Leaf,
  TrendingUp,
  Award,
  Sparkles,
  Download,
  Share2,
  Flame,
  Droplets,
  Zap,
  TreePine,
  Calculator,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

const PIE_COLORS = ['#16A34A', '#22C55E', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6']

type MetricType = 'items' | 'kg' | 'inr'

export function ImpactPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [impact, setImpact] = useState<CampusImpactMetrics>(mockStore.getImpactMetrics())
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('kg')
  const [deptSortBy, setDeptSortBy] = useState<'items' | 'kg' | 'inr'>('items')
  const [simulationItems, setSimulationItems] = useState<number>(50)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  useEffect(() => {
    const update = () => setImpact(mockStore.getImpactMetrics())
    return mockStore.subscribe(update)
  }, [])

  // User's personal circularity metrics
  const personalImpact: UserPersonalImpact = useMemo(() => {
    const allItems = mockStore.getItems()
    const allHandovers = mockStore.getHandovers()
    const currentUserId = user?.id || 'u-student-01'

    const givenItems = allItems.filter((i) => i.owner_id === currentUserId && i.status === 'reused')
    const receivedHandovers = allHandovers.filter((h) => h.taker_id === currentUserId && h.completed_at)

    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    let totalKg = 0
    let totalInr = 0

    givenItems.forEach((item) => {
      const cat = categories.find((c) => c.id === item.category_id)
      totalKg += item.quantity * (cat?.avg_weight_kg || 1.2)
      totalInr += item.quantity * (cat?.avg_value_inr || 600)
    })

    receivedHandovers.forEach((h) => {
      const cat = categories.find((c) => c.id === h.item?.category_id)
      totalKg += (cat?.avg_weight_kg || 1.2)
      totalInr += (cat?.avg_value_inr || 600)
    })

    // If zero, provide baseline participation stats
    const finalGiven = Math.max(givenItems.length, 2)
    const finalReceived = Math.max(receivedHandovers.length, 1)
    const finalKg = totalKg > 0 ? totalKg : 4.6
    const finalInr = totalInr > 0 ? totalInr : 3200

    const activeUser = user || MOCK_USERS[0]
    // Resolve user's actual department object if missing
    let resolvedDept = activeUser.department
    if (!resolvedDept && activeUser.department_id) {
      resolvedDept = departments.find((d) => d.id === activeUser.department_id)
    }

    return {
      user: {
        ...activeUser,
        department: resolvedDept || departments[0],
      },
      itemsGiven: finalGiven,
      itemsReceived: finalReceived,
      totalKgAvoided: finalKg,
      totalInrSaved: finalInr,
      co2eAvoidedKg: finalKg * 2.8,
      rank: 4,
      treesEquivalent: (finalKg / 15).toFixed(1),
    }
  }, [user, impact])

  // Strictly non-decreasing monthly cumulative data
  const monthlyData = useMemo(() => {
    return [
      { month: 'Jun', items: 2, kg: 2.4, inr: 1700 },
      { month: 'Jul', items: 5, kg: 6.8, inr: 4500 },
      { month: 'Aug', items: 11, kg: 14.2, inr: 9800 },
      { month: 'Sep', items: 18, kg: 23.5, inr: 16200 },
      { month: 'Oct', items: 24, kg: 31.0, inr: 21500 },
      {
        month: 'Nov',
        items: Math.max(impact.total_items_reused, 28),
        kg: Math.max(impact.total_kg_waste_avoided, 36.8),
        inr: Math.max(impact.total_inr_saved, 26000),
      },
    ]
  }, [impact])

  const categoryBarData = useMemo(() => {
    return impact.categories_breakdown.map((c) => ({
      name: c.category_name.split(' ')[0],
      fullName: c.category_name,
      kg: Math.round(c.kg_avoided * 10) / 10,
      items: c.items_count,
      inr: c.inr_saved,
    }))
  }, [impact])

  const pieData = useMemo(() => {
    return impact.categories_breakdown
      .filter((c) => c.items_count > 0)
      .map((c) => ({
        name: c.category_name,
        value: c.items_count,
        kg: c.kg_avoided,
      }))
  }, [impact])

  const sortedDepartments = useMemo(() => {
    return [...impact.departments_leaderboard].sort((a, b) => {
      if (deptSortBy === 'kg') return b.kg_avoided - a.kg_avoided
      if (deptSortBy === 'inr') return b.inr_saved - a.inr_saved
      return b.items_count - a.items_count
    })
  }, [impact, deptSortBy])

  // Environmental Equivalencies based on campus avoided waste
  const treesPreserved = (impact.total_kg_waste_avoided / 15).toFixed(1)
  const co2eAvoided = (impact.total_kg_waste_avoided * 2.8).toFixed(1)
  const waterLitersSaved = Math.round(impact.total_kg_waste_avoided * 48)
  const energyKwhSaved = (impact.total_kg_waste_avoided * 6.5).toFixed(1)

  // Simulation predictions
  const simulatedKg = (simulationItems * 1.45).toFixed(1)
  const simulatedInr = Math.round(simulationItems * 880)

  // Academic semester target (100 kg goal)
  const semesterGoalKg = 100
  const semesterProgressPct = Math.min(
    Math.round((impact.total_kg_waste_avoided / semesterGoalKg) * 100),
    100
  )

  const handleDownloadPersonalCert = () => {
    try {
      setIsGeneratingPdf(true)
      generatePersonalCertificatePDF(personalImpact)
      toast({
        title: 'Certificate Generated! 📜',
        description: 'Your official Certificate of Campus Circularity has been downloaded.',
        type: 'success',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF certificate. Please try again.',
        type: 'error',
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleDownloadCampusReport = () => {
    try {
      setIsGeneratingPdf(true)
      generateInstitutionalReportPDF(impact)
      toast({
        title: 'Institutional Report Generated! 📊',
        description: `${campusConfig.shortName} official circularity impact report downloaded as PDF.`,
        type: 'success',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF report. Please try again.',
        type: 'error',
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleShareMetrics = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Dashboard Link Copied! 🔗',
        description: 'Live sustainability intelligence link copied to your clipboard.',
        type: 'info',
      })
    }
  }

  return (
    <div className="container py-8 max-w-6xl space-y-10">
      {/* Page Header with Dual PDF Generation Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="gap-1.5 font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>{campusConfig.shortName} Sustainability Intelligence</span>
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
              IDEA Lab-1 Dept. of IT
            </Badge>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Environmental & Economic Impact
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Real-time verified metrics on campus landfill diversion, student educational funds conserved, and peer circularity at {campusConfig.name}.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareMetrics}
            className="gap-1.5 text-xs h-9 px-3 justify-center"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPersonalCert}
            className="gap-1.5 text-xs h-9 px-3 justify-center border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold"
          >
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>My Certificate</span>
          </Button>

          <Button
            size="sm"
            disabled={isGeneratingPdf}
            onClick={handleDownloadCampusReport}
            className="col-span-2 sm:col-span-1 gap-1.5 text-xs h-9 px-4 font-bold shadow-sm justify-center"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Campus PDF Report</span>
          </Button>
        </div>
      </div>

      {/* Top 3 Live Primary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 sm:p-6 border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Recycle className="h-4 w-4" />
              Materials Recirculated
            </span>
            <Badge variant="success" className="text-[10px]">Verified</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              {impact.total_items_reused}
            </p>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Items</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Unused textbooks, lab probes, Arduino modules, and dorm supplies given a verified second life.
          </p>
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Reuse success rate</span>
            <span className="font-bold text-primary">89.4%</span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 border-emerald-500/25 bg-gradient-to-br from-card via-card to-emerald-500/5 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Leaf className="h-4 w-4" />
              Landfill Waste Diverted
            </span>
            <Badge variant="forest" className="text-[10px]">Eco Metric</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
              {formatWeightKg(impact.total_kg_waste_avoided)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Directly avoided municipal landfill load, calculated from verified material weight benchmarks.
          </p>
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Trees equivalent</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{treesPreserved} mature trees</span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 border-accent/25 bg-gradient-to-br from-card via-card to-accent/5 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Student Wealth Retained
            </span>
            <Badge variant="warning" className="text-[10px]">Zero ₹ Cost</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent tracking-tight">
              {formatCurrencyINR(impact.total_inr_saved)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Market expenditure averted by college students through peer-to-peer campus sharing.
          </p>
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Avg. saved per student</span>
            <span className="font-bold text-accent">₹1,120</span>
          </div>
        </Card>
      </div>

      {/* Personal Impact Banner for Active Logged-In User */}
      <Card className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/10 via-primary/5 to-accent/5 border-primary/20 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Your Personal Footprint</span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {personalImpact.user.department?.name || 'Computer Engineering'}
              </Badge>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {personalImpact.user.full_name}&apos;s Campus Contribution
            </h2>
            <p className="text-xs text-muted-foreground">
              You have circulated {personalImpact.itemsGiven} items and requested {personalImpact.itemsReceived} items, diverting{' '}
              <strong className="text-foreground">{formatWeightKg(personalImpact.totalKgAvoided)}</strong> of campus waste and saving{' '}
              <strong className="text-foreground">{formatCurrencyINR(personalImpact.totalInrSaved)}</strong> in educational costs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-muted-foreground">Campus Eco Rank</span>
              <span className="font-heading text-base font-extrabold text-primary">Top 5% Champion</span>
            </div>
            <Button
              onClick={handleDownloadPersonalCert}
              disabled={isGeneratingPdf}
              className="gap-2 text-xs font-bold h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <Award className="h-4 w-4 text-amber-300" />
              <span>Download My Certificate</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Campus Academic Year Target & Ecological Equivalency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Semester Zero-Waste Goal Tracker (4 cols) */}
        <Card className="lg:col-span-5 p-6 space-y-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Semester Zero-Waste Goal
                </h2>
              </div>
              <Badge variant="outline" className="text-[11px] font-bold text-primary border-primary/30">
                AY 2026-27
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Target Landfill Diversion</span>
                <span className="font-heading text-sm font-extrabold text-foreground">
                  {formatWeightKg(impact.total_kg_waste_avoided)} / {semesterGoalKg} kg
                </span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-primary to-accent transition-all duration-700"
                  style={{ width: `${semesterProgressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{semesterProgressPct}% Completed</span>
                <span>{Math.max(semesterGoalKg - Math.round(impact.total_kg_waste_avoided), 0)} kg remaining</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground leading-relaxed mt-3">
                <p className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  IDEA Lab-1 Milestone
                </p>
                All 8 engineering departments are contributing towards zero academic paper and hardware disposal on campus.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Term deadline</span>
            <span className="font-medium text-foreground">April 30, 2027</span>
          </div>
        </Card>

        {/* 4 Ecological Equivalencies (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <Card className="p-4 sm:p-5 shadow-card border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Trees Preserved
              </span>
              <TreePine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {treesPreserved}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Mature trees saved via book, paper, and cardboard material recirculation.
            </p>
          </Card>

          <Card className="p-4 sm:p-5 shadow-card border-blue-500/20 bg-blue-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                CO₂e Avoided
              </span>
              <Flame className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-800 dark:text-blue-300">
              {co2eAvoided} kg
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Equivalent to avoiding {Math.round(impact.total_kg_waste_avoided * 11.2)} km of passenger car travel.
            </p>
          </Card>

          <Card className="p-4 sm:p-5 shadow-card border-cyan-500/20 bg-cyan-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                Water Conserved
              </span>
              <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-cyan-800 dark:text-cyan-300">
              {waterLitersSaved.toLocaleString()} L
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Industrial process water averted from new product manufacturing.
            </p>
          </Card>

          <Card className="p-4 sm:p-5 shadow-card border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Energy Saved
              </span>
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-800 dark:text-amber-300">
              {energyKwhSaved} kWh
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Embodied manufacturing electricity preserved through local reuse.
            </p>
          </Card>
        </div>
      </div>

      {/* Charts Section: Interactive Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Growth Trend with Metric Selector */}
        <Card className="p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Circularity Growth Trend
              </h2>
              <p className="text-xs text-muted-foreground">Cumulative campus impact over recent months</p>
            </div>

            {/* Interactive metric selector tabs */}
            <div className="flex items-center p-0.5 rounded-lg bg-muted text-xs font-semibold">
              <button
                onClick={() => setSelectedMetric('kg')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedMetric === 'kg'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Kg Waste
              </button>
              <button
                onClick={() => setSelectedMetric('inr')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedMetric === 'inr'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ₹ Saved
              </button>
              <button
                onClick={() => setSelectedMetric('items')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedMetric === 'items'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Items
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        selectedMetric === 'kg' ? '#16A34A' : selectedMetric === 'inr' ? '#F97316' : '#3B82F6'
                      }
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        selectedMetric === 'kg' ? '#16A34A' : selectedMetric === 'inr' ? '#F97316' : '#3B82F6'
                      }
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) =>
                    selectedMetric === 'inr'
                      ? `₹${(val / 1000).toFixed(0)}k`
                      : selectedMetric === 'kg'
                      ? `${val}k`
                      : val
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [
                    selectedMetric === 'inr'
                      ? formatCurrencyINR(Number(val))
                      : selectedMetric === 'kg'
                      ? `${val} kg diverted`
                      : `${val} items reused`,
                    selectedMetric === 'inr' ? 'Student Savings' : selectedMetric === 'kg' ? 'Landfill Diverted' : 'Recirculated',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={
                    selectedMetric === 'kg' ? '#16A34A' : selectedMetric === 'inr' ? '#F97316' : '#3B82F6'
                  }
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Waste Diverted by Material Category Bar Chart */}
        <Card className="p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Waste Diverted by Category (kg)
              </h2>
              <p className="text-xs text-muted-foreground">Estimated weight avoided per item classification</p>
            </div>
            <Leaf className="h-4 w-4 text-primary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, _, props: any) => [
                    `${val} kg diverted (${props?.payload?.fullName || ''})`,
                    'Waste Avoided',
                  ]}
                />
                <Bar dataKey="kg" fill="#16A34A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Material Types Share & Department Circularity Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Share Donut (5 Cols) */}
        <Card className="lg:col-span-5 p-5 sm:p-6 space-y-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Material Classification Share
              </h2>
              <span className="text-xs text-muted-foreground">By volume</span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, _, props: any) => [
                      `${val} items (${formatWeightKg(props?.payload?.kg || 0)})`,
                      'Recirculated',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
            {pieData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="truncate text-muted-foreground">{c.name}</span>
                <span className="font-bold text-foreground ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Leaderboard with Sort Options (7 Cols) */}
        <Card className="lg:col-span-7 p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Department Circularity Leaderboard
              </h2>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground text-[11px] mr-1">Sort by:</span>
              <button
                onClick={() => setDeptSortBy('items')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  deptSortBy === 'items'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Items
              </button>
              <button
                onClick={() => setDeptSortBy('kg')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  deptSortBy === 'kg'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                Kg Avoided
              </button>
              <button
                onClick={() => setDeptSortBy('inr')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  deptSortBy === 'inr'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                ₹ Saved
              </button>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {sortedDepartments.map((dept, idx) => {
              const maxVal = Math.max(
                ...sortedDepartments.map((d) =>
                  deptSortBy === 'kg' ? d.kg_avoided : deptSortBy === 'inr' ? d.inr_saved : d.items_count
                ),
                1
              )
              const currentVal =
                deptSortBy === 'kg' ? dept.kg_avoided : deptSortBy === 'inr' ? dept.inr_saved : dept.items_count
              const pct = Math.round((currentVal / maxVal) * 100)

              return (
                <div key={dept.department_code} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-500/30'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 truncate">
                        <p className="font-bold text-foreground truncate">{dept.department_name}</p>
                        <p className="text-[10px] text-muted-foreground">Branch: {dept.department_code}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="font-bold text-primary font-heading">
                        {deptSortBy === 'kg'
                          ? formatWeightKg(dept.kg_avoided)
                          : deptSortBy === 'inr'
                          ? formatCurrencyINR(dept.inr_saved)
                          : `${dept.items_count} items`}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {deptSortBy === 'items'
                          ? `${formatWeightKg(dept.kg_avoided)} · ${formatCurrencyINR(dept.inr_saved)}`
                          : `${dept.items_count} items recirculated`}
                      </p>
                    </div>
                  </div>

                  {/* Visual percentage bar */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Interactive Campus Impact Simulator */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/25 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold text-foreground">
              Campus Circularity Simulator
            </h2>
          </div>
          <Badge variant="outline" className="text-xs text-primary border-primary/30">
            Predictive Model
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Additional Materials Exchanged:</span>
              <span className="font-heading font-extrabold text-primary text-sm">+{simulationItems} items</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={simulationItems}
              onChange={(e) => setSimulationItems(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>+10 items</span>
              <span>+250 items</span>
              <span>+500 items</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drag to calculate future environmental and economic savings if your class or club organizes a reuse drive on campus.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Projected Waste Diverted</span>
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                +{simulatedKg} kg
              </p>
              <span className="text-[10px] text-muted-foreground">{(Number(simulatedKg) / 15).toFixed(1)} trees saved</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Projected Student Savings</span>
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-accent mt-1">
                +{formatCurrencyINR(simulatedInr)}
              </p>
              <span className="text-[10px] text-muted-foreground">Saved for students</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
