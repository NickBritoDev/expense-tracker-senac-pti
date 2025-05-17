import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { ChevronDown, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Expense } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ExportOptionsProps {
  expenses: Expense[];
}

export default function ExportOptions({ expenses }: ExportOptionsProps) {
  const toast = useToast();

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

     
      doc.setFontSize(18);
      doc.text('Relatório de Despesas', 14, 22);
      
     
      doc.setFontSize(11);
      doc.text(`Gerado em: ${formatDate(new Date())}`, 14, 30);
      
     
      const headers = [['Data', 'Item', 'Valor', 'Qtd', 'Forma de Pagamento', 'Total']];
      
     
      const data = expenses.map(expense => [
        formatDate(expense.date),
        expense.item,
        formatCurrency(expense.value),
        expense.quantity.toString(),
        getPaymentMethodLabel(expense.paymentMethod),
        formatCurrency(expense.total)
      ]);
      
     
     
      doc.autoTable({
        head: headers,
        body: data,
        startY: 40,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [0, 120, 215] },
        alternateRowStyles: { fillColor: [240, 245, 250] }
      });
      
     
      const total = expenses.reduce((sum, expense) => sum + expense.total, 0);
      
     
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      
     
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: ${formatCurrency(total)}`, 14, finalY + 10);
      
     
      doc.save('relatorio-despesas.pdf');
      
      toast({
        title: 'Relatório exportado',
        description: 'O relatório foi exportado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar o relatório',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const exportToCSV = () => {
    try {
     
      const headers = ['Data', 'Item', 'Valor', 'Quantidade', 'Forma de Pagamento', 'Total'];
      
     
      const rows = expenses.map(expense => [
        formatDate(expense.date),
        expense.item,
        expense.value.toString(),
        expense.quantity.toString(),
        expense.paymentMethod,
        expense.total.toString()
      ]);
      
     
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
     
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
     
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'despesas.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'CSV exportado',
        description: 'Os dados foram exportados em formato CSV',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar os dados',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'Cash': return 'Dinheiro';
      case 'Credit Card': return 'Cartão de Crédito';
      case 'Debit Card': return 'Cartão de Débito';
      case 'Pix': return 'Pix';
      default: return method;
    }
  };
  
  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDown />} leftIcon={<FileDown size={18} />}>
          Exportar
        </MenuButton>
        <MenuList>
          <MenuItem onClick={exportToPDF}>Exportar como PDF</MenuItem>
          <MenuItem onClick={exportToCSV}>Exportar como CSV</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}