import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { Invoice, Service } from '../types/invoice';

interface InvoicePDFProps {
  invoice: Invoice;
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
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'right',
  },
  invoiceType: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  invoiceInfo: {
    width: '45%',
  },
  billingInfo: {
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
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  clientDetails: {
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
    color: '#DC2626',
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

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, isDetailed = false }) => {
  const subtotal = invoice.services.reduce((total, service) => total + service.value, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

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

  const totalDays = invoice.services.length;
  const totalHours = invoice.services.reduce((total, service) => total + service.hours, 0);

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
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceType}>
              {invoice.type === 'time_based' && isDetailed ? 'Time-Based Invoice (Detailed)' : 
               invoice.type === 'time_based' ? 'Time-Based Invoice' : 'Standard Invoice'}
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>Invoice Details:</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice #:</Text>
              <Text style={styles.detailValue}>{invoice.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issue Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(invoice.createdDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Period:</Text>
              <Text style={styles.detailValue}>{invoice.period}</Text>
            </View>
          </View>
          <View style={styles.billingInfo}>
            <Text style={styles.sectionTitle}>Service User:</Text>
            <Text style={styles.clientName}>{invoice.userName}</Text>
            <Text style={styles.clientDetails}>
              24, Martin Drive,{'\n'}
              Rainham{'\n'}
              Romford{'\n'}
              RM13 9NB
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Summary
          </Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>
              Total Days
            </Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>
              Total Hours
            </Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>
              Sub Total
            </Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>
              Tax (10%)
            </Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>
              Grand Total
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { width: '20%' }]}>{totalDays}</Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>{totalHours}</Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>
              £{subtotal.toFixed(2)}
            </Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>
              £{tax.toFixed(2)}
            </Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>
              £{total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Services Details */}
        <View style={styles.servicesTable}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Service Details
          </Text>
          {renderTableHeaders()}
          {invoice.services.map((service, index) => renderTableRow(service, index))}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { 
              width: invoice.type === 'time_based' && isDetailed ? '56%' : '60%' 
            }]}>
              Total
            </Text>
            {invoice.type === 'time_based' && isDetailed && (
              <Text style={[styles.tableCellText, { width: '12%' }]}></Text>
            )}
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { width: invoice.type === 'time_based' && isDetailed ? '17%' : '20%' }]}>
              £{subtotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Remittance Advice */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
              Remittance advice:
            </Text>
            <Text style={styles.clientDetails}>
              Everycare Romford{'\n'}
              37 High Street,{'\n'}
              Romford{'\n'}
              RM1 1JL
            </Text>
          </View>
          <View style={{ width: '45%' }}>
            <Text style={styles.clientDetails}>
              Customer name: {invoice.userName}{'\n'}
              Service user name: {invoice.userName}{'\n'}
              Invoice date: {new Date(invoice.createdDate).toLocaleDateString()}{'\n'}
              Invoice no: {invoice.id}{'\n'}
              Invoice value: £{subtotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Account details:
          </Text>
          <Text style={styles.clientDetails}>
            Account Name: Everycare Romford{'\n'}
            Sort code: 40-02-33{'\n'}
            Account Number: 72115158{'\n'}
            Please clear the invoice within 4 working days.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your business!{'\n'}
            Payment is due within 30 days of invoice date.{'\n'}
            For questions about this invoice, please contact us at billing@company.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const downloadInvoicePDF = async (invoice: Invoice, isDetailed: boolean = false) => {
  const blob = await pdf(<InvoicePDF invoice={invoice} isDetailed={isDetailed} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const suffix = isDetailed ? 'detailed' : 'normal';
  link.download = `Invoice-${invoice.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default InvoicePDF;