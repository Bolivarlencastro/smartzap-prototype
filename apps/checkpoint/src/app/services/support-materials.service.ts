import { computed, Injectable, signal } from '@angular/core';
import { CoursesApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SupportMaterialsService {
  private readonly currentEventId = signal<string | undefined>(undefined);
  private readonly supportMaterialsResource = this.createSupportMaterialsResource();
  readonly isLoading = computed(() => this.supportMaterialsResource.isLoading);
  readonly supportMaterials = computed(() => {
    if (this.supportMaterialsResource.hasValue()) {
      return this.supportMaterialsResource.value();
    }

    return [];
  });

  constructor(private readonly coursesApi: CoursesApi) {}

  loadSupportMaterials(eventId: string) {
    if (!eventId) {
      return;
    }
    this.currentEventId.set(eventId);
  }

  private createSupportMaterialsResource() {
    return rxResource({
      params: () => ({ eventId: this.currentEventId() }),
      stream: ({ params }) => {
        return this.coursesApi.fetchSupportMaterials(params.eventId);
      },
    });
  }
}
