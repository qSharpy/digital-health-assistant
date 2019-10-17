export interface Account {
  id: string; // uid
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdDate: Date;
}
