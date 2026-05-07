import { GlobalSearchItem } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';
import { DataType } from './global-params.model';

export interface GlobalSearchResponse extends GlobalSearchItem {
  [key: string]: any;
  stats: {
    dataType: DataType;
    [key: string]: any;
  };
}
