import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ProfileBaseComponent } from './profile-base.component';
import { AvatarUploadComponent } from '../components/avatar-upload/avatar-upload.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-avatar',
  template: `
    <app-avatar-upload [imageSrc]="(service.userProfile$ | async)?.avatar" (uploadImage)="uploadImage($event)">
    </app-avatar-upload>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AvatarUploadComponent, AsyncPipe],
})
export class ProfileAvatarComponent extends ProfileBaseComponent {
  uploadImage(file: File): void {
    this.service.uploadAvatar(file);
  }
}
