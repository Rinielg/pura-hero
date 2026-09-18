import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { SiteLayout } from './site/Layout'
import { Care, ForBusiness, MyHealth, NotFound, PuraAI, Wellness, WhyPura } from './site/Pages'
import './styles.css'
import './site.css'

/**
 * Two kinds of route.
 *
 * `/` is the scroll sequence: it owns the viewport, runs ScrollSmoother and
 * paints its own fixed layer stack, so it sits OUTSIDE the document layout and
 * renders the shared nav itself.
 *
 * Everything else is an ordinary page inside `SiteLayout`, which adds the same
 * nav plus a footer. Both get the identical menu, which is the point.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<SiteLayout />}>
          <Route path="/my-health" element={<MyHealth />} />
          <Route path="/care" element={<Care />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/pura-ai" element={<PuraAI />} />
          <Route path="/why-pura" element={<WhyPura />} />
          <Route path="/for-business" element={<ForBusiness />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
