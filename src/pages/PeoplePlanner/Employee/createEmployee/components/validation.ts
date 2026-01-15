import { z } from 'zod';

export const serviceUserSchema = z.object({
  // --- Personal Information Step ---
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleInitial: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  maritalStatus: z.string().optional(),
  ethnicOrigin: z.string().optional(),

  // --- Address Step ---
  address: z.string().min(1, 'Address is required'),
  cityOrTown: z.string().min(1, 'City/Town is required'),
  stateOrProvince: z.string().optional(),
  postCode: z.string().min(1, 'Post code is required'),
  country: z.string().min(1, 'Country is required'),

  // --- Employment Service Step ---
  employmentType: z.string().optional(),
  position: z.string().optional(),
  source: z.string().optional(),
  branch: z.string().optional(),
  applicationDate: z.string().optional(),
  availableFromDate: z.string().optional(),
  startDate: z.string().optional(), 
  contractHours: z.coerce.number().optional(),
  carTravelAllowance: z.boolean().optional(),
  area: z.string().optional(),
});

export type ServiceUserFormData = z.infer<typeof serviceUserSchema>;