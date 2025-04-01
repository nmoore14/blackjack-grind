import React from 'react';
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/start";
import { createRouter } from "./router";

const router = createRouter();

// Ensure we're in a browser environment
if (typeof window !== 'undefined') {
  hydrateRoot(document, <StartClient router={router} />);
}
