module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/deals",
        "http://localhost:3000/blog"
      ],
      startServerCommand: "npx cross-env NEXT_PUBLIC_CI=true npm run build && npx cross-env NEXT_PUBLIC_CI=true npm run start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "categories:best-practices": ["warn", { minScore: 1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "server-response-time": ["warn", { maxNumericValue: 800 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
