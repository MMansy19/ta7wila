import { use } from "react";
import { Params } from "../types";
import UserInfoClient from "./UserInfoClient";
export const dynamic = 'force-dynamic';

export default function UserInfo({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  return <UserInfoClient id={resolvedParams.id} />;
}


