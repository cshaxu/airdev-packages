/* "@airdev/next": "managed" */

import { UserEmailPayload } from '@/airdev/common/types/data/user';
import { airdevPrivateConfig } from '@/airdev/config/private';
import { airdevPublicConfig } from '@/airdev/config/public';
import { UserEntityBase } from '@/generated/entities/user';

export class AirdevUserEntity extends UserEntityBase {
  /** computed sync fields */

  public getThisUserId = () => this.context.currentUser?.id ?? null;

  public getIsAdmin = () =>
    airdevPrivateConfig.admin.emails.includes(this.email) || this.isAdminRaw;

  public getVerifiedEmail = () =>
    this.emailVerified === null ? null : this.email;

  /** computed async fields */

  public async getEmailPayload(): Promise<UserEmailPayload> {
    return {
      name: (this.name ?? this.email.split('@')[0]).split(' ')[0],
      imageUrl: this.imageUrl ?? airdevPublicConfig.app.logoUrl,
    };
  }
}
