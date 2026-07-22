import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router";
import { RootLayout } from "./RootLayout.tsx";
import { CounterPage } from "./features/counter/pages/CounterPage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <CounterPage /> },
      {
        path: "setup",
        lazy: () => import("./pages/SetupPage.tsx").then(({ SetupPage: Component }) => ({ Component }))
      },
      {
        path: "export",
        lazy: () => import("./pages/ExportPage.tsx").then(({ ExportPage: Component }) => ({ Component }))
      },
      {
        path: "feedback",
        lazy: () => import("./features/feedback/pages/FeedbackSettingsPage.tsx").then(({ FeedbackSettingsPage: Component }) => ({ Component }))
      },
      {
        path: "manual",
        lazy: () => import("./pages/ManualPage.tsx").then(({ ManualPage: Component }) => ({ Component }))
      },
      {
        path: "changelog",
        lazy: () => import("./pages/ChangelogPage.tsx").then(({ ChangelogPage: Component }) => ({ Component }))
      }
    ]
  }
]);

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("找不到 #root，請確認 index.html 未被修改。")
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
