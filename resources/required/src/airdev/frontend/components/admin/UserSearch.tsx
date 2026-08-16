/* "@airdev/next": "managed" */

'use client';

import { CurrentUser } from '@/airdev/common/types/context';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/airdev/frontend/components/ui/Avatar';
import { Button } from '@/airdev/frontend/components/ui/Button';
import { Input } from '@/airdev/frontend/components/ui/Input';
import { Skeleton } from '@/airdev/frontend/components/ui/Skeleton';
import AirdevBackendApiClient from '@/airdev/frontend/sdks/backend';
import {
  useBecameUser,
  useSetBecameUser,
} from '@/airdev/frontend/stores/becameUserStore';
import {
  useMutationSearchUsers,
  useUpdateOneUser,
} from '@/generated/tanstack-hooks/user-client';
import { Drama, Smile, User, UserKey } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UserSearch() {
  const [inputQ, setInputQ] = useState('');
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [adminTargetUserId, setAdminTargetUserId] = useState<string | null>(
    null
  );
  const became = useBecameUser();
  const setBecameUser = useSetBecameUser();
  const { mutateAsync: searchUsers, isPending: isSearching } =
    useMutationSearchUsers();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateOneUser();

  async function handleSearch(q: string = inputQ.trim()) {
    const nextUsers = (await searchUsers({ q })) as CurrentUser[];
    setUsers(nextUsers);
  }

  useEffect(() => {
    void handleSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  }

  async function handleBecome(user: CurrentUser) {
    await AirdevBackendApiClient.become(user.id);
    setBecameUser(user);
    window.location.reload();
  }

  async function handleRevertSelf() {
    await AirdevBackendApiClient.become(null);
    setBecameUser(null);
    window.location.reload();
  }

  async function handleToggleAdmin(user: CurrentUser) {
    setAdminTargetUserId(user.id);
    try {
      await updateUser({
        params: { id: user.id },
        body: { setAdmin: !user.isAdmin },
      });
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, isAdmin: !currentUser.isAdmin }
            : currentUser
        )
      );
    } finally {
      setAdminTargetUserId(null);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      {became && (
        <div className="flex min-w-0 items-center gap-3 rounded-lg border p-4">
          <Avatar className="size-10">
            {became.imageUrl ? (
              <AvatarImage src={became.imageUrl} alt={became.name} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {became.name.charAt(0)?.toUpperCase() ?? '?'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              Impersonating: {became.name ?? became.id}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleRevertSelf}>
            Revert Self
          </Button>
        </div>
      )}

      <div className="flex w-full min-w-0 gap-2">
        <Input
          placeholder="Filter by name or email..."
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          onClick={() => void handleSearch()}
          disabled={isSearching}
          className="min-w-20 sm:min-w-24"
        >
          Search
        </Button>
      </div>

      {isSearching && users.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex w-fit min-w-full flex-nowrap items-center gap-3 rounded-lg border p-3"
            >
              <Skeleton className="size-9 rounded-full" />
              <div className="min-w-[50px] flex-1 basis-0 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {users.length > 0 && (
        <div className="space-y-2">
          {users.map((user: CurrentUser) => (
            <div
              key={user.id}
              className="flex w-fit min-w-full flex-nowrap items-center gap-3 rounded-lg border p-3"
            >
              <Avatar className="size-9">
                {user.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                ) : (
                  <AvatarFallback className="text-xs font-bold">
                    {user.name.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-[50px] flex-1">
                <p className="text-sm font-medium break-words">
                  {user.name ?? '-'}
                </p>
                <p className="text-muted-foreground text-xs break-words">
                  {user.email} - {user.createdAt.toLocaleString()}
                </p>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant={became?.id === user.id ? 'default' : 'outline'}
                  onClick={() => handleBecome(user)}
                  disabled={became?.id === user.id}
                  title={became?.id === user.id ? 'Active' : 'Become'}
                >
                  {became?.id === user.id ? (
                    <Drama className="size-4" />
                  ) : (
                    <Smile className="size-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void handleToggleAdmin(user)}
                  isLoading={isUpdatingUser && adminTargetUserId === user.id}
                  disabled={isUpdatingUser && adminTargetUserId === user.id}
                  title={user.isAdmin ? 'Remove Admin' : 'Set Admin'}
                >
                  {user.isAdmin ? (
                    <UserKey className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
