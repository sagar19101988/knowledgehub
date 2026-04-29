import { redirect } from 'next/navigation';

export default function SettingsConnectionsPage() {
  // For now, redirect to the Connect setup wizard as it serves as the connection setup interface
  // In the future, this can be an embedded version of the setup wizard
  redirect('/connect');
}
