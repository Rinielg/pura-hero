import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { SiteLayout } from './site/Layout'
import { NotFound, SitePage } from './site/Pages'
import { PAGES } from './site/content'
import './styles.css'
import './site.css'

/**
 * Two kinds of route.
 *
 * `/` is the scroll sequence: it owns the viewport, runs ScrollSmoother and
 * paints its own fixed layer stack, so it sits OUTSIDE the document layout and
 * renders the shared nav itself.
 *
 * Everything else is an ordinary page inside `SiteLayout`. The routes are
 * generated from `PAGES`, so the menu, the pages and the router cannot drift
 * apart — a dropdown entry with no page would 404 loudly rather than quietly.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<SiteLayout />}>
          {Object.keys(PAGES).map((path) => (
            <Route key={path} path={path} element={<SitePage />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
