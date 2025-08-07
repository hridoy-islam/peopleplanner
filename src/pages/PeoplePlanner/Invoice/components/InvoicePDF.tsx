import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'draft' | 'ready' | 'finalized' | 'paid' | 'partially_paid' | 'unpaid';
  createdDate: string;
  dueDate: string;
  serviceCount: number;
  period: string;
}

interface InvoicePDFProps {
  invoice: Invoice;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20, // Reduced from 40
    fontFamily: 'Helvetica',
    fontSize: 9, // Base font size
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Reduced
  },
  logo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 16, // Reduced from 24
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3, // Reduced
  },
  companyDetails: {
    fontSize: 8, // Reduced from 10
    color: '#6B7280',
    lineHeight: 1.2, // Tighter lines
  },
  invoiceTitle: {
    fontSize: 20, // Reduced from 32
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'right',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Reduced
  },
  invoiceInfo: {
    width: '45%',
  },
  billingInfo: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 11, // Reduced from 14
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6, // Reduced
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3, // Reduced
  },
  detailLabel: {
    fontSize: 8, // Reduced
    color: '#6B7280',
    width: '50%',
  },
  detailValue: {
    fontSize: 8, // Reduced
    color: '#1F2937',
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'right',
  },
  clientName: {
    fontSize: 12, // Reduced from 16
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3, // Reduced
  },
  clientDetails: {
    fontSize: 8, // Reduced
    color: '#6B7280',
    lineHeight: 1.2, // Reduced
  },
  servicesTable: {
    marginBottom: 15, // Reduced
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 6, // Reduced
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6, // Reduced
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 9, // Reduced from 11
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableCellText: {
    fontSize: 8, // Reduced from 10
    color: '#1F2937',
  },
  summary: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10, // Reduced
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5, // Reduced
  },
  summaryLabel: {
    fontSize: 9, // Reduced
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 9, // Reduced
    color: '#1F2937',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    backgroundColor: '#F3F4F6',
    padding: 6, // Reduced
    borderRadius: 4,
    marginTop: 8, // Reduced
  },
  totalLabel: {
    fontSize: 11, // Reduced from 14
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 12, // Reduced from 16
    fontWeight: 'bold',
    color: '#DC2626',
  },
  footer: {
    marginTop: 20, // Reduced
    paddingTop: 10, // Reduced
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 8, // Reduced
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 1.2, // Reduced
  },
});

const getStatusColor = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return { backgroundColor: '#D1FAE5', color: '#065F46' };
    case 'draft':
      return { backgroundColor: '#F3F4F6', color: '#374151' };
    case 'finalized':
      return { backgroundColor: '#E0E7FF', color: '#3730A3' };
    case 'unpaid':
      return { backgroundColor: '#FEE2E2', color: '#991B1B' };
    case 'partially_paid':
      return { backgroundColor: '#FEF3C7', color: '#92400E' };
    default:
      return { backgroundColor: '#EBF8FF', color: '#1E40AF' };
  }
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const statusColors = getStatusColor(invoice.status);

  // Sample services data - in real app, this would come from props or API
  const services = [
    {
      date: '05/05/2023',
      hours: 4,
      type: 'Care',
      rate: 36.6,
      value: 146.4,
    },
    {
      date: '12/05/2023',
      hours: 4,
      type: 'Care',
      rate: 18.3,
      value: 73.2,
    },
    {
      date: '19/05/2023',
      hours: 4,
      type: 'Care',
      rate: 18.3,
      value: 73.2,
    },
    {
      date: '26/05/2023',
      hours: 4,
      type: 'Care',
      rate: 36.6,
      value: 146.4,
    },
  ];

  const subtotal = services.reduce((total, service) => total + service.value, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

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
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>Invoice Address:</Text>
            <Text style={styles.clientName}>Independent Living Agency</Text>
            <Text style={styles.clientDetails}>
              15 Dagenham Business Centre{'\n'}
              123 Rainham rd{'\n'}
              Rainham{'\n'}
              RM10 7FD
            </Text>
          </View>
          <View style={styles.billingInfo}>
            <Text style={styles.sectionTitle}>Service User Address:</Text>
            <Text style={styles.clientName}>Saleha Begum</Text>
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
            <Text style={[styles.tableCellText, { width: '20%' }]}>4</Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>16</Text>
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

        {/* Details */}
        <View style={styles.servicesTable}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Details
          </Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>Hours</Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>Type</Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>Rate</Text>
            <Text style={[styles.tableHeaderText, { width: '20%' }]}>Value</Text>
          </View>
          {services.map((service, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellText, { width: '20%' }]}>
                {service.date}
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
          ))}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { width: '20%' }]}>Total</Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}></Text>
            <Text style={[styles.tableCellText, { width: '20%' }]}>
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
              Customer name: Saleha Begum{'\n'}
              Service user name: Saleha Begum{'\n'}
              Invoice date: 09/08/2023{'\n'}
              Invoice no: SB9025-17{'\n'}
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

export const downloadInvoicePDF = async (invoice: Invoice) => {
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${invoice.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default InvoicePDF;