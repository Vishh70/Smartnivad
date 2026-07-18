# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\accessibility.spec.ts >> Accessibility WCAG 2.2 AA Sweep >> Deals page passes accessibility checks
- Location: tests\e2e\accessibility.spec.ts:22:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 449

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(1) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(1) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(2) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(2) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(3) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(3) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(4) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(4) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(5) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(5) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f9fafb",
+               "contrastRatio": 2.48,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#99a1af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+                 "target": Array [
+                   ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(6) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.48 (foreground color: #99a1af, background color: #f9fafb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"flex items-center justify-center w-full h-11 sm:h-12 rounded-[10px] sm:rounded-[14px] bg-gray-50 text-[13px] sm:text-[14px] font-semibold text-gray-400\">Unavailable</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".spotlight-card.rounded-\\[20px\\].shadow-\\[0_12px_40px_rgba\\(15\\,23\\,42\\,0\\.08\\)\\]:nth-child(6) > .sm\\:rounded-3xl.bg-white\\/80.sm\\:shadow-\\[0_4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\] > .p-4.sm\\:p-6.z-10 > .mt-auto > .sm\\:h-12.rounded-\\[10px\\].sm\\:rounded-\\[14px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#e8f6fe",
+               "contrastRatio": 2.56,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#1da1f2",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.56 (foreground color: #1da1f2, background color: #e8f6fe, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<a href=\"https://t.me/SmartNi...\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"w-[48%] max-w-[160px...\">",
+                 "target": Array [
+                   ".bg-\\[\\#1DA1F2\\]\\/10",
+                 ],
+               },
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.56 (foreground color: #1da1f2, background color: #e8f6fe, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<a href=\"https://t.me/SmartNi...\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"w-[48%] max-w-[160px...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".bg-\\[\\#1DA1F2\\]\\/10",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.53,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ca3af",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]\">Deals</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".sm\\:items-start.sm\\:text-left.text-center:nth-child(1) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.53,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ca3af",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]\">Content</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".sm\\:items-start.sm\\:text-left.text-center:nth-child(2) > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.53,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ca3af",
+               "fontSize": "9.0pt (12px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h4 class=\"text-[12px] font-[700] text-[#9CA3AF] mb-[12px] uppercase tracking-[2px]\">Legal</h4>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".col-span-2 > h4",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.53,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ca3af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"text-[13px] text-[#9CA3AF] max-w-[300px] leading-tight mx-auto\">As an Amazon Associate and affiliate partner, we earn from qualifying purchases.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".max-w-\\[300px\\]",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ffffff",
+               "contrastRatio": 2.53,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#9ca3af",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<footer class=\"bg-white border-t border-[#ECECEC] pt-[60px] pb-24 md:pb-[60px] mt-auto relative z-10\">",
+                 "target": Array [
+                   "footer",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.53 (foreground color: #9ca3af, background color: #ffffff, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"mt-[10px] text-[13px] text-[#9CA3AF]\">© <!-- -->2026<!-- --> SmartNivad. All rights reserved.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".mt-\\[10px\\].text-\\[\\#9CA3AF\\]",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - navigation [ref=e3]:
            - generic [ref=e5]:
                - link "SmartNivad Logo SmartNivad" [ref=e6] [cursor=pointer]:
                    - /url: /
                    - img "SmartNivad Logo" [ref=e7]
                    - text: SmartNivad
                - generic [ref=e8]:
                    - button "Search" [ref=e9]:
                        - img [ref=e10]
                    - link "Wishlist" [ref=e13] [cursor=pointer]:
                        - /url: /wishlist
                        - img [ref=e14]
                    - link "Sign In" [ref=e17] [cursor=pointer]:
                        - /url: /login
                        - img [ref=e18]
                    - button "Toggle menu" [ref=e22]:
                        - img [ref=e23]
        - main [ref=e24]:
            - generic [ref=e26]:
                - generic [ref=e27]:
                    - generic [ref=e28]:
                        - heading "Deal Finder" [level=1] [ref=e29]
                        - paragraph [ref=e30]: Filter thousands of AI-curated deals in real time.
                    - generic [ref=e32]:
                        - button "Audio" [ref=e33]:
                            - img [ref=e34]
                            - text: Audio
                        - button "Gaming" [ref=e36]:
                            - img [ref=e37]
                            - text: Gaming
                        - button "Laptops" [ref=e39]:
                            - img [ref=e40]
                            - text: Laptops
                        - button "Smartphones" [ref=e42]:
                            - img [ref=e43]
                            - text: Smartphones
                - generic [ref=e45]:
                    - button "Filters" [ref=e46]:
                        - img [ref=e47]
                        - text: Filters
                    - generic [ref=e48]:
                        - combobox "Sort deals" [ref=e49]:
                            - option "Most Popular" [selected]
                            - option "Newest First"
                            - option "Biggest Discount"
                            - 'option "Price: Low → High"'
                            - 'option "Price: High → Low"'
                            - option "Top Rated"
                        - img
                - generic [ref=e52]:
                    - generic [ref=e55]:
                        - generic [ref=e56]: "-29%"
                        - button "Save to wishlist" [ref=e58]:
                            - img [ref=e59]
                        - link "Sony WH-1000XM5 work and travel headphone deal 79 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago" [ref=e61] [cursor=pointer]:
                            - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
                            - generic [ref=e62]:
                                - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e63]
                                - 'generic "AI Score: 79/100 — Very Good" [ref=e65]':
                                    - generic [ref=e66]:
                                        - img [ref=e67]
                                        - generic [ref=e70]: "79"
                                    - generic [ref=e71]: Very Good
                            - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3] [ref=e72]
                            - generic [ref=e73]:
                                - img [ref=e74]
                                - img [ref=e76]
                                - img [ref=e78]
                                - img [ref=e80]
                                - img [ref=e82]
                                - generic [ref=e84]: "4.8"
                            - generic [ref=e85]:
                                - generic [ref=e86]: ₹24,990
                                - generic [ref=e87]: ₹34,990
                            - generic [ref=e88]:
                                - generic [ref=e89]: Croma
                                - generic [ref=e90]:
                                    - img [ref=e91]
                                    - generic [ref=e94]: 22 d ago
                        - generic [ref=e96]: Unavailable
                    - generic [ref=e99]:
                        - generic [ref=e100]: "-12%"
                        - button "Save to wishlist" [ref=e102]:
                            - img [ref=e103]
                        - link "MacBook Air M3 16GB for students and creators 69 Good MacBook Air M3 16GB for students and creators 4.8 ₹1,09,900 ₹1,24,900 Amazon 22 d ago" [ref=e105] [cursor=pointer]:
                            - /url: /product/macbook-air-m3-16gb-student-creator-deal
                            - generic [ref=e106]:
                                - img "MacBook Air M3 16GB for students and creators" [ref=e107]
                                - 'generic "AI Score: 69/100 — Good" [ref=e109]':
                                    - generic [ref=e110]:
                                        - img [ref=e111]
                                        - generic [ref=e114]: "69"
                                    - generic [ref=e115]: Good
                            - heading "MacBook Air M3 16GB for students and creators" [level=3] [ref=e116]
                            - generic [ref=e117]:
                                - img [ref=e118]
                                - img [ref=e120]
                                - img [ref=e122]
                                - img [ref=e124]
                                - img [ref=e126]
                                - generic [ref=e128]: "4.8"
                            - generic [ref=e129]:
                                - generic [ref=e130]: ₹1,09,900
                                - generic [ref=e131]: ₹1,24,900
                            - generic [ref=e132]:
                                - generic [ref=e133]: Amazon
                                - generic [ref=e134]:
                                    - img [ref=e135]
                                    - generic [ref=e138]: 22 d ago
                        - generic [ref=e140]: Unavailable
                    - generic [ref=e143]:
                        - generic [ref=e144]: "-11%"
                        - button "Save to wishlist" [ref=e146]:
                            - img [ref=e147]
                        - link "Samsung Galaxy S24 Ultra camera flagship offer 0 Good Samsung Galaxy S24 Ultra camera flagship offer 4.7 ₹1,19,999 ₹1,34,999 Flipkart 22 d ago" [ref=e149] [cursor=pointer]:
                            - /url: /product/samsung-galaxy-s24-ultra-camera-deal
                            - generic [ref=e150]:
                                - img "Samsung Galaxy S24 Ultra camera flagship offer" [ref=e151]
                                - 'generic "AI Score: 68/100 — Good" [ref=e153]':
                                    - generic [ref=e154]:
                                        - img [ref=e155]
                                        - generic [ref=e158]: "0"
                                    - generic [ref=e159]: Good
                            - heading "Samsung Galaxy S24 Ultra camera flagship offer" [level=3] [ref=e160]
                            - generic [ref=e161]:
                                - img [ref=e162]
                                - img [ref=e164]
                                - img [ref=e166]
                                - img [ref=e168]
                                - img [ref=e170]
                                - generic [ref=e172]: "4.7"
                            - generic [ref=e173]:
                                - generic [ref=e174]: ₹1,19,999
                                - generic [ref=e175]: ₹1,34,999
                            - generic [ref=e176]:
                                - generic [ref=e177]: Flipkart
                                - generic [ref=e178]:
                                    - img [ref=e179]
                                    - generic [ref=e182]: 22 d ago
                        - generic [ref=e184]: Unavailable
                    - generic [ref=e187]:
                        - generic [ref=e188]: "-18%"
                        - button "Save to wishlist" [ref=e190]:
                            - img [ref=e191]
                        - link "ASUS ROG Zephyrus G14 creator gaming deal 0 Good ASUS ROG Zephyrus G14 creator gaming deal 4.5 ₹1,39,990 ₹1,69,990 Amazon 22 d ago" [ref=e193] [cursor=pointer]:
                            - /url: /product/asus-rog-zephyrus-g14-creator-gaming-deal
                            - generic [ref=e194]:
                                - img "ASUS ROG Zephyrus G14 creator gaming deal" [ref=e195]
                                - 'generic "AI Score: 71/100 — Good" [ref=e197]':
                                    - generic [ref=e198]:
                                        - img [ref=e199]
                                        - generic [ref=e202]: "0"
                                    - generic [ref=e203]: Good
                            - heading "ASUS ROG Zephyrus G14 creator gaming deal" [level=3] [ref=e204]
                            - generic [ref=e205]:
                                - img [ref=e206]
                                - img [ref=e208]
                                - img [ref=e210]
                                - img [ref=e212]
                                - img [ref=e214]
                                - generic [ref=e216]: "4.5"
                            - generic [ref=e217]:
                                - generic [ref=e218]: ₹1,39,990
                                - generic [ref=e219]: ₹1,69,990
                            - generic [ref=e220]:
                                - generic [ref=e221]: Amazon
                                - generic [ref=e222]:
                                    - img [ref=e223]
                                    - generic [ref=e226]: 22 d ago
                        - generic [ref=e228]: Unavailable
                    - generic [ref=e231]:
                        - generic [ref=e232]: "-21%"
                        - button "Save to wishlist" [ref=e234]:
                            - img [ref=e235]
                        - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago" [ref=e237] [cursor=pointer]:
                            - /url: /product/nothing-phone-2a-clean-android-midrange-deal
                            - generic [ref=e238]:
                                - img "Nothing Phone 2a clean Android midrange deal" [ref=e239]
                                - 'generic "AI Score: 73/100 — Good" [ref=e241]':
                                    - generic [ref=e242]:
                                        - img [ref=e243]
                                        - generic [ref=e246]: "0"
                                    - generic [ref=e247]: Good
                            - heading "Nothing Phone 2a clean Android midrange deal" [level=3] [ref=e248]
                            - generic [ref=e249]:
                                - img [ref=e250]
                                - img [ref=e252]
                                - img [ref=e254]
                                - img [ref=e256]
                                - img [ref=e258]
                                - generic [ref=e260]: "4.4"
                            - generic [ref=e261]:
                                - generic [ref=e262]: ₹21,999
                                - generic [ref=e263]: ₹27,999
                            - generic [ref=e264]:
                                - generic [ref=e265]: Flipkart
                                - generic [ref=e266]:
                                    - img [ref=e267]
                                    - generic [ref=e270]: 22 d ago
                        - generic [ref=e272]: Unavailable
                    - generic [ref=e275]:
                        - generic [ref=e276]: "-27%"
                        - button "Save to wishlist" [ref=e278]:
                            - img [ref=e279]
                        - link "Logitech MX Master 3S productivity mouse deal 0 Very Good Logitech MX Master 3S productivity mouse deal 4.7 ₹7,995 ₹10,995 Amazon 22 d ago" [ref=e281] [cursor=pointer]:
                            - /url: /product/logitech-mx-master-3s-productivity-mouse-deal
                            - generic [ref=e282]:
                                - img "Logitech MX Master 3S productivity mouse deal" [ref=e283]
                                - 'generic "AI Score: 78/100 — Very Good" [ref=e285]':
                                    - generic [ref=e286]:
                                        - img [ref=e287]
                                        - generic [ref=e290]: "0"
                                    - generic [ref=e291]: Very Good
                            - heading "Logitech MX Master 3S productivity mouse deal" [level=3] [ref=e292]
                            - generic [ref=e293]:
                                - img [ref=e294]
                                - img [ref=e296]
                                - img [ref=e298]
                                - img [ref=e300]
                                - img [ref=e302]
                                - generic [ref=e304]: "4.7"
                            - generic [ref=e305]:
                                - generic [ref=e306]: ₹7,995
                                - generic [ref=e307]: ₹10,995
                            - generic [ref=e308]:
                                - generic [ref=e309]: Amazon
                                - generic [ref=e310]:
                                    - img [ref=e311]
                                    - generic [ref=e314]: 22 d ago
                        - generic [ref=e316]: Unavailable
                - generic [ref=e317]:
                    - generic [ref=e318]:
                        - heading "Browse by Store" [level=2] [ref=e319]
                        - paragraph [ref=e320]: Find deals from your favourite retailers.
                    - generic [ref=e322]:
                        - link "🏪 Amazon" [ref=e323] [cursor=pointer]:
                            - /url: /store/amazon
                            - generic [ref=e324]: 🏪
                            - generic [ref=e325]: Amazon
                        - link "🏪 Croma" [ref=e326] [cursor=pointer]:
                            - /url: /store/croma
                            - generic [ref=e327]: 🏪
                            - generic [ref=e328]: Croma
                        - link "🏪 Flipkart" [ref=e329] [cursor=pointer]:
                            - /url: /store/flipkart
                            - generic [ref=e330]: 🏪
                            - generic [ref=e331]: Flipkart
        - contentinfo [ref=e332]:
            - generic [ref=e333]:
                - generic [ref=e334]:
                    - heading "SN SmartNivad ." [level=3] [ref=e335]:
                        - generic [ref=e336]: SN
                        - text: SmartNivad
                        - generic [ref=e337]: .
                    - paragraph [ref=e338]:
                        - text: Discover AI-powered tech deals.
                        - text: We analyse thousands of products daily
                        - text: to help you buy smarter.
                - generic [ref=e339]:
                    - link "📸 Instagram" [ref=e340] [cursor=pointer]:
                        - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                    - link "✈️ Telegram" [ref=e341] [cursor=pointer]:
                        - /url: https://t.me/SmartNivad
                - generic [ref=e343]:
                    - generic [ref=e344]:
                        - heading "Deals" [level=4] [ref=e345]
                        - generic [ref=e346]:
                            - link "All Deals" [ref=e347] [cursor=pointer]:
                                - /url: /deals
                            - link "Hot Deals" [ref=e348] [cursor=pointer]:
                                - /url: /deals?type=HOT
                            - link "Coupons" [ref=e349] [cursor=pointer]:
                                - /url: /coupons
                            - link "Compare" [ref=e350] [cursor=pointer]:
                                - /url: /compare
                    - generic [ref=e351]:
                        - heading "Content" [level=4] [ref=e352]
                        - generic [ref=e353]:
                            - link "Blog" [ref=e354] [cursor=pointer]:
                                - /url: /blog
                            - link "Quiz" [ref=e355] [cursor=pointer]:
                                - /url: /quiz-answers
                            - link "Stores" [ref=e356] [cursor=pointer]:
                                - /url: /store
                            - link "Brands" [ref=e357] [cursor=pointer]:
                                - /url: /brand
                    - generic [ref=e358]:
                        - heading "Legal" [level=4] [ref=e359]
                        - generic [ref=e360]:
                            - link "About" [ref=e361] [cursor=pointer]:
                                - /url: /about
                            - link "Contact" [ref=e362] [cursor=pointer]:
                                - /url: /contact
                            - link "Privacy" [ref=e363] [cursor=pointer]:
                                - /url: /privacy
                            - link "Terms" [ref=e364] [cursor=pointer]:
                                - /url: /terms
                            - link "Disclaimer" [ref=e365] [cursor=pointer]:
                                - /url: /disclaimer
                - generic [ref=e367]:
                    - paragraph [ref=e368]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                    - paragraph [ref=e369]: © 2026 SmartNivad. All rights reserved.
        - navigation [ref=e370]:
            - img
            - generic [ref=e371]:
                - link "Home" [ref=e372] [cursor=pointer]:
                    - /url: /
                    - img [ref=e374]
                    - generic [ref=e377]: Home
                - link "Deals" [ref=e378] [cursor=pointer]:
                    - /url: /deals
                    - img [ref=e380]
                    - generic [ref=e383]: Deals
                - link "Wishlist" [ref=e384] [cursor=pointer]:
                    - /url: /wishlist
                    - img [ref=e386]
                    - generic [ref=e388]: Wishlist
                - link "Coupons" [ref=e389] [cursor=pointer]:
                    - /url: /coupons
                    - img [ref=e391]
                    - generic [ref=e395]: Coupons
                - link "Compare" [ref=e396] [cursor=pointer]:
                    - /url: /compare
                    - img [ref=e398]
                    - generic [ref=e401]: Compare
        - button "Open AI Assistant" [ref=e402]:
            - img [ref=e403]
    - button "Open Next.js Dev Tools" [ref=e412] [cursor=pointer]:
        - img [ref=e413]
    - alert [ref=e416]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import AxeBuilder from "@axe-core/playwright";
  3  |
  4  | test.describe("Accessibility WCAG 2.2 AA Sweep", () => {
  5  |   test("Homepage passes accessibility checks", async ({ page }) => {
  6  |     await page.goto("/");
  7  |
  8  |     const accessibilityScanResults = await new AxeBuilder({ page })
  9  |       .withTags([
  10 |         "wcag2a",
  11 |         "wcag2aa",
  12 |         "wcag21a",
  13 |         "wcag21aa",
  14 |         "wcag22a",
  15 |         "wcag22aa",
  16 |       ])
  17 |       .analyze();
  18 |
  19 |     expect(accessibilityScanResults.violations).toEqual([]);
  20 |   });
  21 |
  22 |   test("Deals page passes accessibility checks", async ({ page }) => {
  23 |     await page.goto("/deals");
  24 |
  25 |     // Wait for network/hydration
  26 |     await page.waitForTimeout(1000);
  27 |
  28 |     const accessibilityScanResults = await new AxeBuilder({ page })
  29 |       .withTags([
  30 |         "wcag2a",
  31 |         "wcag2aa",
  32 |         "wcag21a",
  33 |         "wcag21aa",
  34 |         "wcag22a",
  35 |         "wcag22aa",
  36 |       ])
  37 |       .analyze();
  38 |
> 39 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  40 |   });
  41 | });
  42 |
```
