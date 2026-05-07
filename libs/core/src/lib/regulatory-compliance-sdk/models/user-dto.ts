export interface UserDto {
  id: string;
  name: string;
  relatedUserLeader?: UserDto;
  relatedUserLeaderId?: string;
}
