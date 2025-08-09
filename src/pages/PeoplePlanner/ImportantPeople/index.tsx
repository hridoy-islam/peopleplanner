import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen, Plus } from 'lucide-react';

// Dialog components (assuming you're using ShadCN or similar)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export default function ImportantPeoplePage() {
  const [importantPeople, setImportantPeople] = useState<any[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false); // Control dialog visibility
  const navigate = useNavigate();

  // Mock data
  useEffect(() => {
    const mockData = [
      {
        id: '1',
        name: 'John Doe',
        contract: 'Personal',
        contractStatus: 'Active',
        relationToCare: 'Family Member',
      },
      {
        id: '2',
        name: 'Jane Smith',
        contract: 'Professional',
        contractStatus: 'Inactive',
        relationToCare: 'Doctor',
      },
    ];
    setImportantPeople(mockData);
  }, []);

  // Handle selection
  const handleSelectType = (type: 'personal' | 'professional') => {
    setOpenAddDialog(false);
    if (type === 'personal') {
      navigate('/admin/people-planner/important-people/personal-form');
    } else {
      navigate('/admin/people-planner/important-people/professional-form');
    }
  };

  return (
    <div className="space-y-4">
        <div className='flex items-center justify-between'>

      <h1 className="text-2xl font-semibold">Important People</h1>

      {/* Add Contact Button with Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogTrigger asChild>
          <Button className='bg-supperagent text-white hover:bg-supperagent/90' size={'sm'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Contact Type</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Button
              className="w-full py-6 text-lg"
              onClick={() => handleSelectType('personal')}
              >
              Personal
            </Button>
            <Button
              className="w-full py-6 text-lg"
              onClick={() => handleSelectType('professional')}
              >
              Professional
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-2">
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
                </div>

      {/* Table */}
      <div className="rounded-md bg-white p-2 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Contract Status</TableHead>
              <TableHead>Relation to Care</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {importantPeople.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {person.contract}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      person.contractStatus === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {person.contractStatus}
                  </span>
                </TableCell>
                <TableCell>{person.relationToCare}</TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    className="h-8 w-8 p-0 bg-supperagent text-white hover:bg-supperagent/90"
                    onClick={() => navigate(`/edit-contact/${person.id}`)}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}