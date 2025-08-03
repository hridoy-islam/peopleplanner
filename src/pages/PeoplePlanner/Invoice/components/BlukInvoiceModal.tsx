import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import moment from 'moment';

interface BulkInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkInvoiceModal = ({ isOpen, onClose }: BulkInvoiceModalProps) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null
  ]);
  const [startDate, endDate] = dateRange;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !endDate) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      console.log(
        'Generating invoices from:',
        moment(startDate).format('MMMM D, YYYY'),
        'to',
        moment(endDate).format('MMMM D, YYYY')
      );
      setIsGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Bulk Invoices</DialogTitle>
          <DialogDescription>
            Select a date range to generate Invoices for all active service
            users.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full space-y-2">
          <label
            htmlFor="month-year"
            className="block text-sm font-medium text-gray-700"
          >
            Select Date Range
          </label>
          <div className="relative w-full">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null]) => {
                setDateRange(update);
              }}
              isClearable
              dateFormat="MMMM d, yyyy"
              placeholderText="Select date range"
              wrapperClassName="w-full"
              preventOpenOnFocus
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!startDate || !endDate || isGenerating}
            className="bg-supperagent text-white hover:bg-supperagent/90"
          >
            {isGenerating ? 'Generating...' : 'Generate Invoices'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkInvoiceModal;
