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
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !endDate) return;

    setIsGenerating(true);
    setTimeout(() => {
      console.log(
        'Generating payslips from:',
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
          <DialogTitle>Generate Bulk Payslips</DialogTitle>
          <DialogDescription>
            Select a date range to generate payslips for all active service users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 w-full">
          <label
            htmlFor="date-range"
            className="block text-sm font-medium text-gray-700"
          >
            Select Date Range
          </label>
          <DatePicker
            id="date-range"
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
            isClearable
            placeholderText="Start date - End date"
            dateFormat="MMMM d, yyyy"
            wrapperClassName="w-full"
              preventOpenOnFocus

            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
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
            {isGenerating ? 'Generating...' : 'Generate Payslips'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkInvoiceModal;
