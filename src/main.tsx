import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router";
import { RootLayout } from "./RootLayout.tsx";
import { CounterPage } from "./pages/CounterPage.tsx";
import { ExportPage } from "./pages/ExportPage.tsx";
import { ManualPage } from "./pages/ManualPage.tsx";
import { SetupPage } from "./pages/SetupPage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <CounterPage /> },
      { path: "setup", element: <SetupPage /> },
      { path: "export", element: <ExportPage /> },
      { path: "manual", element: <ManualPage /> }
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
