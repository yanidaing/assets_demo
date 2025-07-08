import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/assets');
  }, [router]);
  return null;
}