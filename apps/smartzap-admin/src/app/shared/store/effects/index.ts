import { RouterEffects } from './router.effect';
import { UIEffects } from './ui.effects';
import { ReportEffects } from './report.effects';
import { BillingEffects } from './billing.effects';
import { GlobalSettingsEffects } from './global-settings.effects';

export const effects: any[] = [RouterEffects, UIEffects, ReportEffects, BillingEffects, GlobalSettingsEffects];
