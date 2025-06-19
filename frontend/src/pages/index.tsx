import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Assets App</h1>
      <Link href="/assets">Go to Assets List</Link>
    </div>
  );
}
