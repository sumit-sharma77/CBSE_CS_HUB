export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'STUDENT' | 'ADMIN';
  emailVerified: boolean;
}
