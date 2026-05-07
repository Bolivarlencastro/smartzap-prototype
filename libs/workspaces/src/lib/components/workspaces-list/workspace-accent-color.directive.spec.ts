import { WorkspaceAccentColorDirective } from './workspace-accent-color.directive';

describe('WorkspaceAccentColorDirective', () => {
  let directive: WorkspaceAccentColorDirective;

  beforeEach(() => {
    directive = new WorkspaceAccentColorDirective();
  });

  it('should keep fallback accent color by default', () => {
    expect(directive.borderBottomStyle).toBe('solid');
    expect(directive.borderBottomWidth).toBe('2px');
    expect(directive.borderBottomColor).toBe('#94a3b8');
  });

  it('should apply snake_case custom color when valid', () => {
    directive.workspace = { id: 'x', name: 'workspace', custom_color: '#ABCDEF' } as any;
    expect(directive.borderBottomColor).toBe('#ABCDEF');
  });

  it('should apply camelCase custom color when valid', () => {
    directive.workspace = { id: 'x', name: 'workspace', customColor: '#123456' } as any;
    expect(directive.borderBottomColor).toBe('#123456');
  });

  it('should keep provided color as-is', () => {
    directive.workspace = { id: 'x', name: 'workspace', custom_color: '#abc' } as any;
    expect(directive.borderBottomColor).toBe('#abc');
  });

  it('should fallback when color is missing', () => {
    directive.workspace = { id: 'x', name: 'workspace' } as any;
    expect(directive.borderBottomColor).toBe('#94a3b8');
  });

  it('should trim valid custom color value', () => {
    directive.workspace = { id: 'x', name: 'workspace', custom_color: '  #AABBCC  ' } as any;
    expect(directive.borderBottomColor).toBe('#AABBCC');
  });

  it('should fallback when color is blank', () => {
    directive.workspace = { id: 'x', name: 'workspace', custom_color: '   ' } as any;
    expect(directive.borderBottomColor).toBe('#94a3b8');
  });
});
