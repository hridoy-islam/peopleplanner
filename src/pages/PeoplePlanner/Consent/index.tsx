import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for existing consents (empty for now)
const existingConsents = [];

export default function ConsentPage() {
  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold ">
              Daljit Singh's Consent Forms
            </h1>
          </div>

          {/* Add Consent Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-supperagent text-white hover:bg-supperagent/90">
                Add Consent
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white text-black"
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer text-black hover:bg-gray-100"
              >
                <Link
                  to="add-consent-form"
                  className="flex w-full items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add consent form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer text-black hover:bg-gray-100"
              >
                <Link
                  to="add-capacity-form"
                  className="flex w-full items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add capacity form
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Area */}
        {existingConsents.length === 0 ? (
          // Empty State
          <Card className="py-16">
            <CardContent className="space-y-4 text-center">
              {/* Empty state illustration */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <div className="relative">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-200">
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Nothing to see here!</h3>
                <p className="text-muted-foreground">
                  You haven't added any Consent Forms yet for Daljit Singh.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // List of existing consents (when they exist)
          <div className="space-y-4">
            {existingConsents.map((consent) => (
              <Card
                key={consent.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{consent.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {consent.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Created: {consent.createdDate}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {consent.status}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
