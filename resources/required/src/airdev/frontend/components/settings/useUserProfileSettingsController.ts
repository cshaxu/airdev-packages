/* "@airdev/next": "managed" */

'use client';

import { ROOT_HREF } from '@/airdev/common/constant';
import { currentUserQueryKey } from '@/airdev/frontend/hooks/data/user-base';
import { useRequiredCurrentUser } from '@/airdev/frontend/hooks/data/user-client';
import {
  useDeleteOneUser,
  useUpdateOneUser,
} from '@/generated/tanstack-hooks/user-client';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useUserProfileSettingsController() {
  const { data: currentUser } = useRequiredCurrentUser();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(currentUser.name ?? '');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteOneUser();
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateOneUser();

  useEffect(() => {
    if (!isEditingName) {
      setDraftName(currentUser.name ?? '');
    }
  }, [currentUser.name, isEditingName]);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [isEditingName]);

  function handleDeleteAccount() {
    deleteUser(
      { id: currentUser.id },
      {
        onSuccess: async () => {
          toast.success('Account deleted');
          await signOut({ callbackUrl: ROOT_HREF });
        },
      }
    );
  }

  function handleStartEditingName() {
    setDraftName(currentUser.name ?? '');
    setIsEditingName(true);
  }

  function handleCancelEditingName() {
    setDraftName(currentUser.name ?? '');
    setIsEditingName(false);
  }

  function handleSaveName() {
    const nextName = draftName.trim();

    if (nextName.length === 0) {
      toast.error('Name cannot be empty');
      return;
    }

    if (nextName === (currentUser.name ?? '')) {
      setIsEditingName(false);
      return;
    }

    updateUser(
      {
        params: { id: currentUser.id },
        body: { name: nextName },
      },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(currentUserQueryKey, updatedUser);
          setDraftName(updatedUser.name ?? nextName);
          setIsEditingName(false);
          toast.success('Name updated');
        },
      }
    );
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isUpdatingUser) {
        handleSaveName();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditingName();
    }
  }

  const displayName = currentUser.name.trim() || currentUser.email || 'User';
  const nameInitials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() ?? '')
      .join('') || 'U';

  return {
    currentUser,
    deleteOpen,
    isEditingName,
    draftName,
    nameInputRef,
    isDeleting,
    isUpdatingUser,
    displayName,
    nameInitials,
    setDeleteOpen,
    setDraftName,
    handleDeleteAccount,
    handleStartEditingName,
    handleCancelEditingName,
    handleNameKeyDown,
  };
}

export type UserProfileSettingsViewModel = ReturnType<
  typeof useUserProfileSettingsController
>;
