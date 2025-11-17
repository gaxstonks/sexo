import ProtectedClient from '@/components/ProtectedClient';
export default function Page() {
  return (
    <ProtectedClient>
      <main className='p-6'>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao dashboard protegido.</p>
      </main>
    </ProtectedClient>
  );
}
