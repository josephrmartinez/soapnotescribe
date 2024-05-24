import { Database } from "../database.types";

// HOW TO UPDATE NOTE TO CORRECT TYPE (INCLUDES JOIN WITH PATIENT_ID)
export type Note = Database['public']['Tables']['note']['Row'];

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};


export interface Transcript {
  language: string;
  segments: Segment[];
  num_speakers: number;
}

export interface Segment {
  end: string;
  text: string;
  start: string;
  speaker: string;
}





export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type AppointmentTable = {
  id: string;
  title: string;
  description: string;
  provider: string;
  clinic: string;
  appointment_date: string;
  amount: number;
  audio_path: string | null;
  patient_id: string | null;
  speakers: number | null;
  transcript?: string | null;
  summary?: string | null;
  feedback?: string | null;
};

export type AppointmentForm = {
  id: string;
  title: string;
  description: string;
  provider: string;
  clinic: string;
  appointment_date: string;
  amount: number;
  audio_path: string | null;
  patient_id: string | null;
  speakers: number | null;
  transcript?: string | null;
  summary?: string | null;
  feedback?: string | null;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};


export type ProviderField = {
  id: string;
  name: string;
};


export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
