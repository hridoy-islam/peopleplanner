import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { Invoice, Service } from '../types/invoice'; // Reuse types if they fit, or create Payslip type later

interface PayslipPDFProps {
  invoice: Invoice; // Reusing Invoice type for now (could rename to Payslip later)
  isDetailed?: boolean;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  logo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  companyDetails: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.2,
  },
  payslipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937', // Changed from red to neutral
    textAlign: 'right',
  },
  payslipType: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  payslipDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  payslipInfo: {
    width: '45%',
  },
  employeeInfo: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 8,
    color: '#6B7280',
    width: '50%',
  },
  detailValue: {
    fontSize: 8,
    color: '#1F2937',
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'right',
  },
  employeeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  employeeDetails: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.2,
  },
  servicesTable: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableCellText: {
    fontSize: 8,
    color: '#1F2937',
  },
  summary: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669', // Green for earnings
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 1.2,
  },
});

const PayslipPDF: React.FC<PayslipPDFProps> = ({ invoice, isDetailed = false }) => {
  const subtotal = invoice.services.reduce((total, service) => total + service.value, 0);
  const tax = subtotal * 0.2; // Assuming 20% tax (UK income tax approx)
  const netPay = subtotal - tax;
  const totalHours = invoice.services.reduce((total, service) => total + service.hours, 0);
  const totalDays = invoice.services.length;

  const renderTableHeaders = () => {
    if (invoice.type === 'time_based' && isDetailed) {
      return (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Date</Text>
          <Text style={[styles.tableHeaderText, { width: '12%' }]}>Start</Text>
          <Text style={[styles.tableHeaderText, { width: '12%' }]}>End</Text>
          <Text style={[styles.tableHeaderText, { width: '12%' }]}>Hours</Text>
          <Text style={[styles.tableHeaderText, { width: '15%' }]}>Type</Text>
          <Text style={[styles.tableHeaderText, { width: '17%' }]}>Rate</Text>
          <Text style={[styles.tableHeaderText, { width: '17%' }]}>Value</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Date</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Hours</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Type</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Rate</Text>
          <Text style={[styles.tableHeaderText, { width: '20%' }]}>Value</Text>
        </View>
      );
    }
  };

  const renderTableRow = (service: Service, index: number) => {
    if (invoice.type === 'time_based' && isDetailed) {
      return (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCellText, { width: '15%' }]}>
            {new Date(service.date).toLocaleDateString()}
          </Text>
          <Text style={[styles.tableCellText, { width: '12%' }]}>
            {service.startTime || 'N/A'}
          </Text>
          <Text style={[styles.tableCellText, { width: '12%' }]}>
            {service.endTime || 'N/A'}
          </Text>
          <Text style={[styles.tableCellText, { width: '12%' }]}>
            {service.hours}
          </Text>
          <Text style={[styles.tableCellText, { width: '15%' }]}>
            {service.type}
          </Text>
          <Text style={[styles.tableCellText, { width: '17%' }]}>
            £{service.rate.toFixed(2)}
          </Text>
          <Text style={[styles.tableCellText, { width: '17%' }]}>
            £{service.value.toFixed(2)}
          </Text>
        </View>
      );
    } else {
      return (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCellText, { width: '20%' }]}>
            {new Date(service.date).toLocaleDateString()}
          </Text>
          <Text style={[styles.tableCellText, { width: '20%' }]}>
            {service.hours}
          </Text>
          <Text style={[styles.tableCellText, { width: '20%' }]}>
            {service.type}
          </Text>
          <Text style={[styles.tableCellText, { width: '20%' }]}>
            £{service.rate.toFixed(2)}
          </Text>
          <Text style={[styles.tableCellText, { width: '20%' }]}>
            £{service.value.toFixed(2)}
          </Text>
        </View>
      );
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.companyName}>Everycare Romford</Text>
            <Text style={styles.companyDetails}>
              37 High Street,{'\n'}
              Romford{'\n'}
              RM1 1JL
            </Text>
          </View>
          <View>
            <Text style={styles.payslipTitle}>Payslip</Text>
            <Text style={styles.payslipType}>
              {invoice.type === 'time_based' && isDetailed
                ? 'Time-Based (Detailed)'
                : invoice.type === 'time_based'
                ? 'Time-Based'
                : 'Standard'}
            </Text>
          </View>
        </View>

        {/* Payslip Details */}
        <View style={styles.payslipDetails}>
          <View style={styles.payslipInfo}>
            <Text style={styles.sectionTitle}>Payslip Details:</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payslip #:</Text>
              <Text style={styles.detailValue}>{invoice.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Period:</Text>
              <Text style={styles.detailValue}>{invoice.period}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issue Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(invoice.createdDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Hours:</Text>
              <Text style={styles.detailValue}>{totalHours} hrs</Text>
            </View>
          </View>
          <View style={styles.employeeInfo}>
            <Text style={styles.sectionTitle}>Employee:</Text>
            <Text style={styles.employeeName}>{invoice.userName}</Text>
            <Text style={styles.employeeDetails}>
              Employee ID: {invoice.userId}{'\n'}
              Position: Caregiver{'\n'}
              Pay Frequency: Bi-weekly
            </Text>
          </View>
        </View>

        {/* Earnings Summary */}
        <View style={styles.summary}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Earnings Summary
          </Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>Total Hours</Text>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>Gross Pay</Text>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>Tax (20%)</Text>
            <Text style={[styles.tableHeaderText, { width: '25%' }]}>Net Pay</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { width: '25%' }]}>{totalHours}</Text>
            <Text style={[styles.tableCellText, { width: '25%' }]}>£{subtotal.toFixed(2)}</Text>
            <Text style={[styles.tableCellText, { width: '25%' }]}>£{tax.toFixed(2)}</Text>
            <Text style={[styles.tableCellText, { width: '25%' }]}>£{netPay.toFixed(2)}</Text>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.servicesTable}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Worked Services
          </Text>
          {renderTableHeaders()}
          {invoice.services.map((service, index) => renderTableRow(service, index))}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { 
              width: invoice.type === 'time_based' && isDetailed ? '56%' : '60%' 
            }]}>
              Total
            </Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { 
              width: invoice.type === 'time_based' && isDetailed ? '17%' : '20%' 
            }]}>
              £{subtotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Payment Method:
          </Text>
          <Text style={styles.employeeDetails}>
            Direct Bank Transfer{'\n'}
            Account Name: {invoice.userName}{'\n'}
            Sort Code: ••••••{'\n'}
            Account Number: ••••••••{'\n'}
            Payment Date: {new Date(invoice.dueDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a digital payslip.{'\n'}
            For any discrepancies, contact payroll@everycare.co.uk{'\n'}
            © {new Date().getFullYear()} Everycare Romford. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Exported function to download payslip PDF
export const downloadPayslipPDF = async (invoice: Invoice, isDetailed: boolean = false) => {
  const blob = await pdf(<PayslipPDF invoice={invoice} isDetailed={isDetailed} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const suffix = isDetailed ? 'detailed' : 'normal';
  link.download = `Payslip-${invoice.id}-${suffix}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default PayslipPDF;