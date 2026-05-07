# Testing

## General

- Do NOT cast components as `any` (e.g. `component as any`) in tests — use `fixture.componentInstance` with proper typing or expose what needs testing with appropriate visibility

## TestBed Setup

- For component tests use `await TestBed.configureTestingModule({...}).compileComponents()`
- For service tests `compileComponents()` is not needed — `TestBed.configureTestingModule` without `await` suffices
- Always call `fixture.detectChanges()` after `TestBed.createComponent()` to trigger initial change detection
- For OnPush components, call `fixture.detectChanges()` again after mutating component state to flush the view

## Schemas

- Use `CUSTOM_ELEMENTS_SCHEMA` when the template contains Material or third-party components that are not the subject of the test, to avoid "unknown element" errors

## Transloco

- Use `getTranslocoTestingModule()` from the library's own `transloco-testing.module.ts` (located at `src/lib/transloco-testing.module.ts` inside each lib)
- Import it alongside the component under test — never mock `TranslocoPipe` manually

## Mocking dependencies

- Type mocks as `jest.Mocked<T>` and cast via `as unknown as jest.Mocked<T>` to get full type safety on `jest.fn()` calls
- Build mock objects inline in `beforeEach` so each test starts with a fresh mock state
- To mock any injected class or token, provide it via `{ provide: Token, useValue: mock }` in the `providers` array
- To assert on a mock after a test, retrieve it with `TestBed.inject(Token) as jest.Mocked<T>` or use the mock directly
- For services whose methods return observables (e.g. API calls, dialog opens), mock the method with `jest.fn().mockReturnValue(of(result))`

## Observables in tests

- Use the `done` callback for asserting values emitted by observables: subscribe, assert inside the callback, call `done()`
- Alternatively use `firstValueFrom` with `async/await` for single-emission observables
