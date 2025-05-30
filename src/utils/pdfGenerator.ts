
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency } from './currency'
import { ReportTransaction } from '@/hooks/useReports'

// Estendendo o tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface PDFReportData {
  transactions: ReportTransaction[]
  summaryData: {
    receitas: number
    despesas: number
    saldo: number
    totalTransactions: number
  }
  filters: {
    startDate: string
    endDate: string
    type: string
    categoryId: string
    period: string
  }
  userName: string
}

export const generatePDFReport = (data: PDFReportData) => {
  const doc = new jsPDF()
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  let yPosition = margin

  // Cabeçalho
  doc.setFontSize(20)
  doc.text('Relatório Financeiro', margin, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.text(`Usuário: ${data.userName}`, margin, yPosition)
  yPosition += 8
  doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, margin, yPosition)
  yPosition += 15

  // Período do relatório
  let periodText = 'Período: '
  switch (data.filters.period) {
    case 'day':
      periodText += 'Hoje'
      break
    case 'month':
      periodText += 'Este Mês'
      break
    case 'year':
      periodText += 'Este Ano'
      break
    case 'custom':
      if (data.filters.startDate && data.filters.endDate) {
        periodText += `${new Date(data.filters.startDate).toLocaleDateString('pt-BR')} - ${new Date(data.filters.endDate).toLocaleDateString('pt-BR')}`
      } else {
        periodText += 'Período Personalizado'
      }
      break
    default:
      periodText += 'Todos os Períodos'
  }
  doc.text(periodText, margin, yPosition)
  yPosition += 15

  // Resumo financeiro
  doc.setFontSize(16)
  doc.text('Resumo Financeiro', margin, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.text(`Total de Receitas: ${formatCurrency(data.summaryData.receitas)}`, margin, yPosition)
  yPosition += 8
  doc.text(`Total de Despesas: ${formatCurrency(data.summaryData.despesas)}`, margin, yPosition)
  yPosition += 8
  doc.text(`Saldo: ${formatCurrency(data.summaryData.saldo)}`, margin, yPosition)
  yPosition += 8
  doc.text(`Total de Transações: ${data.summaryData.totalTransactions}`, margin, yPosition)
  yPosition += 20

  // Tabela de transações
  if (data.transactions.length > 0) {
    doc.setFontSize(16)
    doc.text('Detalhes das Transações', margin, yPosition)
    yPosition += 10

    const tableData = data.transactions.map(transaction => [
      transaction.quando ? new Date(transaction.quando).toLocaleDateString('pt-BR') : '-',
      transaction.estabelecimento || 'Sem estabelecimento',
      transaction.categorias?.nome || 'Sem categoria',
      transaction.tipo || '-',
      `${transaction.tipo === 'receita' ? '+' : '-'}${formatCurrency(Math.abs(transaction.valor || 0))}`
    ])

    doc.autoTable({
      head: [['Data', 'Estabelecimento', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        4: { halign: 'right' }
      },
      margin: { left: margin, right: margin },
    })
  }

  // Salvar o PDF
  const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
