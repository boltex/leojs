/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/Layout/index.tsx
 *
 * Reason for overriding:
 * - Removed the navbar. It's been moved to the top of the docs page ({@link ../../DocRoot/Layout/index.tsx}).
 */

import React from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom'; // Import useLocation
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { PageMetadata, SkipToContentFallbackId, ThemeClassNames } from '@docusaurus/theme-common';
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type { Props } from '@theme/Layout';
import Navbar from '@theme/Navbar'; // Ensure Navbar is imported
import styles from '@docusaurus/theme-classic/src/theme/Layout/styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Layout(props: Props): JSX.Element {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
  useKeyboardNavigation();
    const { siteConfig } = useDocusaurusContext();
  const location = useLocation(); // Get the current URL pathname
  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <AnnouncementBar />

      {location.pathname === siteConfig.baseUrl && <Navbar />} {/* Conditionally render Navbar */}

      <div
        id={SkipToContentFallbackId}
        className={clsx(ThemeClassNames.wrapper.main, styles.mainWrapper, wrapperClassName)}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProvider>
  );
}
