import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

// Types
interface Scenario {
  triggerFactor: string;
  whatShouldHappen: string;
  whoShouldBeContacted: string;
  role: string;
  anticipatoryMedicationsEquipment: string;
}

interface ContingencyPlanForm {
  planName: string;
  scenarios: Scenario[];
  agreedWithPerson: "Service User" | "Legitimate Representative";
  nextReview: "1 months" | "3 months" | "6 months" | "12 months";
}

// Mock Data
const mockPlans: ContingencyPlanForm[] = [
  {
    planName: "Emergency Seizure Response Plan",
    scenarios: [
      {
        triggerFactor: "Seizure activity",
        whatShouldHappen: "Ensure airway, time seizure, lay on side",
        whoShouldBeContacted: "Dr. Smith",
        role: "Nurse",
        anticipatoryMedicationsEquipment: "Diazepam PR, oxygen kit",
      },
      {
        triggerFactor: "Prolonged seizure (>5 mins)",
        whatShouldHappen: "Administer rescue meds, call ambulance",
        whoShouldBeContacted: "Emergency Services",
        role: "Caregiver",
        anticipatoryMedicationsEquipment: "Buccal Midazolam",
      },
    ],
    agreedWithPerson: "Service User",
    nextReview: "6 months",
  },
  {
    planName: "Allergic Reaction Protocol",
    scenarios: [
      {
        triggerFactor: "Signs of anaphylaxis",
        whatShouldHappen: "Use EpiPen, call 999",
        whoShouldBeContacted: "GP and next of kin",
        role: "Support Worker",
        anticipatoryMedicationsEquipment: "EpiPen, antihistamines",
      },
    ],
    agreedWithPerson: "Legitimate Representative",
    nextReview: "12 months",
  },
];

export default function ContingencyPlan() {
  const [plans, setPlans] = useState<ContingencyPlanForm[]>(mockPlans); // Use mock data
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContingencyPlanForm>({
    defaultValues: {
      planName: "",
      scenarios: [], // ✅ Start with empty scenarios
      agreedWithPerson: "Service User",
      nextReview: "3 months",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "scenarios",
  });

  const onSubmit = (data: ContingencyPlanForm) => {
    setPlans((prev) => [...prev, data]);
    reset(); // Reset form including clearing scenarios
    setOpen(false);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contingency Plan</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-supperagent text-white hover:bg-supperagent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Contingency Plan</DialogTitle>
              <DialogDescription>
                Fill in the details for a new contingency plan.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Plan Name */}
              <div className="mb-6">
                <Label htmlFor="planName">Plan Name</Label>
                <Input
                  id="planName"
                  {...register("planName", { required: "Plan name is required" })}
                />
                {errors.planName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.planName.message}
                  </p>
                )}
              </div>

              {/* Scenarios */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Scenarios</h3>

                {/* Add Scenario Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      triggerFactor: "",
                      whatShouldHappen: "",
                      whoShouldBeContacted: "",
                      role: "",
                      anticipatoryMedicationsEquipment: "",
                    })
                  }
                  className="mb-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Scenario
                </Button>

                {/* Render Scenarios */}
                {fields.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">No scenarios added yet.</p>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <h4 className="font-medium mb-3">Scenario {index + 1}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label>Trigger Factor</Label>
                          <Input
                            {...register(`scenarios.${index}.triggerFactor`, {
                              required: "This field is required",
                            })}
                          />
                          {errors.scenarios?.[index]?.triggerFactor && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.scenarios[index]?.triggerFactor?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>What Should Happen</Label>
                          <Input
                            {...register(`scenarios.${index}.whatShouldHappen`, {
                              required: "This field is required",
                            })}
                          />
                          {errors.scenarios?.[index]?.whatShouldHappen && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.scenarios[index]?.whatShouldHappen?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Who Should Be Contacted</Label>
                          <Input
                            {...register(`scenarios.${index}.whoShouldBeContacted`, {
                              required: "This field is required",
                            })}
                          />
                          {errors.scenarios?.[index]?.whoShouldBeContacted && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.scenarios[index]?.whoShouldBeContacted?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            {...register(`scenarios.${index}.role`, {
                              required: "This field is required",
                            })}
                          />
                          {errors.scenarios?.[index]?.role && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.scenarios[index]?.role?.message}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <Label>Anticipatory Medications / Equipment</Label>
                          <Input
                            {...register(
                              `scenarios.${index}.anticipatoryMedicationsEquipment`,
                              { required: "This field is required" }
                            )}
                          />
                          {errors.scenarios?.[index]?.anticipatoryMedicationsEquipment && (
                            <p className="text-sm text-red-500 mt-1">
                              {
                                errors.scenarios[index]
                                  ?.anticipatoryMedicationsEquipment?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete Scenario
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Other Details */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Other Details</h3>

                <div className="mb-4">
                  <Label>Agreed with person</Label>
                  <Controller
                    name="agreedWithPerson"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Service User" id="su" />
                          <Label htmlFor="su">Service User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Legitimate Representative"
                            id="lr"
                          />
                          <Label htmlFor="lr">Legitimate Representative</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <div>
                  <Label>Next review</Label>
                  <Controller
                    name="nextReview"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-2 mt-2"
                      >
                        {["1 months", "3 months", "6 months", "12 months"].map(
                          (period) => (
                            <div
                              key={period}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={period} id={period} />
                              <Label htmlFor={period}>{period}</Label>
                            </div>
                          )
                        )}
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Save Plan</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table of Plans */}
      {plans.length === 0 ? (
        <p className="text-gray-500">No contingency plans created yet.</p>
      ) : (
        <div className="bg-white p-2 rounded-md shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Agreed With</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Scenarios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan, i) => (
                <TableRow key={i} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{plan.planName}</TableCell>
                  <TableCell>{plan.agreedWithPerson}</TableCell>
                  <TableCell>{plan.nextReview}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {plan.scenarios.map((s, idx) => (
                        <li key={idx}>
                          <strong>{s.triggerFactor}</strong>: {s.whatShouldHappen}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}