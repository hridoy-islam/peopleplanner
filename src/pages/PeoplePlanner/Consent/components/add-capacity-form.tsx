import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Edit, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock capacity form templates
const capacityFormTemplates = [
  { id: 'care', name: 'Lack of capacity Statement (Care)', selected: false },
  {
    id: 'finance',
    name: 'Lack of capacity Statement (Finance)',
    selected: false
  },
  {
    id: 'medication',
    name: 'Lack of capacity Statement (Medication)',
    selected: false
  }
];

export default function AddCapacityFormPage() {
  const [selectedForm, setSelectedForm] = useState('');
  const [signatureOption, setSignatureOption] = useState('now');
  const [reviewPeriod, setReviewPeriod] = useState('3months');
  const [customDate, setCustomDate] = useState('');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="flex flex-col ">
        {/* Left Sidebar */}
        <div>
          <Button
            className="bg-supperagent text-white hover:bg-supperagent/90"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex flex-row items-start gap-4">
          <div className="w-80  bg-gray-50 ">
            <div>
              <h2 className="mb-2 font-semibold text-foreground">
                Select Consent Forms
              </h2>

              <div className="space-y-2">
                {capacityFormTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedForm(template.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedForm === template.id
                        ? 'border-supperagent bg-blue-50'
                        : 'border-border bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{template.name}</span>
                      {selectedForm === template.id && (
                        <div className="h-2 w-2 rounded-full bg-supperagent"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm text-muted-foreground">
                  Can't see what you need?
                </p>
                <Button className="w-full bg-supperagent text-white hover:bg-supperagent">
                  CUSTOM ENTRY
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Daljit Consents to</h1>
              </div>

              {/* Form Content */}
              <Card>
                <CardContent className="p-6">
                  {selectedForm ? (
                    <div className="space-y-6">
                      <div className="py-8 text-center text-muted-foreground">
                        Your selections will populate here
                      </div>

                      {/* Signature Section */}
                      <div className="border-t pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Signature</h3>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-medium">
                              Would you like to add a Signature Now or Later?
                            </Label>
                            <p className="mb-3 text-sm text-muted-foreground">
                              This Signature will be attached to this specific
                              form.
                            </p>

                            <RadioGroup
                              value={signatureOption}
                              onValueChange={setSignatureOption}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="now" id="now" />
                                <Label htmlFor="now">Now</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="later" id="later" />
                                <Label htmlFor="later">Later</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Next Review Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <Label className="font-medium">Next review</Label>
                            </div>

                            <div className="flex items-center gap-4">
                              <Input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="w-40"
                                placeholder="DD-MM-YYYY"
                              />

                              <RadioGroup
                                value={reviewPeriod}
                                onValueChange={setReviewPeriod}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="3months"
                                    id="3months"
                                  />
                                  <Label htmlFor="3months">3 months</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="6months"
                                    id="6months"
                                  />
                                  <Label htmlFor="6months">6 months</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="1year" id="1year" />
                                  <Label htmlFor="1year">1 year</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end border-t pt-6">
                        <Button className="bg-supperagent text-white hover:bg-supperagent">
                          Finish form
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <p>
                        Select a capacity form from the left sidebar to begin
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
