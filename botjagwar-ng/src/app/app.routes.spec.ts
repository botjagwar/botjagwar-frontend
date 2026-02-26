import { legacyToModernRouteMap, routes } from './app.routes';

describe('app routes compatibility', () => {
  it('defines redirect routes for every legacy static HTML path', () => {
    for (const [legacyPath, modernPath] of Object.entries(legacyToModernRouteMap)) {
      const route = routes.find((item) => item.path === legacyPath);

      expect(route).toBeDefined();
      expect(route?.redirectTo).toBe(modernPath);
      expect(route?.pathMatch).toBe('full');
    }
  });

  it('keeps a wildcard fallback route to main page', () => {
    const fallbackRoute = routes[routes.length - 1];

    expect(fallbackRoute.path).toBe('**');
    expect(fallbackRoute.redirectTo).toBe('');
  });
});
