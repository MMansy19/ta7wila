
import UserInfoClient from './UserInfoClient';

export default function Page({ params }: { params: { id: string } }) {
  return <UserInfoClient id={params.id} />;
}


