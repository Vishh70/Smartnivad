module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000",
        "http://localhost:3000/deals",
        "http://localhost:3000/compare",
      ],
      startServerCommand: "npm run start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "server-response-time": ["error", { maxNumericValue: 800 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./reports/lighthouse",
    },
  },
};
