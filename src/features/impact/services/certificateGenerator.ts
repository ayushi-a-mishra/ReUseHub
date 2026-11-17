import { jsPDF } from 'jspdf'
import { campusConfig } from '@/config/campus'
import { CampusImpactMetrics, Profile } from '@/types'
import { formatCurrencyINR, formatWeightKg } from '@/lib/utils'

export interface UserPersonalImpact {
  user: Profile
  itemsGiven: number
  itemsReceived: number
  totalKgAvoided: number
  totalInrSaved: number
  co2eAvoidedKg: number
  rank: number
  treesEquivalent: string
}

/**
 * Generates an official Certificate of Campus Circularity (A4 Landscape)
 */
export function generatePersonalCertificatePDF(impactData: UserPersonalImpact): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const width = doc.internal.pageSize.getWidth() // 297mm
  const height = doc.internal.pageSize.getHeight() // 210mm
  const certId = `SLRTCE-CIRC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // 1. Background fill
  doc.setFillColor(254, 255, 254)
  doc.rect(0, 0, width, height, 'F')

  // 2. Double Border with Corner Accents
  doc.setDrawColor(20, 83, 45) // Deep forest green
  doc.setLineWidth(1.5)
  doc.rect(8, 8, width - 16, height - 16)

  doc.setDrawColor(217, 119, 6) // Gold accent
  doc.setLineWidth(0.6)
  doc.rect(11, 11, width - 22, height - 22)

  // Decorative corner corner squares
  doc.setFillColor(217, 119, 6)
  const cSize = 4
  doc.rect(8, 8, cSize, cSize, 'F')
  doc.rect(width - 8 - cSize, 8, cSize, cSize, 'F')
  doc.rect(8, height - 8 - cSize, cSize, cSize, 'F')
  doc.rect(width - 8 - cSize, height - 8 - cSize, cSize, cSize, 'F')

  // 3. Institution Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(20, 83, 45)
  doc.text(campusConfig.name.toUpperCase(), width / 2, 24, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(
    `DEPARTMENT OF INFORMATION TECHNOLOGY · IDEA LAB-1 · THEME: "DIGITAL EMPOWERMENT FOR ALL"`,
    width / 2,
    30,
    { align: 'center' }
  )

  // Divider line
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.4)
  doc.line(30, 33, width - 30, 33)

  // 4. Main Certificate Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(22, 101, 52) // Emerald 800
  doc.text('CERTIFICATE OF CAMPUS CIRCULARITY', width / 2, 45, { align: 'center' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text('This is formally presented to recognize campus zero-waste circular stewardship', width / 2, 51, {
    align: 'center',
  })

  // 5. Recipient Name & Details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42) // Dark Slate
  doc.text(impactData.user.full_name, width / 2, 65, { align: 'center' })

  // Subtle line under name
  const nameWidth = doc.getTextWidth(impactData.user.full_name)
  doc.setDrawColor(22, 163, 74)
  doc.setLineWidth(0.8)
  doc.line(width / 2 - nameWidth / 2 - 5, 68, width / 2 + nameWidth / 2 + 5, 68)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(71, 85, 105)
  const roleTitle = impactData.user.role === 'faculty' ? 'Faculty Member' : 'Student Scholar'
  const deptName = impactData.user.department?.name || 'Computer Engineering'
  doc.text(
    `${roleTitle} · Department of ${deptName} · ID: ${impactData.user.roll_number || 'SLRTCE-2026'}`,
    width / 2,
    75,
    { align: 'center' }
  )

  // 6. Citation Statement
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(51, 65, 85)
  const citation = `For actively advancing the peer-to-peer circular economy at ${campusConfig.shortName} via ReUseHub. By giving unused textbooks, lab hardware, and academic equipment a verified second life, the recipient has prevented landfill accumulation and reduced unnecessary consumption.`
  const splitCitation = doc.splitTextToSize(citation, 210)
  doc.text(splitCitation, width / 2, 85, { align: 'center' })

  // 7. Four Impact Stat Cards in a row
  const cardWidth = 52
  const cardHeight = 28
  const startX = 35
  const gap = 9
  const cardY = 104

  const stats = [
    {
      label: 'MATERIALS REUSED',
      value: `${impactData.itemsGiven + impactData.itemsReceived} Units`,
      sub: `${impactData.itemsGiven} given · ${impactData.itemsReceived} claimed`,
      color: [22, 163, 74], // green
    },
    {
      label: 'LANDFILL AVOIDED',
      value: formatWeightKg(impactData.totalKgAvoided),
      sub: `${impactData.treesEquivalent} trees preserved`,
      color: [13, 148, 136], // teal
    },
    {
      label: 'STUDENT FUNDS SAVED',
      value: formatCurrencyINR(impactData.totalInrSaved),
      sub: 'Zero ₹ exchanged',
      color: [217, 119, 6], // amber
    },
    {
      label: 'CO2e PREVENTED',
      value: `${impactData.co2eAvoidedKg.toFixed(1)} kg`,
      sub: 'Greenhouse gas averted',
      color: [37, 99, 235], // blue
    },
  ]

  stats.forEach((stat, idx) => {
    const x = startX + idx * (cardWidth + gap)

    // Card background
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 2.5, 2.5, 'F')

    // Top color strip
    doc.setFillColor(stat.color[0], stat.color[1], stat.color[2])
    doc.roundedRect(x, cardY, cardWidth, 2, 1, 1, 'F')

    // Card text
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.text(stat.label, x + cardWidth / 2, cardY + 8, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2])
    doc.text(stat.value, x + cardWidth / 2, cardY + 17, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(100, 116, 139)
    doc.text(stat.sub, x + cardWidth / 2, cardY + 23, { align: 'center' })
  })

  // 8. Seal & Verification Box
  const sealY = 146
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(startX, sealY, 70, 22, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(30, 41, 59)
  doc.text('VERIFIED CAMPUS CREDENTIAL', startX + 5, sealY + 6)

  doc.setFont('courier', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(71, 85, 105)
  doc.text(`ID: ${certId}`, startX + 5, sealY + 11)
  doc.text(`DATE: ${issueDate}`, startX + 5, sealY + 15)
  doc.text(`BLOCK: IDEA-LAB-1/CIRCULARITY`, startX + 5, sealY + 19)

  // 9. Signatures Block
  const sigY = 158

  // Left Signature
  doc.setDrawColor(148, 163, 184)
  doc.setLineWidth(0.5)
  doc.line(160, sigY, 205, sigY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(30, 41, 59)
  doc.text('Dr. S. K. Mehta', 182.5, sigY + 5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('Convenor, IDEA Lab-1 & Innovation Council', 182.5, sigY + 9, { align: 'center' })

  // Right Signature
  doc.line(220, sigY, 265, sigY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(30, 41, 59)
  doc.text('Prof. Rajesh Verma', 242.5, sigY + 5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('Sustainability Cell Faculty Lead', 242.5, sigY + 9, { align: 'center' })

  // 10. Footer Tagline
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.setTextColor(148, 163, 184)
  doc.text(
    `${campusConfig.tagline} · ReUseHub Campus PWA · ${campusConfig.shortName} Official Circular Economy Initiative`,
    width / 2,
    196,
    { align: 'center' }
  )

  // Save the PDF
  const cleanName = impactData.user.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_')
  doc.save(`reusehub_certificate_${cleanName}_${Date.now()}.pdf`)
}

/**
 * Generates the Official Institutional Sustainability Dossier & Impact Report (A4 Portrait)
 */
export function generateInstitutionalReportPDF(metrics: CampusImpactMetrics): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const width = doc.internal.pageSize.getWidth() // 210mm
  const height = doc.internal.pageSize.getHeight() // 297mm
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Header band
  doc.setFillColor(20, 83, 45) // Forest green
  doc.rect(0, 0, width, 32, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(255, 255, 255)
  doc.text(campusConfig.name.toUpperCase(), 14, 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(209, 250, 229)
  doc.text(
    `DEPARTMENT OF INFORMATION TECHNOLOGY · IDEA LAB-1 · CAMPUS ZERO-WASTE REPORT`,
    14,
    19
  )
  doc.text(`PUBLISHED: ${issueDate} · STATUS: OFFICIAL AUDIT`, 14, 25)

  // Document Title
  let curY = 44
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42)
  doc.text('Campus Sustainability & Circularity Report', 14, curY)

  curY += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(
    'Comprehensive real-time assessment of materials recirculated, waste averted, and student cost avoidance.',
    14,
    curY
  )

  // 3 Primary Metric Callout Boxes
  curY += 10
  const boxW = 58
  const boxH = 26
  const primaryBoxes = [
    {
      title: 'MATERIALS RECIRCULATED',
      val: `${metrics.total_items_reused} Items`,
      sub: '100% peer handovers',
      color: [22, 163, 74],
    },
    {
      title: 'LANDFILL AVOIDED',
      val: formatWeightKg(metrics.total_kg_waste_avoided),
      sub: 'Calculated benchmark',
      color: [13, 148, 136],
    },
    {
      title: 'STUDENT WEALTH SAVED',
      val: formatCurrencyINR(metrics.total_inr_saved),
      sub: 'Zero ₹ exchanged',
      color: [217, 119, 6],
    },
  ]

  primaryBoxes.forEach((box, i) => {
    const x = 14 + i * (boxW + 4)
    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.4)
    doc.roundedRect(x, curY, boxW, boxH, 2, 2, 'FD')

    // Color marker
    doc.setFillColor(box.color[0], box.color[1], box.color[2])
    doc.roundedRect(x, curY, boxW, 1.5, 0.75, 0.75, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.text(box.title, x + boxW / 2, curY + 8, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(box.color[0], box.color[1], box.color[2])
    doc.text(box.val, x + boxW / 2, curY + 16, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(148, 163, 184)
    doc.text(box.sub, x + boxW / 2, curY + 22, { align: 'center' })
  })

  // Environmental Equivalencies Section
  curY += boxH + 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('Campus Ecological Equivalency Benchmarks', 14, curY)

  curY += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('Standardized environmental translation formulas based on academic material lifecycle models:', 14, curY)

  curY += 6
  const eqCols = [
    {
      title: 'Mature Trees Equivalent',
      value: `${(metrics.total_kg_waste_avoided / 15).toFixed(1)} Trees`,
      desc: 'Based on paper & wood pulp retention',
    },
    {
      title: 'Greenhouse Gas (CO2e)',
      value: `${(metrics.total_kg_waste_avoided * 2.8).toFixed(1)} kg CO2e`,
      desc: `Equivalent to ${(metrics.total_kg_waste_avoided * 11.2).toFixed(0)} km car travel`,
    },
    {
      title: 'Industrial Water Saved',
      value: `${(metrics.total_kg_waste_avoided * 48).toFixed(0)} Litres`,
      desc: 'Production lifecycle water avoidance',
    },
    {
      title: 'Embodied Energy Saved',
      value: `${(metrics.total_kg_waste_avoided * 6.5).toFixed(1)} kWh`,
      desc: 'Manufacturing & processing electricity',
    },
  ]

  eqCols.forEach((eq, idx) => {
    const x = 14 + (idx % 2) * 93
    const y = curY + Math.floor(idx / 2) * 16

    doc.setFillColor(241, 245, 249)
    doc.roundedRect(x, y, 89, 13, 1.5, 1.5, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(30, 41, 59)
    doc.text(eq.title, x + 4, y + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(22, 101, 52)
    doc.text(eq.value, x + 85, y + 5, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(100, 116, 139)
    doc.text(eq.desc, x + 4, y + 10)
  })

  // Department Circularity Leaderboard Table
  curY += 38
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('Department Circularity Leaderboard', 14, curY)

  curY += 5
  // Table Header
  doc.setFillColor(241, 245, 249)
  doc.rect(14, curY, 182, 7, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105)
  doc.text('RANK', 17, curY + 5)
  doc.text('DEPARTMENT NAME & BRANCH', 32, curY + 5)
  doc.text('ITEMS REUSED', 118, curY + 5, { align: 'right' })
  doc.text('WASTE AVERTED (KG)', 154, curY + 5, { align: 'right' })
  doc.text('STUDENT SAVINGS', 192, curY + 5, { align: 'right' })

  curY += 7
  metrics.departments_leaderboard.forEach((dept, index) => {
    const isEven = index % 2 === 0
    if (isEven) {
      doc.setFillColor(248, 250, 252)
      doc.rect(14, curY, 182, 6.5, 'F')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(30, 41, 59)
    doc.text(`#${index + 1}`, 17, curY + 4.5)

    doc.setFont('helvetica', 'normal')
    doc.text(`${dept.department_name} (${dept.department_code})`, 32, curY + 4.5)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(22, 101, 52)
    doc.text(`${dept.items_count}`, 118, curY + 4.5, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    doc.text(formatWeightKg(dept.kg_avoided), 154, curY + 4.5, { align: 'right' })
    doc.text(formatCurrencyINR(dept.inr_saved), 192, curY + 4.5, { align: 'right' })

    curY += 6.5
  })

  // Category Breakdown Summary
  curY += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('Material Category Distribution', 14, curY)

  curY += 5
  doc.setFillColor(241, 245, 249)
  doc.rect(14, curY, 182, 7, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105)
  doc.text('CATEGORY CLASSIFICATION', 17, curY + 5)
  doc.text('ITEMS RECIRCULATED', 118, curY + 5, { align: 'right' })
  doc.text('TOTAL KG AVOIDED', 154, curY + 5, { align: 'right' })
  doc.text('EST. MARKET VALUE', 192, curY + 5, { align: 'right' })

  curY += 7
  metrics.categories_breakdown.forEach((cat, index) => {
    const isEven = index % 2 === 0
    if (isEven) {
      doc.setFillColor(248, 250, 252)
      doc.rect(14, curY, 182, 6.5, 'F')
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(30, 41, 59)
    doc.text(cat.category_name, 17, curY + 4.5)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(22, 101, 52)
    doc.text(`${cat.items_count}`, 118, curY + 4.5, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    doc.text(formatWeightKg(cat.kg_avoided), 154, curY + 4.5, { align: 'right' })
    doc.text(formatCurrencyINR(cat.inr_saved), 192, curY + 4.5, { align: 'right' })

    curY += 6.5
  })

  // Footer Verification Block
  const footerY = height - 20
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.4)
  doc.line(14, footerY - 4, width - 14, footerY - 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text(
    `Official Audit Report generated by ReUseHub Campus Platform · ${campusConfig.name} (${campusConfig.shortName})`,
    14,
    footerY
  )
  doc.text(
    `IDEA Lab-1 Dept. of Information Technology · Zero-Currency Policy Enforced · Contact: ${campusConfig.supportEmail}`,
    14,
    footerY + 4
  )

  doc.save(`reusehub_campus_impact_report_${Date.now()}.pdf`)
}
