export default (plugin: any) => {
  console.log('[comments extension] injecting middlewares into routes');

  plugin.routes['content-api'].routes = plugin.routes['content-api'].routes.map(
    (route: any) => {
      console.log(`[comments extension] patching route: ${route.method} ${route.path}`);
      return {
        ...route,
        config: {
          ...route.config,
          middlewares: [
            ...(route.config?.middlewares ?? []),
            'global::block-comment-words',
          ],
        },
      };
    }
  );

  return plugin;
};
