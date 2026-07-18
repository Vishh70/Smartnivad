module.exports = {
  ci: {
    collect: {
      url: [
        "https://smartnivad1.vercel.app/",
        "https://smartnivad1.vercel.app/deals",
        "https://smartnivad1.vercel.app/blog"
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.90 }],
        "categories:accessibility": ["warn", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.90 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
